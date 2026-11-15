const {
  MAX_DELIVERY_ATTEMPTS,
  processDueReminders,
} = require('../src/services/reminderDelivery.service');

describe('Scheduled reminder email delivery', () => {
  let prisma;
  const now = new Date('2026-11-15T10:00:00.000Z');
  const reminder = {
    id: 21n,
    userId: 5n,
    deliveryAttempts: 1,
  };

  beforeEach(() => {
    prisma = {
      $queryRaw: jest.fn().mockResolvedValue([reminder]),
      user: {
        findMany: jest.fn().mockResolvedValue([
          { id: 5n, email: 'person@example.com' },
        ]),
      },
      reminder: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
  });

  test('sends a generic email and records successful delivery', async () => {
    const sendEmail = jest.fn().mockResolvedValue({});

    const result = await processDueReminders({
      prisma,
      sendEmail,
      now,
      logger: { warn: jest.fn() },
    });

    expect(sendEmail).toHaveBeenCalledWith({ to: 'person@example.com' });
    expect(prisma.reminder.updateMany).toHaveBeenCalledWith({
      where: { id: 21n, deliveryStatus: 'processing' },
      data: {
        status: 'sent',
        deliveryStatus: 'sent',
        nextAttemptAt: null,
        processingStartedAt: null,
        lastDeliveryError: null,
      },
    });
    expect(result).toEqual({ claimed: 1, sent: 1, failed: 0 });
  });

  test('requeues failed delivery with exponential backoff and a sanitized error', async () => {
    const error = Object.assign(new Error('SMTP failed for person@example.com'), {
      code: 'ECONNECTION',
    });
    const sendEmail = jest.fn().mockRejectedValue(error);

    const result = await processDueReminders({
      prisma,
      sendEmail,
      now,
      logger: { warn: jest.fn() },
    });

    expect(prisma.reminder.updateMany).toHaveBeenCalledWith({
      where: {
        id: 21n,
        status: 'pending',
        deliveryStatus: 'processing',
      },
      data: {
        deliveryStatus: 'queued',
        nextAttemptAt: new Date('2026-11-15T10:01:00.000Z'),
        processingStartedAt: null,
        lastDeliveryError: 'ECONNECTION',
      },
    });
    expect(result).toEqual({ claimed: 1, sent: 0, failed: 1 });
  });

  test('marks delivery failed after the final attempt', async () => {
    prisma.$queryRaw.mockResolvedValue([
      { ...reminder, deliveryAttempts: MAX_DELIVERY_ATTEMPTS },
    ]);
    const sendEmail = jest.fn().mockRejectedValue(new Error('SMTP unavailable'));

    await processDueReminders({
      prisma,
      sendEmail,
      now,
      logger: { warn: jest.fn() },
    });

    expect(prisma.reminder.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          deliveryStatus: 'failed',
          nextAttemptAt: null,
          lastDeliveryError: 'EMAIL_SEND_FAILED',
        }),
      })
    );
  });

  test('does not query recipients when nothing is due', async () => {
    prisma.$queryRaw.mockResolvedValue([]);

    const result = await processDueReminders({
      prisma,
      sendEmail: jest.fn(),
      now,
    });

    expect(prisma.user.findMany).not.toHaveBeenCalled();
    expect(result).toEqual({ claimed: 0, sent: 0, failed: 0 });
  });
});
