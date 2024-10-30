from passlib.context import CryptContext
from jose import jwt
from typing import Optional
from datetime import timedelta, datetime
from geopy.distance import geodesic
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Setup password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Define a list of allowed locations (latitude, longitude)
allowed_locations = [
    (34.0522, -118.2437),  # Los Angeles
    (38.640026, -90.249626) # westend
    # (38.6271354, -90.2338565), # Gratiot
    # (38.6357103, -90.2317842) # Grand 
]

# Hash password
def get_password_hash(password):
    return pwd_context.hash(password)

# Verify password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Create JWT token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta if expires_delta else datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, "SECRET_KEY", algorithm="HS256")

def is_within_allowed_area(lat, lon, allowed_locations=allowed_locations, max_distance=100):  # max_distance in kilometers
    current_location = (lat, lon)
    print('current location', current_location)
    for location in allowed_locations:
        distance = geodesic(current_location, location).kilometers
        if distance <= max_distance:
            return True
    return False

def get_location_label(lat, lng):
        api_key = os.getenv('GOOGLE_API_KEY')
        base_url = "https://maps.googleapis.com/maps/api/geocode/json"
        endpoint = f"{base_url}?latlng={lat},{lng}&key={api_key}"
        response = requests.get(endpoint)
        if response.status_code == 200:
            results = response.json().get('results')
            if results:
                return results[0].get('formatted_address')  # Return the full address as label
        return "Unknown location"