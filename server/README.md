# Prerequisites
python version 3.10.2

# download cmake library 
- download cmake library from its [official website](https://cmake.org/download/) which is needed for installing face_recognition module
- make sure to select "ADD to PATH" while installing
- confirm the installation by running 
```
cmake --version
```

# download C# tools from visual studio
- download visual studio(its not visual studio code) from its [official site](https://visualstudio.microsoft.com/downloads/) which is needed for installing face_recognition module
- After installing, in the installer menu, look for the "Desktop development with C++" workload and install it

# dev setup
- Install dependencies

```
pip install -r requirements.txt
```
- Run application

```
uvicorn app.main:app --reload
```