# Simple MERN Greeting App

A simple MERN stack application where users enter their name, get greeted, and see a history of all previous entries.

## Features

- Enter your name and receive a personalized greeting
- View history of all previously entered names with timestamps
- Data persists in MongoDB Atlas
- Clear history functionality

## Project Structure

```
SimpleAppClaudeCode/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js          # Main component
│       ├── App.css         # Styles
│       └── index.js        # Entry point
├── server/                 # Express backend
│   ├── models/
│   │   └── Greeting.js     # Mongoose model
│   ├── index.js            # Express server
│   └── .env                # Environment variables (not in git)
├── package.json            # Root package with scripts
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB Atlas account (free tier available)

## Installation

```bash
# Install all dependencies (root, server, and client)
npm run install-all
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (free tier is fine)
3. Click "Connect" and choose "Connect your application"
4. Copy the connection string
5. Create `server/.env` file:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/greeting-app?retryWrites=true&w=majority
   ```
6. Replace `<username>`, `<password>`, and `<cluster>` with your values

## Running the App

```bash
# Run both client and server concurrently
npm run dev

# Or run separately:
npm run server    # Express backend on http://localhost:5000
npm run client    # React frontend on http://localhost:3000
```

## API Endpoints

| Method | Endpoint        | Description             |
|--------|-----------------|-------------------------|
| GET    | /api/health     | Health check endpoint   |
| GET    | /api/greetings  | Get all greetings       |
| POST   | /api/greetings  | Add a new greeting      |
| DELETE | /api/greetings  | Delete all greetings    |

## Tech Stack

- **Frontend:** React 18
- **Backend:** Express.js
- **Database:** MongoDB Atlas with Mongoose

## Version History

- **v2.0.0** - MongoDB Atlas integration
- **v1.0.0** - Initial release with localStorage persistence
