const { createCycleSchema } = require('../src/validators/cycle.validator');

describe('Cycle Validation Tests', () => {
  test('Should accept valid cycle dates', () => {
    const result = createCycleSchema.safeParse({
      startDate: '2026-11-01',
      endDate: '2026-11-05',
    });

    expect(result.success).toBe(true);
  });

  test('Should accept a cycle without an end date', () => {
    const result = createCycleSchema.safeParse({
      startDate: '2026-11-01',
    });

    expect(result.success).toBe(true);
  });

  test('Should reject an invalid start date', () => {
    const result = createCycleSchema.safeParse({
      startDate: 'invalid-date',
    });

    expect(result.success).toBe(false);
  });

  test('Should reject an end date before the start date', () => {
    const result = createCycleSchema.safeParse({
      startDate: '2026-11-10',
      endDate: '2026-11-05',
    });

    expect(result.success).toBe(false);
  });
});
