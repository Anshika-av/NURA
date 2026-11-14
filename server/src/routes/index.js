const express = require('express');

const router = express.Router();

const authRoutes = require('./auth.routes');
const cycleRoutes = require('./cycle.routes');
const symptomRoutes = require('./symptom.routes');
const userRoutes = require('./user.routes');
const reminderRoutes = require('./reminder.routes');
const insightRoutes = require('./insight.routes');

// API version 1 base route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NURA API v1 is working!',
  });
});

// Authentication routes
router.use('/auth', authRoutes);
router.use('/cycles', cycleRoutes);
router.use('/symptoms', symptomRoutes);
router.use('/users', userRoutes);
router.use('/reminders', reminderRoutes);
router.use('/insights', insightRoutes);

module.exports = router;
