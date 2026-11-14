const express = require('express');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const symptomLogController = require('../controllers/symptomLog.controller');
const {
  createSymptomLogSchema,
  updateSymptomLogSchema,
} = require('../validators/symptomLog.validator');

const router = express.Router();

router.use(authenticate);
router.get('/', symptomLogController.listSymptoms);
router.get('/logs', symptomLogController.listLogs);
router.post('/logs', validate(createSymptomLogSchema), symptomLogController.createLog);
router.get('/logs/:id', symptomLogController.getLog);
router.put('/logs/:id', validate(updateSymptomLogSchema), symptomLogController.updateLog);
router.delete('/logs/:id', symptomLogController.deleteLog);

module.exports = router;
