const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { authLimiter } = require('../config/rateLimit');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

// Registration route
router.post(
  '/register',
   authLimiter,
  validate(registerSchema),
  authController.register
);

// Login route
router.post(
  '/login',
   authLimiter,
  validate(loginSchema),
  authController.login
);

module.exports = router;
