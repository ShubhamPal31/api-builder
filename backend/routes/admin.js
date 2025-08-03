// routes/admin.js
const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin.js');
const User = require('../models/User');

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

module.exports = router;
