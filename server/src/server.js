require('dotenv').config();

const app = require('./app');
const { disconnectPrisma, getPrisma } = require('./config/db');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await getPrisma().$connect();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`NURA server running on port ${PORT}`);
  });

  const shutdown = (signal) => {
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
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch(async (error) => {
  console.error('NURA server could not connect to its database', error);
  try {
    await disconnectPrisma();
  } catch (disconnectError) {
    console.error('NURA database connection failed to close cleanly', disconnectError);
  }
  process.exitCode = 1;
});
