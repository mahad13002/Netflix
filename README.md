## Setup Instructions

Follow these steps to set up and run the project on your local machine.

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

3. **Download csv file**:
    Follow this link: https://www.kaggle.com/datasets/asaniczka/tmdb-movies-dataset-2023-930k-movies?select=TMDB_movie_dataset_v11.csv 
    Download the dataset as a zip
    Once downloaded, unzip the file and place it in the backend folder

4. **Clean the dataset**:
   Ensure that you are in the backend in the terminal. If not run: cd backend
   Next run: python cleaning_dataset.py 
   This will clean the dataset so only necessary coloumns are left.
   Once cleaned a new file will appear called: tmdb_movies_cleaned.csv
   File path is already pre-loaded in the app.py 

5. **Run the flask application**:
   Navigate to backend if not done already: cd backend
   run the application: python app.py


**Additional Notes**

- Ensure both frontend and backend are running at the same time so you can see recommendations once you click onto a movie title

