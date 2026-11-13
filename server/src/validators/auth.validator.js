const { z } = require('zod');

// Registration validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),

  email: z.string().email('Please enter a valid email'),

  password: z.string().min(8, 'Password must have at least 8 characters'),
});

// Login validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),

  password: z.string().min(1, 'Password is required'),
});

module.exports = {
  registerSchema,
  loginSchema,
};
