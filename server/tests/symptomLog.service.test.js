jest.mock('../src/config/db', () => ({
  getPrisma: jest.fn(),
}));

const { getPrisma } = require('../src/config/db');
const {
  createSymptomLog,
  listSymptomLogs,
} = require('../src/services/symptomLog.service');
const { createSymptomLogSchema } = require('../src/validators/symptomLog.validator');

describe('Symptom-log persistence', () => {
  let prisma;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = {
      $transaction: jest.fn().mockResolvedValue([[], 0]),
      symptomLog: {
        create: jest.fn().mockResolvedValue({
          id: 8n,
          userId: 12n,
          date: new Date('2026-11-01T00:00:00.000Z'),
          mood: null,
          notes: null,
          items: [{
            id: 9n,
            severity: 'mild',
            symptom: { id: 3n, name: 'Cramps', category: 'Pain' },
          }],
        }),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };
    getPrisma.mockReturnValue(prisma);
  });

  test('stores symptom severity on the log item and serializes database ids', async () => {
    const result = await createSymptomLog('12', {
      date: '2026-11-01',
      items: [{ name: 'Cramps', category: 'Pain', severity: 'mild' }],
    });

    expect(prisma.symptomLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 12n,
          items: {
            create: [{
              severity: 'mild',
              symptom: {
                connectOrCreate: {
                  where: { name_category: { name: 'Cramps', category: 'Pain' } },
                  create: { name: 'Cramps', category: 'Pain' },
                },
              },
            }],
          },
        }),
      })
    );
    expect(result.id).toBe('8');
    expect(result.items[0].symptom.id).toBe('3');
  });

  test('rejects duplicate symptoms in one log', () => {
    const result = createSymptomLogSchema.safeParse({
      date: '2026-11-01',
      items: [
        { name: 'Cramps', category: 'Pain', severity: 'mild' },
        { name: 'cramps', category: 'pain', severity: 'moderate' },
      ],
    });

    expect(result.success).toBe(false);
  });

  test('filters symptom history by owner, date range, and symptom', async () => {
    await listSymptomLogs('12', {
      page: '2',
      limit: '5',
      from: '2026-11-01',
      to: '2026-11-30',
      symptomId: '3',
    });

    expect(prisma.symptomLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: 12n,
          date: {
            gte: new Date('2026-11-01T00:00:00.000Z'),
            lte: new Date('2026-11-30T00:00:00.000Z'),
          },
          items: { some: { symptomId: 3n } },
        },
        skip: 5,
        take: 5,
      })
    );
  });
});
