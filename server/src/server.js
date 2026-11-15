require('dotenv').config();

const app = require('./app');
const { disconnectPrisma, getPrisma } = require('./config/db');
const { createReminderEmailSender } = require('./services/reminderEmail.service');
const { startReminderScheduler } = require('./workers/reminderScheduler');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await getPrisma().$connect();

  const sendReminderEmail = createReminderEmailSender();
  let stopReminderScheduler = async () => {};
  if (sendReminderEmail) {
    const scheduler = startReminderScheduler({
      prisma: getPrisma(),
      sendEmail: sendReminderEmail,
      intervalMs: process.env.REMINDER_POLL_INTERVAL_MS,
    });
    stopReminderScheduler = scheduler.stop;
  } else {
    console.warn(
      'Reminder email delivery is disabled; configure SMTP_HOST and SMTP_FROM to enable it.'
    );
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`NURA server running on port ${PORT}`);
  });

  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;

    stopReminderScheduler()
      .catch((error) => {
        console.error(`NURA reminder scheduler failed to stop after ${signal}`, error);
        process.exitCode = 1;
      })
      .finally(() => {
        server.close(async (error) => {
          if (error) {
            console.error(`NURA server failed to close after ${signal}`, error);
            process.exitCode = 1;
          }

          try {
            await disconnectPrisma();
          } catch (disconnectError) {
            console.error('NURA database connection failed to close cleanly', disconnectError);
            process.exitCode = 1;
          }
        });
      });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch(async (error) => {
  console.error('NURA server failed to start', error);
  try {
    await disconnectPrisma();
  } catch (disconnectError) {
    console.error('NURA database connection failed to close cleanly', disconnectError);
  }
  process.exitCode = 1;
});
