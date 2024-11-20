from fastapi import FastAPI
from .routers.student_router import student_router
from .routers.auth_router import auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# Include the routes
app.include_router(student_router)
app.include_router(auth_router)
