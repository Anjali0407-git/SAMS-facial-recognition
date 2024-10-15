# tests/test_routes.py

import pytest
from httpx import AsyncClient
from app.main import app
import base64
import random
from PIL import Image
import io


def create_placeholder_image():
    # Generate a random color
    color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
    
    # Create a small square image with the random color
    image = Image.new('RGB', (100, 100), color=color)
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    
    # Return the base64-encoded image
    return "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode('utf-8')

# Use this in your test
placeholder_image = create_placeholder_image()

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.mark.asyncio
async def test_read_main():
    async with AsyncClient(app=app, base_url="http://localhost:8000") as ac:
        response = await ac.get("/dashboard")
    assert response.status_code == 404
    # assert response.json() == {"message": "Welcome to the Student API"}  # Adjust to your actual response

# @pytest.mark.asyncio
# async def test_student_router():
#     """Test the student router for correct response."""
#     async with AsyncClient(app=app, base_url="http://localhost:8000") as ac:
#         response = await ac.get("/get_attendance_logs")  # Adjust the endpoint based on your routes
#     assert response.status_code == 200
#     # assert "students" in response.json()  # Adjust based on actual response

# @pytest.mark.asyncio
# async def test_register_student():
#     placeholder_image = create_placeholder_image()  # Call the function to get the base64 image
#     async with AsyncClient(app=app, base_url="http://localhost:8000") as ac:
#         banner_id = str(random.randint(10000, 99999)) 
#         payload = {
#             "banner_id": banner_id,
#             "first_name": "John",
#             "last_name": "Doe",
#             "age": 20,
#             "email": "john@example.com",
#             "image": placeholder_image,  # Use the valid base64 image string
#             "course_name": "Computer Science",  # Add this line
#             "university_name": "Saint Louis University"  # Add this line
#         }
#         response = await ac.post("/register_student", json=payload)

#     print(response.status_code, response.json())  # Print status and response content for debugging
#     assert response.status_code == 200
#     assert response.json()["message"] == "Student registered successfully"


@pytest.mark.asyncio
async def test_invalid_route():
    async with AsyncClient(app=app, base_url="http://localhost:8000") as ac:
        response = await ac.get("/invalid_route")
    assert response.status_code == 404