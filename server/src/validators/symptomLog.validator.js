const { z } = require('zod');

const symptomItemSchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(50),
  severity: z.enum(['mild', 'moderate', 'severe']),
});

const uniqueItems = (items) => {
  const keys = items.map(({ name, category }) => `${name.toLowerCase()}\u0000${category.toLowerCase()}`);
  return new Set(keys).size === keys.length;
};

const createSymptomLogSchema = z
  .object({
    date: z.string().date(),
    mood: z.string().trim().max(50).nullable().optional(),
    notes: z.string().max(5000).nullable().optional(),
    items: z.array(symptomItemSchema).max(30).default([]),
  })
  .refine((data) => uniqueItems(data.items), {
    message: 'A symptom can only appear once in a log',
    path: ['items'],
  });

const updateSymptomLogSchema = z
  .object({
    date: z.string().date().optional(),
    mood: z.string().trim().max(50).nullable().optional(),
    notes: z.string().max(5000).nullable().optional(),
    items: z.array(symptomItemSchema).max(30).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one symptom-log field to update',
  })
  .refine((data) => !data.items || uniqueItems(data.items), {
    message: 'A symptom can only appear once in a log',
    path: ['items'],
  });

module.exports = {
  createSymptomLogSchema,
  updateSymptomLogSchema,
};
