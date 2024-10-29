# Prerequisites
## python version 3.10.2
Install any python version above 3.10

## download cmake library 
- download cmake library from its [official website](https://cmake.org/download/) which is needed for installing face_recognition module
- make sure to select "ADD to PATH" while installing
- confirm the installation by running 
```
cmake --version
```

## download C# tools from visual studio (for Windows users)
- download visual studio(its not visual studio code) from its [official site](https://visualstudio.microsoft.com/downloads/) which is needed for installing face_recognition module
- After installing, in the installer menu, look for the "Desktop development with C++" workload and install it

# Dev Setup
- Install dependencies

```
pip install -r requirements.txt
```

## if errors while installing dlib
- If you face any issues while installing dlib, download the wheel file for your specific python version from here
https://github.com/z-mahmud22/Dlib_Windows_Python3.x
- checkout to downloaded directory or whereever you moved the downloaded file
```
cd C:\Users\YourUsername\Downloads
```
- install the dlib wheel file
```
pip install <filename.whl>
```

## Update MongoDB URI
- After successful installation, update the mongodb URI in [database.py](./app/database.py) file

## Create .env file
To securely manage your environment variables, create a `.env` file in the root directory of your project. Include the following lines to that file:

```plaintext
GOOGLE_API_KEY=your_google_api_key_here

# production
# MONGODB_URI=your_mongodb_uri
# development
# MONGODB_URI="mongodb://uav_user:uavPassword@localhost:27017/?authSource=admin"
MONGODB_URI="mongodb://localhost:27017"

```

## Run application

```
uvicorn app.main:app --reload
```