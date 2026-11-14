const express = require('express');

const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');
const apiRouter = require('./routes');
const { getPrisma } = require('./config/db');

const securityMiddleware = require('./config/security');
const corsMiddleware = require('./config/cors');
const { apiLimiter } = require('./config/rateLimit');

const app = express();

// Security middleware
app.use(securityMiddleware);
app.use(corsMiddleware);

// Parse incoming JSON
app.use(express.json());

// Health check API
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NURA backend is running!',
  });
});

app.get('/api/v1/health/database', async (req, res) => {
  try {
    await getPrisma().$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: 'Database connection is healthy',
    });
  } catch (error) {
    console.error('Database health check failed', error);
    res.status(503).json({
      success: false,
      message: 'Database is unavailable',
    });
  }
});

// API version 1 routes
app.use('/api/v1', apiLimiter, apiRouter);

// Handle unknown routes
app.use(notFound);

// Handle application errors
app.use(errorHandler);

module.exports = app;
