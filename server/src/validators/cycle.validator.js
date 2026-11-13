const { z } = require('zod');

const createCycleSchema = z
  .object({
    startDate: z.string().date('Please provide a valid start date'),
    endDate: z
      .string()
      .date('Please provide a valid end date')
      .optional(),
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

module.exports = {
  createCycleSchema,
};



