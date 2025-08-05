const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin.js');
const User = require('../models/User');
const MockApi = require('../models/MockApi');

// Get all users (admin only)
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch users', error: err.message });
  }
});

// Promote normal users to admin
router.put('/promote/:userId', verifyAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'User is already an admin' });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json({ message: 'User promoted to admin successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error promoting user', error: err.message });
  }
});

// Delete a user by ID (admin only)
router.delete('/users/:userId', verifyAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await MockApi.deleteMany({ userId: userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting user', error: err.message });
  }
});

router.get('/users/:userId/mocks', verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const mockApis = await MockApi.find({ userId });
    if (!mockApis || mockApis.length === 0) {
      return res.status(404).json({ message: 'No mock APIs found' });
    }
    res.status(200).json(mockApis);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch mock APIs', error: err.message });
  }
});

// Delete a specific mock API (admin only)
router.delete('/users/:userId/mocks/:mockId', verifyAdmin, async (req, res) => {
  const { mockId } = req.params;

  try {
    const mockApi = await MockApi.findById(mockId);

    if (!mockApi) {
      return res.status(404).json({ message: 'Mock API not found' });
    }

    await MockApi.findByIdAndDelete(mockId);
    res.status(200).json({ message: 'Mock API deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting mock API', error: err.message });
  }
});

module.exports = router;
