const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register - Create new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user (password is hashed by the model's pre-save hook)
    const user = new User({ email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
