const express = require('express');
const router = express.Router();
const MockAPI = require('../models/MockAPI');
const authMiddleware = require('../middleware/authMiddleware');

// Create new mock API
router.post('/create', authMiddleware, async (req, res) => {
  const { method, endpoint, response } = req.body;

  if (!method || !endpoint || !response) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const mock = await MockAPI.create({
      userId: req.userId,
      method,
      endpoint,
      response,
    });
    res.status(201).json({ message: 'Mock API created', mock });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error creating mock API', error: err.message });
  }
});

// Get all mock APIs for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const mocks = await MockAPI.find({ userId: req.userId });
    res.status(200).json(mocks);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching mock APIs', error: err.message });
  }
});

module.exports = router;
