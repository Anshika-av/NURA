jest.mock('../src/config/db', () => ({
  getPrisma: jest.fn(),
}));

const { getPrisma } = require('../src/config/db');
const {
  createReminder,
  deleteReminder,
  updateReminder,
} = require('../src/services/reminder.service');

describe('Reminder persistence and delivery state', () => {
  let prisma;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = {
      reminder: {
        create: jest.fn(),
        deleteMany: jest.fn(),
        findFirst: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    getPrisma.mockReturnValue(prisma);
  });

  test('queues a new reminder for email delivery', async () => {
    prisma.reminder.create.mockImplementation(async ({ data }) => ({
      ...data,
      id: 21n,
    }));

    const reminder = await createReminder('5', {
      reminderType: 'Hydration',
      scheduledAt: '2026-11-20T10:00:00.000Z',
    });

    expect(prisma.reminder.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 5n,
        deliveryStatus: 'queued',
      }),
    });
    expect(reminder).toMatchObject({
      id: '21',
      deliveryStatus: 'queued',
    });
    expect(reminder).not.toHaveProperty('deliveryAttempts');
  });

  test('rescheduling a sent reminder requeues its email', async () => {
    prisma.reminder.findFirst
      .mockResolvedValueOnce({
        id: 21n,
        status: 'sent',
        deliveryStatus: 'sent',
      })
      .mockResolvedValueOnce({
        id: 21n,
        userId: 5n,
        reminderType: 'Hydration',
        scheduledAt: new Date('2026-11-22T10:00:00.000Z'),
        status: 'pending',
        deliveryStatus: 'queued',
        deliveryAttempts: 0,
      });
    prisma.reminder.updateMany.mockResolvedValue({ count: 1 });

    const reminder = await updateReminder('5', '21', {
      scheduledAt: '2026-11-22T10:00:00.000Z',
    });

    expect(prisma.reminder.updateMany).toHaveBeenCalledWith({
      where: {
        id: 21n,
        userId: 5n,
        status: 'sent',
        deliveryStatus: 'sent',
      },
      data: expect.objectContaining({
        status: 'pending',
        deliveryStatus: 'queued',
        deliveryAttempts: 0,
        nextAttemptAt: null,
      }),
    });
    expect(reminder.deliveryStatus).toBe('queued');
  });

  test('does not delete a reminder while its email is being delivered', async () => {
    prisma.reminder.findFirst.mockResolvedValue({
      deliveryStatus: 'processing',
    });

    await expect(deleteReminder('5', '21')).rejects.toMatchObject({
      statusCode: 409,
      message: 'Reminder delivery is in progress',
    });
    expect(prisma.reminder.deleteMany).not.toHaveBeenCalled();
  });
});
