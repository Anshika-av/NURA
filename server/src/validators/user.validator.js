const { z } = require('zod');

const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    cycleLength: z.number().int().min(1).max(120).optional(),
    periodLength: z.number().int().min(1).max(30).optional(),
    notificationSettings: z.record(z.string(), z.boolean()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one profile field to update',
  });

module.exports = {
  updateUserSchema,
};
