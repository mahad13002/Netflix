## Setup Instructions

Follow these steps to set up and run the project on your local machine.



### Backend Setup (Flask)
1. **Install Flask dependencies**:
   You need to install the required Python packages for the backend:
   ```bash
   pip install flask-cors
   pip install Flask pandas

2. **Create a virtual environemnt to manage the dependencies**:
   python 3 -m venv venv

   To activate:
   Mac: source venv/bin/activate
   Windows: venv/Scripts/activate 

3. **Navigate to backend and run the flask application**:
   cd backend
   python app.py

### Frontend Setup (Node.js)
1. **Install Node.js and npm**:
   Download and install the latest version from https://nodejs.org/ (do this if you dont have it installed)
   Verify Installation: node -v  npm -v

2. **Install frontend dependencies**:
   Navigate to the frontend folder: cd my-app
   Install dependencies: npm install

3. **Run frontend application**:
   npm start

   This will start a development server and open your project in the browser (usually at http://localhost:3000). 

**Additional Notes**

- Ensure both frontend and backend are running at the same time so you can see recommendations once you click onto a movie title

