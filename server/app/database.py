from pymongo import MongoClient
import gridfs

# MongoDB setup
client = MongoClient("mongodb://uav_user:uavPassword@localhost:27017/?authSource=admin")  # Replace with your MongoDB connection string
# client = MongoClient("mongodb://localhost:27017") # without any authentication
db = client['student_db']
student_collection = db['students']
fs = gridfs.GridFS(db)  # GridFS for file handling
