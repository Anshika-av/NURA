const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate.middleware');
const { createCycleSchema, updateCycleSchema } = require('../validators/cycle.validator');
const authenticate = require('../middleware/auth.middleware');
const cycleController = require('../controllers/cycle.controller');
const periodLogController = require('../controllers/periodLog.controller');
const {
  createPeriodLogSchema,
  updatePeriodLogSchema,
} = require('../validators/periodLog.validator');

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
router.put('/:id', validate(updateCycleSchema), cycleController.updateCycle);
router.delete('/:id', cycleController.deleteCycle);
router.get('/:cycleId/period-logs', periodLogController.list);
router.post(
  '/:cycleId/period-logs',
  validate(createPeriodLogSchema),
  periodLogController.create
);
router.get('/:cycleId/period-logs/:periodLogId', periodLogController.get);
router.put(
  '/:cycleId/period-logs/:periodLogId',
  validate(updatePeriodLogSchema),
  periodLogController.update
);
router.delete('/:cycleId/period-logs/:periodLogId', periodLogController.remove);

module.exports = router;
