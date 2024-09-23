from fastapi import FastAPI
from .routes import student_router

app = FastAPI()

# Include the routes
app.include_router(student_router)
