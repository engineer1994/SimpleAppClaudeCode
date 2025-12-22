require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Greeting = require('./models/Greeting');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get all greetings
app.get('/api/greetings', async (req, res) => {
  try {
    const greetings = await Greeting.find().sort({ timestamp: 1 });
    res.json(greetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new greeting
app.post('/api/greetings', async (req, res) => {
  try {
    const greeting = new Greeting({ name: req.body.name });
    await greeting.save();
    res.status(201).json(greeting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete all greetings
app.delete('/api/greetings', async (req, res) => {
  try {
    await Greeting.deleteMany({});
    res.json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
