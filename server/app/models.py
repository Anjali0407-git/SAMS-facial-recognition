from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Pydantic model for input validation
class Student(BaseModel):
    first_name: str
    last_name: str
    banner_id: str
    course_name: str
    university_name: str
    image: Optional[str] = Field(None, description="encoded image string")


class AttendanceLog(BaseModel):
    student_id: str
    time_stamp: datetime = Field(default_factory=datetime.utcnow, description="attendance timestamp")

class StudentImage(BaseModel):
    encoded_image: Optional[str] = Field(None, description="encoded image string")
    latitude: float
    longitude: float