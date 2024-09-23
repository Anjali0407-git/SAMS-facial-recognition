from fastapi import APIRouter, HTTPException, File, UploadFile
from .models import Student
from .database import student_collection, fs
from bson import ObjectId
from typing import Optional

student_router = APIRouter()

@student_router.post("/register_student")
async def register_student(student: Student, image: Optional[UploadFile] = File(None)):
    # Check if student with the same banner ID exists
    existing_student = student_collection.find_one({"banner_id": student.banner_id})
    if existing_student:
        raise HTTPException(status_code=400, detail="Student with this banner ID already exists")

    # Save the image if provided
    image_id = None
    if image:
        image_id = fs.put(image.file, filename=image.filename)

    # Insert student data into MongoDB
    student_data = {
        "first_name": student.first_name,
        "last_name": student.last_name,
        "banner_id": student.banner_id,
        "course_name": student.course_name,
        "university_name": student.university_name,
        "image_id": str(image_id) if image_id else None
    }
    student_collection.insert_one(student_data)

    return {"message": "Student registered successfully", "student_id": str(student_data["_id"])}
