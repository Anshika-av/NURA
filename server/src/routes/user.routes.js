const express = require('express');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const userController = require('../controllers/user.controller');
const { updateUserSchema } = require('../validators/user.validator');

const router = express.Router();

router.use(authenticate);
router.get('/me', userController.getProfile);
router.patch('/me', validate(updateUserSchema), userController.updateProfile);

module.exports = router;
