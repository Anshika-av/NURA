const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate.middleware');
const { createCycleSchema } = require('../validators/cycle.validator');
const authenticate = require('../middleware/auth.middleware');
const cycleController = require('../controllers/cycle.controller');

// All cycle routes require authentication
router.use(authenticate);

// Get all cycles belonging to the logged-in user
router.get('/', cycleController.getCycles);

// Create a new cycle
router.post(
  '/',
  validate(createCycleSchema),
  cycleController.createCycle
);

// Get a specific cycle
router.get('/:id', cycleController.getCycleById);

module.exports = router;
