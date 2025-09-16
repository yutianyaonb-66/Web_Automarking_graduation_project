# Web_Automarking_graduation_project

Web_Automarking is a school course management system developed as a graduation project. It is built using Vue.js for the frontend and Node.js + Express for the backend. The system provides automated tools for course management and programming assignments evaluation, including registration, course selection, code plagiarism detection, automated grading, and more.

# Features

User Registration & Login – Students and teachers can create accounts and log in securely.

Course Selection – Students can browse and select courses for the semester.

Automated Code Checking – Supports automatic testing and verification of submitted programming assignments.

Plagiarism Detection – Checks code submissions for duplication to ensure originality.

Automated Grading – Provides instant grading for assignments based on predefined rules or test cases.

Teacher Dashboard – Teachers can view submissions, check plagiarism reports, and manage courses.

# Tech Stack

Frontend: Vue.js

Backend: Node.js + Express

Database: (Specify your database, e.g., MongoDB, MySQL)

Other Tools: (Optional: e.g., Docker, Webpack, ESLint)

# Installation

1.Clone the repository:

git clone https://github.com/yourusername/web_automarking.git
cd web_automarking

2.Install backend dependencies:

cd backend
npm install

3.Install frontend dependencies:

cd ../frontend
npm install

4.Configure environment variables:
Create a .env file in the backend folder with your database and other configurations. Example:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=web_automarking
PORT=3000

5.Run the backend server:

cd backend
npm start

6.Run the frontend server:

cd frontend
npm run serve

# Usage

Open your browser and visit http://localhost:8080 (frontend)

Register as a student or teacher, log in, and explore the system.

# License

This project is for educational purposes and is not intended for commercial use.
