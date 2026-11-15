const { processDueReminders } = require('../services/reminderDelivery.service');

const DEFAULT_INTERVAL_MS = 60000;

const getIntervalMs = (value) => {
  const intervalMs = value === undefined ? DEFAULT_INTERVAL_MS : Number(value);
  if (!Number.isInteger(intervalMs) || intervalMs < 1000 || intervalMs > 3600000) {
    throw new Error('REMINDER_POLL_INTERVAL_MS must be between 1000 and 3600000');
  }
  return intervalMs;
};

const startReminderScheduler = ({
  prisma,
  sendEmail,
  intervalMs = DEFAULT_INTERVAL_MS,
  logger = console,
}) => {
  const pollIntervalMs = getIntervalMs(intervalMs);
  let stopped = false;
  let inFlight = null;

  const run = () => {
    if (stopped) {
      return Promise.resolve();
    }
    if (inFlight) {
      return inFlight;
    }

    inFlight = processDueReminders({ prisma, sendEmail, logger })
      .catch((error) => {
        logger.error('Reminder scheduler tick failed', error);
      })
      .finally(() => {
        inFlight = null;
      });
    return inFlight;
  };

  const timer = setInterval(() => {
    void run();
  }, pollIntervalMs);
  timer.unref?.();
  void run();

  return {
    run,
    stop: async () => {
      stopped = true;
      clearInterval(timer);
      if (inFlight) {
        await inFlight;
      }
    },
  };
};

module.exports = {
  getIntervalMs,
  startReminderScheduler,
};
