from pymongo import MongoClient
import gridfs
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB setup
mongodb_uri = os.getenv('MONGODB_URI')
client = MongoClient(mongodb_uri)

db = client['student_db']
student_collection = db['students']
attendance_collection = db['attendancelog']
user_collection = db['users']
fs = gridfs.GridFS(db)  # GridFS for file handling
