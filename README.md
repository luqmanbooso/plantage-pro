# Plantage-Pro

This guide explains how to set up, install packages, and run the project locally. 

## Backend Setup

The backend of this project is built with Python. Follow the steps below to initialize the virtual environment, install the required packages, and run the backend server.

### 1. Open a Terminal
Navigate to the root directory `plantage-pro` and then enter the `backend` directory:
```bash
cd backend
```

### 2. Create a Virtual Environment (If not already created)
To isolate project dependencies, create a Python virtual environment named `venv`:
```bash
python -m venv venv
```

### 3. Install Dependencies
Install all the required Python packages from the `requirements.txt` file by using the `pip` executable within your virtual environment:
```bash
.\venv\Scripts\pip.exe install -r requirements.txt
```

### 4. Run the Backend Server
Once the packages are installed, you can start the application using the Python executable from the virtual environment:
```bash
.\venv\Scripts\python.exe app.py
```

## Frontend Setup

### 1. Open a New Terminal
Navigate to the `frontend` directory:
```bash
cd frontend
```

### 2. Install Packages
Install the required Node.js packages:
```bash
npm install
```

### 3. Run the Frontend Server
Start the frontend development server:
```bash
npm run dev
```

---
**Note:** Ensure you keep both the backend and frontend terminals running simultaneously for full functionality.
