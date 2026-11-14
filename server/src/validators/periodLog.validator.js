const { z } = require('zod');

const periodFields = {
  startDate: z.string().date('Please provide a valid start date'),
  endDate: z.string().date('Please provide a valid end date').nullable(),
  flowIntensity: z.enum(['spotting', 'light', 'medium', 'heavy']),
};

const validateDateRange = (data) => {
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
};

const createPeriodLogSchema = z
  .object({
    startDate: periodFields.startDate,
    endDate: periodFields.endDate.optional(),
    flowIntensity: periodFields.flowIntensity,
  })
  .refine(validateDateRange, {
    message: 'End date cannot be earlier than start date',
    path: ['endDate'],
  });

const updatePeriodLogSchema = z
  .object({
    startDate: periodFields.startDate.optional(),
    endDate: periodFields.endDate.optional(),
    flowIntensity: periodFields.flowIntensity.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one period-log field to update',
  })
  .refine(validateDateRange, {
    message: 'End date cannot be earlier than start date',
    path: ['endDate'],
  });

module.exports = {
  createPeriodLogSchema,
  updatePeriodLogSchema,
};
