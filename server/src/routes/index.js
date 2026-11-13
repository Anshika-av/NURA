const express = require('express');

const router = express.Router();

const authRoutes = require('./auth.routes');

// API version 1 base route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NURA API v1 is working!',
  });
});

// Authentication routes
router.use('/auth', authRoutes);

module.exports = router;
