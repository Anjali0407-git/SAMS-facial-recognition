from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form, Query
from .models import Student, StudentImage, AttendanceLog
from .database import student_collection, fs, attendance_collection
from bson import ObjectId
from typing import Optional
import base64  # Import base64 module for decoding
from PIL import Image  # Import from Pillow to handle image
import io  # For handling byte streams
import numpy as np  # Handling arrays
import face_recognition
from datetime import datetime

student_router = APIRouter()

@student_router.post("/register_student")
async def register_student(student: Student):
    print(student)
    existing_student = student_collection.find_one({"banner_id": student.banner_id})
    if existing_student:
        raise HTTPException(status_code=400, detail="Student with this banner ID already exists")

    student_data = student.dict()
    student_data["image"] = str(student.image)

    student_collection.insert_one(student_data)

    return {"message": "Student registered successfully", "student_id": str(student_data["_id"])}

# Function to convert base64 to an image
def base64_to_image(base64_str):
    image_data = base64.b64decode(base64_str)
    image = Image.open(io.BytesIO(image_data))
    return np.array(image)  # Convert to numpy array

@student_router.post("/facial_recognition")
async def facial_recognition(attendance_data: StudentImage):
    encoded_image = attendance_data.encoded_image
    # Convert base64 string to an image
    input_image = base64_to_image(encoded_image.split(",")[1])  # Remove the header of base64
    input_face_encodings = face_recognition.face_encodings(input_image)

    if len(input_face_encodings) == 0:
        raise HTTPException(status_code=400, detail="No faces found in the image.")

    # Check against each student in the database
    for student in student_collection.find():
        # we have student["image"] is stored as a base64 string
        student_image = base64_to_image(student["image"].split(",")[1])
        known_face_encodings = face_recognition.face_encodings(student_image)

        if (face_recognition.compare_faces(known_face_encodings, input_face_encodings[0], tolerance=0.6) == [np.True_]):
            attendance_logs = dict()
            attendance_logs['student_id'] = student["banner_id"]
            attendance_logs['timestamp'] = datetime.utcnow()
            print("attendance_logs", attendance_logs)
            attendance_collection.insert_one(attendance_logs)
            return {"message": "Attendance successful", "student_name": student["first_name"], "banner_id": student["banner_id"]}

    raise HTTPException(status_code=404, detail="Student not recognized")


@student_router.get("/get_attendance_logs")
async def get_attendance_logs(date: Optional[str] = Query(None), id: Optional[str] = Query(None)):
    try:
        query = {}

        # If a date is provided, filter logs by the specified date
        if date:
            log_date = datetime.strptime(date, "%Y-%m-%d")
            query["timestamp"] = {"$gte": log_date, "$lt": log_date.replace(hour=23, minute=59, second=59)}

        # If an ID is provided, filter logs by the student ID
        if id:
            query["student_id"] = {"$regex": id}

        # Fetch logs based on the query (filtered by date, id, or both)
        logs = attendance_collection.find(query)

        result = []
        for log in logs:
            student = student_collection.find_one({"banner_id": log['student_id']})
            if student:
                result.append({
                    "student_name": student["first_name"],
                    "student_id": log["student_id"],
                    "timestamp": log["timestamp"]
                })       
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Utility to hash the password
def hash_password(password: str):
    return pwd_context.hash(password)

# Utility to verify the password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@student_router.post("/signup")
async def signup(student: Student):
    # Check if student already exists
    existing_student = student_collection.find_one({"banner_id": student.banner_id})
    if existing_student:
        raise HTTPException(status_code=400, detail="Student with this banner ID already exists")
    
    # Hash the password before storing it
    hashed_password = hash_password(student.password)
    student_data = student.dict()
    student_data['password'] = hashed_password
    
    # Save to MongoDB
    student_collection.insert_one(student_data)
    return {"message": "Student registered successfully", "student_id": str(student_data["_id"])}

@student_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = student_collection.find_one({"banner_id": form_data.username})
    if not user or not verify_password(form_data.password, user['password']):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    # Create a token
    token_expires = timedelta(minutes=60)
    token = jwt.encode({"sub": user["banner_id"], "exp": datetime.utcnow() + token_expires}, "SECRET_KEY", algorithm="HS256")
    
    return {"access_token": token, "token_type": "bearer"}
