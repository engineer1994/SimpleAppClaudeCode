# Simple MERN Greeting App

A simple MERN stack application where users enter their name, get greeted, and see a history of all previous entries.

## Features

- Enter your name and receive a personalized greeting
- View history of all previously entered names with timestamps
- Data persists in localStorage (MongoDB version coming soon)
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
│   └── index.js            # Express server
├── package.json            # Root package with scripts
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

```bash
# Install all dependencies (root, server, and client)
npm run install-all
```

## Running the App

```bash
# Run both client and server concurrently
npm run dev

# Or run separately:
npm run server    # Express backend on http://localhost:5000
npm run client    # React frontend on http://localhost:3000
```

## API Endpoints

| Method | Endpoint      | Description           |
|--------|---------------|-----------------------|
| GET    | /api/health   | Health check endpoint |

## Tech Stack

- **Frontend:** React 18
- **Backend:** Express.js
- **Storage:** localStorage (v1), MongoDB (planned)

## Version History

- **v1.0.0** - Initial release with localStorage persistence
