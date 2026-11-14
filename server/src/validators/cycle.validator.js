const { z } = require('zod');

const cycleFields = {
  startDate: z.string().date('Please provide a valid start date'),
  endDate: z.string().date('Please provide a valid end date').nullable(),
};

const createCycleSchema = z
  .object({
    startDate: cycleFields.startDate,
    endDate: cycleFields.endDate.optional(),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: 'End date cannot be earlier than start date',
      path: ['endDate'],
    }
  );

const updateCycleSchema = z
  .object({
    startDate: cycleFields.startDate.optional(),
    endDate: cycleFields.endDate.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one cycle field to update',
  });

module.exports = {
  createCycleSchema,
  updateCycleSchema,
};



