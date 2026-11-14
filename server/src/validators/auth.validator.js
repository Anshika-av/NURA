const { z } = require('zod');

// Registration validation
const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters').max(100),

  email: z
    .string()
    .trim()
    .email('Please enter a valid email')
    .transform((value) => value.toLowerCase()),

  password: z.string().min(8, 'Password must have at least 8 characters'),
});

// Login validation
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email')
    .transform((value) => value.toLowerCase()),

  password: z.string().min(1, 'Password is required'),
});

module.exports = {
  registerSchema,
  loginSchema,
};
