from pymongo import MongoClient
import gridfs

# MongoDB setup
client = MongoClient("mongodb://localhost:27017")  # Replace with your MongoDB connection string
db = client['student_db']
student_collection = db['students']
fs = gridfs.GridFS(db)  # GridFS for file handling
