from fastapi import APIRouter, HTTPException, Depends, Form
from ..database import user_collection
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from ..services import get_password_hash, verify_password, create_access_token

auth_router = APIRouter()

@auth_router.post("/signup")
async def signup(bannerId: str = Form(...), email: str = Form(...), password: str = Form(...), name: str = Form(...), role: str = Form(...)):
    # Check if username or email already exists
    if user_collection.find_one({"bannerId": bannerId}):
        raise HTTPException(status_code=400, detail="bannerId already registered")
    if user_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password and register new user
    hashed_password = get_password_hash(password)
    user_role = role or "admin"
    user_details = {"name": name, "bannerId": bannerId, "email": email, "hashed_password": hashed_password, "role": user_role}
    user_collection.insert_one(user_details)

    return {"message": "User created successfully"}

@auth_router.post("/signin")
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

    return {"access_token": access_token, "token_type": "bearer", "role": user_dict['role']}

