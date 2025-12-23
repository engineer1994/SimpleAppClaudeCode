require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Greeting = require('./models/Greeting');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check (public)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected greeting routes (require authentication)
app.get('/api/greetings', auth, async (req, res) => {
  try {
    // Only get greetings for the logged-in user
    const greetings = await Greeting.find({ userId: req.userId }).sort({ timestamp: 1 });
    res.json(greetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/greetings', auth, async (req, res) => {
  try {
    // Create greeting linked to the logged-in user
    const greeting = new Greeting({
      name: req.body.name,
      userId: req.userId
    });
    await greeting.save();
    res.status(201).json(greeting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/greetings', auth, async (req, res) => {
  try {
    // Only delete greetings for the logged-in user
    await Greeting.deleteMany({ userId: req.userId });
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
