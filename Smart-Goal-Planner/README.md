Smart Goal Planner
A financial goal management dashboard that allows users to create, track, and manage multiple savings goals, allocate deposits, and monitor their progress towards each objective. This application simulates a backend API using json-server for data persistence.

Table of Contents
Project Overview

Core Features

Technologies Used

Setup Instructions

Backend (json-server) Setup

Frontend (React) Setup

How to Use

Project Overview
The Smart Goal Planner is designed to help users visualize and achieve their financial aspirations. It provides a user-friendly interface to define savings goals, set target amounts and deadlines, and track real-time progress. All goal data is persisted locally using a db.json file served by json-server, enabling full CRUD (Create, Read, Update, Delete) functionality.

Core Features
Data Management & Persistence:

All goal data is stored in a db.json file.

json-server serves this db.json file as a REST API (http://localhost:3000/goals).

The application fetches (Read) the initial list of goals from db.json upon loading.

Multiple Savings Goals (CRUD Operations):

Add (Create): Users can add new financial goals (e.g., "Travel Fund", "Emergency Fund"), which are persisted via POST requests.

Update: Existing goals can be modified (name, target amount, category, deadline) via PATCH requests.

Delete: Goals can be removed from the system via DELETE requests.

Progress Tracking:

Displays the total amount saved for each goal against its target.

Shows the remaining amount needed to reach the goal.

Provides a visual progress bar for each goal.

Make Deposits:

Users can add an amount and select a specific goal to deposit into.

This action updates the savedAmount field of the chosen goal in db.json via a PATCH request, and the progress bar updates accordingly.

Overview Dashboard:

Displays the total number of goals.

Shows the total money saved across all goals.

Highlights the number of goals completed.

Indicates how much time is left for each goal.

Shows a warning if a deadline is within 30 days and the goal is not yet complete.

Marks goals as "Overdue" if the deadline has passed without reaching the target.

Technologies Used
Frontend:

React (Functional Components, Hooks)

Tailwind CSS (for styling and responsive design)

Backend Simulation:

json-server (for a quick REST API from db.json)

Setup Instructions
Follow these steps to get the Smart Goal Planner up and running on your local machine.

1. Backend (json-server) Setup
First, you need to set up the mock API using json-server.

Create db.json:
In the root directory of your project (or a dedicated backend folder), create a file named db.json and paste the following JSON structure:

{
  "goals": [
    {
      "id": "1",
      "name": "Travel Fund - Japan",
      "targetAmount": 5000,
      "savedAmount": 3200,
      "category": "Travel",
      "deadline": "2025-12-31",
      "createdAt": "2024-01-15"
    },
    {
      "id": "2",
      "name": "Emergency Fund",
      "targetAmount": 10000,
      "savedAmount": 7500,
      "category": "Emergency",
      "deadline": "2026-06-30",
      "createdAt": "2023-05-01"
    },
    {
      "id": "3",
      "name": "New Laptop",
      "targetAmount": 1500,
      "savedAmount": 1500,
      "category": "Electronics",
      "deadline": "2024-07-20",
      "createdAt": "2024-03-10"
    },
    {
      "id": "4",
      "name": "Down Payment - House",
      "targetAmount": 50000,
      "savedAmount": 12000,
      "category": "Real Estate",
      "deadline": "2027-12-31",
      "createdAt": "2024-02-01"
    },
    {
      "id": "5",
      "name": "Car Maintenance",
      "targetAmount": 800,
      "savedAmount": 600,
      "category": "Vehicle",
      "deadline": "2025-09-15",
      "createdAt": "2024-06-01"
    },
    {
      "id": "6",
      "name": "Education Fund",
      "targetAmount": 20000,
      "savedAmount": 5000,
      "category": "Education",
      "deadline": "2028-01-01",
      "createdAt": "2024-04-20"
    },
    {
      "id": "7",
      "name": "Holiday Gifts",
      "targetAmount": 1000,
      "savedAmount": 200,
      "category": "Shopping",
      "deadline": "2024-08-10",
      "createdAt": "2024-07-01"
    },
    {
      "id": "8",
      "name": "New Phone",
      "targetAmount": 1200,
      "savedAmount": 0,
      "category": "Electronics",
      "deadline": "2025-01-31",
      "createdAt": "2024-07-10"
    },
    {
      "id": "9",
      "name": "Retirement Savings",
      "targetAmount": 100000,
      "savedAmount": 15000,
      "category": "Retirement",
      "deadline": "2035-01-01",
      "createdAt": "2023-01-01"
    },
    {
      "id": "10",
      "name": "Home Renovation",
      "targetAmount": 7500,
      "savedAmount": 1000,
      "category": "Home",
      "deadline": "2025-03-31",
      "createdAt": "2024-05-15"
    }
  ]
}

Install json-server:
If you haven't already, install json-server globally:

npm install -g json-server
# OR
yarn add global json-server

Run json-server:
Open a terminal or command prompt, navigate to the directory where you saved db.json, and run:

json-server --watch db.json --port 3000

Keep this terminal window open and running throughout your development session. The API will be available at http://localhost:3000/goals.

2. Frontend (React) Setup
This project uses React. If you don't have a React project set up, you can quickly create one using Vite (recommended) or Create React App.

Create React Project (if you don't have one):

# Using Vite (recommended)
npm create vite@latest smart-goal-planner -- --template react
cd smart-goal-planner
npm install

# OR using Create React App
npx create-react-app smart-goal-planner
cd smart-goal-planner
npm install

Update Project Files:
Replace the contents of your src/ and public/ directories with the files provided in the previous responses. Ensure the following file structure:

smart-goal-planner/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AddGoalModal.jsx
│   │   ├── DepositModal.jsx
│   │   ├── EditGoalModal.jsx
│   │   ├── GoalCard.jsx
│   │   ├── GoalList.jsx
│   │   ├── MessageBox.jsx
│   │   └── Overview.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
└── db.json  <-- This should be in the root alongside src/ and public/

Important: Make sure your public/index.html includes the Tailwind CSS CDN and the Inter font link as specified in the previous responses. Also, ensure src/index.css contains the global full-screen styles.

Run the React Application:
Open a new terminal or command prompt (separate from the json-server one), navigate to your React project's root directory (smart-goal-planner), and run:

npm run dev  # If you used Vite
# OR
npm start    # If you used Create React App

Your React application should now open in your browser, typically at http://localhost:5173 (for Vite) or http://localhost:3000 (for Create React App, if port 3000 is free, otherwise it will pick another).

How to Use
Once both the json-server and the React application are running:

View Goals: The dashboard will display all existing goals fetched from db.json.

Add New Goal: Click the "Add New Goal" button. Fill in the details in the modal and click "Add Goal" to save it.

Make a Deposit:

Click the "Deposit" button on any individual goal card to open the deposit modal with that goal pre-selected.

Alternatively, click the "Make a Deposit" button at the top of the "My Financial Goals" section to open the modal and select a goal from the dropdown.

Enter the amount and click "Confirm Deposit". The goal's savedAmount will update.

Edit Goal: Click the "Edit" button on a goal card. Modify the desired fields in the modal and click "Update Goal".

Delete Goal: Click the "Delete" button on a goal card. A confirmation dialog will appear; confirm to remove the goal.

Track Progress: Observe the progress bars and remaining amounts on each goal card.

Overview: The top section provides a summary of your total goals, total saved amount, and completed goals.

Deadline Status: Pay attention to the status text on each goal card for warnings (deadline within 30 days) and "Overdue" markers.