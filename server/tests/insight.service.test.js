jest.mock('../src/config/db', () => ({
  getPrisma: jest.fn(),
}));

const { getPrisma } = require('../src/config/db');
const { getInsights } = require('../src/services/insight.service');

describe('Database insights', () => {
  let prisma;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = {
      $queryRaw: jest.fn(),
      $transaction: jest.fn().mockResolvedValue([
        [{ intervalCount: 1, averageCycleLength: 28 }],
        [{ name: 'Cramps', category: 'Pain', occurrences: 2 }],
      ]),
    };
    getPrisma.mockReturnValue(prisma);
  });

  test('returns the result of both cycle and symptom aggregate queries', async () => {
    const result = await getInsights('12', { minOccurrences: '2' });

    expect(result.cycles.averageCycleLength).toBe(28);
    expect(result.frequentSymptoms).toEqual([
      { name: 'Cramps', category: 'Pain', occurrences: 2 },
    ]);
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(2);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  test('rejects invalid aggregation thresholds', async () => {
    await expect(
      getInsights('12', { minOccurrences: '0' })
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });
});
