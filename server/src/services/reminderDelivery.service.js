const MAX_DELIVERY_ATTEMPTS = 5;
const DEFAULT_BATCH_SIZE = 10;
const PROCESSING_LEASE_MS = 15 * 60 * 1000;

const getDeliveryErrorCode = (error) =>
  typeof error?.code === 'string' && /^[A-Z0-9_-]{1,40}$/.test(error.code)
    ? error.code
    : 'EMAIL_SEND_FAILED';

const getRetryDelay = (attempts) =>
  Math.min(60, 2 ** Math.max(attempts - 1, 0)) * 60 * 1000;

const claimDueReminders = (prisma, now, batchSize) => {
  const staleBefore = new Date(now.getTime() - PROCESSING_LEASE_MS);

  return prisma.$queryRaw`
    WITH candidates AS (
      SELECT id
      FROM reminders
      WHERE status = 'pending'
        AND (
          (
            delivery_status = 'queued'
            AND scheduled_at <= ${now}
            AND (next_attempt_at IS NULL OR next_attempt_at <= ${now})
            AND delivery_attempts < ${MAX_DELIVERY_ATTEMPTS}
          )
          OR (
            delivery_status = 'processing'
            AND processing_started_at <= ${staleBefore}
          )
        )
      ORDER BY scheduled_at ASC, id ASC
      LIMIT ${batchSize}
      FOR UPDATE SKIP LOCKED
    )
    UPDATE reminders AS reminder
    SET delivery_status = 'processing',
        delivery_attempts = reminder.delivery_attempts + 1,
        processing_started_at = ${now}
    FROM candidates
    WHERE reminder.id = candidates.id
    RETURNING
      reminder.id AS id,
      reminder.user_id AS "userId",
      reminder.delivery_attempts AS "deliveryAttempts"
  `;
};

const processDueReminders = async ({
  prisma,
  sendEmail,
  now = new Date(),
  batchSize = DEFAULT_BATCH_SIZE,
  logger = console,
}) => {
  const reminders = await claimDueReminders(prisma, now, batchSize);
  if (reminders.length === 0) {
    return { claimed: 0, sent: 0, failed: 0 };
  }

  const users = await prisma.user.findMany({
    where: { id: { in: reminders.map((reminder) => reminder.userId) } },
    select: { id: true, email: true },
  });
  const emailByUserId = new Map(
    users.map((user) => [user.id.toString(), user.email])
  );
  const result = { claimed: reminders.length, sent: 0, failed: 0 };

  for (const reminder of reminders) {
    const reminderId = reminder.id.toString();
    const attempts = Number(reminder.deliveryAttempts);

    if (attempts > MAX_DELIVERY_ATTEMPTS) {
      const update = await prisma.reminder.updateMany({
        where: {
          id: reminder.id,
          status: 'pending',
          deliveryStatus: 'processing',
        },
        data: {
          deliveryStatus: 'failed',
          nextAttemptAt: null,
          processingStartedAt: null,
          lastDeliveryError: 'RETRY_LIMIT_REACHED',
        },
      });
      if (update.count > 0) {
        result.failed += 1;
        logger.warn?.('Reminder email retry limit reached', { reminderId });
      }
      continue;
    }

    const recipient = emailByUserId.get(reminder.userId.toString());
    try {
      if (!recipient) {
        const error = new Error('Reminder recipient is unavailable');
        error.code = 'RECIPIENT_NOT_FOUND';
        throw error;
      }

      await sendEmail({ to: recipient });
    } catch (error) {
      const deliveryError = getDeliveryErrorCode(error);
      const isTerminal = attempts >= MAX_DELIVERY_ATTEMPTS;
      const nextAttemptAt = isTerminal
        ? null
        : new Date(now.getTime() + getRetryDelay(attempts));

      const update = await prisma.reminder.updateMany({
        where: {
          id: reminder.id,
          status: 'pending',
          deliveryStatus: 'processing',
        },
        data: {
          deliveryStatus: isTerminal ? 'failed' : 'queued',
          nextAttemptAt,
          processingStartedAt: null,
          lastDeliveryError: deliveryError,
        },
      });

      if (update.count > 0) {
        result.failed += 1;
        logger.warn?.('Reminder email delivery failed', {
          reminderId,
          attempts,
          errorCode: deliveryError,
          nextAttemptAt,
        });
      }
      continue;
    }

    const update = await prisma.reminder.updateMany({
      where: {
        id: reminder.id,
        deliveryStatus: 'processing',
      },
      data: {
        status: 'sent',
        deliveryStatus: 'sent',
        nextAttemptAt: null,
        processingStartedAt: null,
        lastDeliveryError: null,
      },
    });

    if (update.count > 0) {
      result.sent += 1;
    }
  }

  return result;
};

module.exports = {
  MAX_DELIVERY_ATTEMPTS,
  processDueReminders,
};
