## Setup Instructions

Follow these steps to set up and run the project on your local machine.

### Frontend Setup (Node.js)
1. **Install Node.js and npm**:
   Download and install the latest version from https://nodejs.org/ (do this if you don't have it installed)
   Verify installation: node -v  npm -v

2. **Install frontend dependencies**:
   Navigate to the frontend folder: cd my-app
   Install dependencies: npm install

3. **Run frontend application**:
   npm start

   This will start a development server and open the project in the browser (usually at http://localhost:3000). 

### Backend Setup (Flask)

1. **Create a virtual environment**:
   python3 -m venv venv

   To activate:
   Mac: source venv/bin/activate
   Windows: venv/Scripts/activate 

2. **Install required dependencies**:
   You need to install the required packages for the backend:

   pip install -r requirements.txt

3. **Download the dataset file**:
    Download the dataset from: https://www.kaggle.com/datasets/asaniczka/tmdb-movies-dataset-2023-930k-movies?select=TMDB_movie_dataset_v11.csv 
    Download the dataset as a zip file
    Once downloaded, unzip the file and place it in the backend directory

4. **Clean the dataset**:
   Run the cleaning script from backend directory:

   cd backend # if not already there
   python cleaning_dataset.py

   This will clean the dataset so only necessary columns are left
   Once cleaned a new file will appear called: tmdb_movies_cleaned.csv

   The file path is already pre-configured in app.py 

5. **Run the Flask backend server**:
   cd backend # if not already there
   python app.py 


**Additional Notes**

- Ensure both frontend and backend are running at the same time so you can view recommendations when clicking on a movie

