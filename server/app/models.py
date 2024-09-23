from pydantic import BaseModel
from typing import Optional

# Pydantic model for input validation
class Student(BaseModel):
    first_name: str
    last_name: str
    banner_id: str
    course_name: str
    university_name: str
    image: Optional[str]  # To store image filename or ID
