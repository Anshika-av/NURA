const express = require('express');

const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');
const apiRouter = require('./routes');

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

// API version 1 routes
app.use('/api/v1', apiLimiter, apiRouter);

// Handle unknown routes
app.use(notFound);

// Handle application errors
app.use(errorHandler);

module.exports = app;
