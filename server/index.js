require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Greeting = require('./models/Greeting');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/greetings', async (req, res) => {
  try {
    const greetings = await Greeting.find().sort({ timestamp: 1 });
    res.json(greetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/greetings', async (req, res) => {
  try {
    const greeting = new Greeting({ name: req.body.name });
    await greeting.save();
    res.status(201).json(greeting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/greetings', async (req, res) => {
  try {
    await Greeting.deleteMany({});
    res.json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
