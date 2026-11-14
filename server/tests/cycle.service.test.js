jest.mock('../src/config/db', () => ({
  getPrisma: jest.fn(),
}));

const { getPrisma } = require('../src/config/db');
const {
  createCycle,
  deleteCycle,
  getCycle,
  listCycles,
  updateCycle,
} = require('../src/services/cycle.service');

describe('Cycle persistence', () => {
  let prisma;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = {
      $transaction: jest.fn(),
      cycle: {
        count: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };
    getPrisma.mockReturnValue(prisma);
  });

  test('creates an active cycle owned by the authenticated user', async () => {
    prisma.cycle.create.mockImplementation(async ({ data }) => ({
      ...data,
      id: 4n,
    }));

    const cycle = await createCycle('3', { startDate: '2026-11-01' });

    expect(prisma.cycle.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 3n,
        status: 'active',
      }),
    });
    expect(cycle.id).toBe('4');
  });

  test('lists only the owner cycles and serializes database ids', async () => {
    const rows = [{
      id: 4n,
      userId: 3n,
      startDate: new Date('2026-11-01T00:00:00.000Z'),
      endDate: null,
      status: 'active',
    }];
    prisma.$transaction.mockResolvedValue([rows, 1]);

    const result = await listCycles('3', { page: '1', limit: '10' });

    expect(prisma.cycle.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 3n } })
    );
    expect(result.cycles[0].id).toBe('4');
    expect(result.pagination.total).toBe(1);
  });

  test('hides cycles owned by another user', async () => {
    prisma.cycle.findFirst.mockResolvedValue(null);

    await expect(getCycle('3', '4')).rejects.toMatchObject({
      statusCode: 404,
      message: 'Cycle not found',
    });
    expect(prisma.cycle.findFirst).toHaveBeenCalledWith({
      where: { id: 4n, userId: 3n },
    });
  });

  test('rejects an update that makes the cycle end before it starts', async () => {
    prisma.cycle.findFirst.mockResolvedValue({
      id: 4n,
      userId: 3n,
      startDate: new Date('2026-11-10T00:00:00.000Z'),
      endDate: null,
      status: 'active',
    });

    await expect(
      updateCycle('3', '4', { endDate: '2026-11-05' })
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(prisma.cycle.update).not.toHaveBeenCalled();
  });

  test('deletes only an owned cycle', async () => {
    prisma.cycle.deleteMany.mockResolvedValue({ count: 1 });

    await deleteCycle('3', '4');

    expect(prisma.cycle.deleteMany).toHaveBeenCalledWith({
      where: { id: 4n, userId: 3n },
    });
  });
});
