const express = require('express');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const reminderController = require('../controllers/reminder.controller');
const {
  createReminderSchema,
  updateReminderSchema,
} = require('../validators/reminder.validator');

const router = express.Router();

router.use(authenticate);
router.get('/', reminderController.list);
router.post('/', validate(createReminderSchema), reminderController.create);
router.get('/:id', reminderController.get);
router.put('/:id', validate(updateReminderSchema), reminderController.update);
router.delete('/:id', reminderController.remove);

module.exports = router;
