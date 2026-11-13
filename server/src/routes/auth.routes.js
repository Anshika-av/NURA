const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');

const { registerSchema, loginSchema } = require('../validators/auth.validator');

// Registration route
router.post(
  '/register',
  validate(registerSchema),
  authController.register
);

// Login route
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

module.exports = router;
