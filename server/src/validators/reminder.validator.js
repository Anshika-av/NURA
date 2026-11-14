const { z } = require('zod');

const reminderStatuses = ['pending', 'sent', 'completed', 'cancelled'];

const createReminderSchema = z.object({
  reminderType: z.string().trim().min(1).max(50),
  scheduledAt: z.string().datetime({ offset: true }),
});

const updateReminderSchema = z
  .object({
    reminderType: z.string().trim().min(1).max(50).optional(),
    scheduledAt: z.string().datetime({ offset: true }).optional(),
    status: z.enum(reminderStatuses).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one reminder field to update',
  });

module.exports = {
  createReminderSchema,
  updateReminderSchema,
};
