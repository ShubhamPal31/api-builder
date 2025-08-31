const express = require('express');
const router = express.Router();
const MockAPI = require('../models/MockAPI');
const authMiddleware = require('../middleware/authMiddleware');

// helper: validate endpoint string
function isValidEndpoint(endpoint) {
  // Must start with "/" and only allow alphanumeric, /, -, _, and :param
  return /^\/[a-zA-Z0-9\/:_-]*$/.test(endpoint) && !endpoint.endsWith(':');
}

// Create new mock API
router.post('/create', authMiddleware, async (req, res) => {
  const { method, endpoint, response } = req.body;

  if (!method || !endpoint || !response) {
    return res.status(400).json({ message: 'All fields required' });
  }

  let newEndpoint = endpoint;

  if (!endpoint.startsWith('/')) {
    newEndpoint = '/' + endpoint; // normalize
  }

  if (!isValidEndpoint(newEndpoint)) {
    return res.status(400).json({ message: 'Invalid endpoint format' });
  }

  try {
    let parsedResponse = response;
    if (typeof response === 'string') {
      try {
        parsedResponse = JSON.parse(response);
      } catch (err) {
        return res
          .status(400)
          .json({ message: 'Invalid JSON in response field' });
      }
    }

    const mock = await MockAPI.create({
      userId: req.user.id,
      method: method.toUpperCase(),
      endpoint: newEndpoint,
      response: parsedResponse,
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
    const mocks = await MockAPI.find({ userId: req.user.id });
    res.status(200).json(mocks);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching mock APIs', error: err.message });
  }
});

// Update a mock API
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const mock = await MockAPI.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!mock) return res.status(404).json({ message: 'Mock API not found' });

    const { method, endpoint, response } = req.body;

    let parsedResponse = response;
    if (typeof response === 'string') {
      try {
        parsedResponse = JSON.parse(response);
      } catch (err) {
        return res
          .status(400)
          .json({ message: 'Invalid JSON in response field' });
      }
    }

    mock.method = method || mock.method;
    mock.endpoint = endpoint || mock.endpoint;
    mock.response = parsedResponse || mock.response;

    await mock.save();
    res.json({ message: 'Mock API updated', mock });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error updating mock API', error: err.message });
  }
});

// Delete a mock API by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const mock = await MockAPI.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!mock) {
      return res.status(404).json({ message: 'Mock API not found' });
    }

    res.json({ message: 'Mock API deleted successfully' });
  } catch (err) {
    res.status(500).json({
      message: 'Error deleting mock API',
      error: err.message,
    });
  }
});

/**
 * 🔹 Public route to serve mock APIs
 * Uses the endpoint + method defined by the user
 * Example: if user saved { method: 'POST', endpoint: '/users' }
 * Then client can hit POST http://localhost:5000/api/mock/users
 */
// Public route to serve mock APIs
router.all(/.*/, async (req, res) => {
  try {
    const path = req.path; // already like "/users" or "/products"
    const method = req.method.toUpperCase();

    const mock = await MockAPI.findOne({ endpoint: path, method });
    if (!mock) {
      return res.status(404).json({ message: 'Mock API not found' });
    }

    res.status(200).json(mock.response);
  } catch (err) {
    res.status(500).json({
      message: 'Error serving mock API',
      error: err.message,
    });
  }
});

module.exports = router;
