from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form, Query
from .models import Student, StudentImage, AttendanceLog
from .database import student_collection, fs, attendance_collection, user_collection
from bson import ObjectId
from typing import Optional
import base64  # Import base64 module for decoding
from PIL import Image  # Import from Pillow to handle image
import io  # For handling byte streams
import numpy as np  # Handling arrays
import face_recognition
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .services import get_password_hash, verify_password, create_access_token

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


@student_router.post("/signup")
async def signup(bannerId: str = Form(...), email: str = Form(...), password: str = Form(...), name: str = Form(...)):
    # Check if username or email already exists
    if user_collection.find_one({"bannerId": bannerId}):
        raise HTTPException(status_code=400, detail="bannerId already registered")
    if user_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password and register new user
    hashed_password = get_password_hash(password)
    user_details = {"name": name, "bannerId": bannerId, "email": email, "hashed_password": hashed_password}
    user_collection.insert_one(user_details)

    return {"message": "User created successfully"}

@student_router.post("/signin")
async def signin(form_data: OAuth2PasswordRequestForm = Depends()):
    # Attempt to retrieve user by username or email
    user_dict = user_collection.find_one({"$or": [{"bannerId": form_data.username}, {"email": form_data.username}]})
    if not user_dict:
        raise HTTPException(status_code=401, detail="Incorrect bannerId/email or password")
    
    # Verify password
    if not verify_password(form_data.password, user_dict['hashed_password']):
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(data={"sub": user_dict['bannerId']}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}

@student_router.get("/get_student_courses")
async def get_student_courses(bannerId: str):
    try:
        # Find the student by their banner_id
        student = student_collection.find_one({"banner_id": bannerId})
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        # Fetch course_name and university_name from the document
        courses = [student.get("course_name", "No course registered")]
        university_name = student.get("university_name", "No university information")

        return {
            "first_name": student["first_name"],
            "courses": courses,  # Returning the course as a list for consistency
            "university_name": university_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))