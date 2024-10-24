from pymongo import MongoClient
import gridfs

# MongoDB setup
# client = MongoClient("mongodb://uav_user:uavPassword@localhost:27017/?authSource=admin")  # Replace with your MongoDB connection string
# client = MongoClient("mongodb://localhost:27017") # without any authentication
client = MongoClient("mongodb+srv://anjaliputtha05:123@sams.mo3st.mongodb.net/?retryWrites=true&w=majority&appName=SAMS")
db = client['student_db']
student_collection = db['students']
attendance_collection = db['attendancelog']
user_collection = db['users']
fs = gridfs.GridFS(db)  # GridFS for file handling
