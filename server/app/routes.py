from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from .models import Student
from .database import student_collection, fs
from bson import ObjectId
from typing import Optional

student_router = APIRouter()

# @student_router.post("/register_student")
# async def register_student(student: Student):
#     print(student)
#     existing_student = student_collection.find_one({"banner_id": student.banner_id})
#     if existing_student:
#         raise HTTPException(status_code=400, detail="Student with this banner ID already exists")

#     image_id = None

#     student_data = student.dict()
#     student_data["image_id"] = str(image_id) if image_id else None

#     student_collection.insert_one(student_data)

#     return {"message": "Student registered successfully", "student_id": str(student_data["_id"])}


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
