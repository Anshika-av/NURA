const express = require('express');
require('dotenv').config();
const { apiLimiter } = require('./config/rateLimit');
const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');
const securityMiddleware = require('./config/security');
const corsMiddleware = require('./config/cors');
const apiRouter = require('./routes');
const app = express();

const PORT = process.env.PORT || 5000;
app.use(securityMiddleware);
app.use(corsMiddleware);
// Built-in middleware
app.use(express.json());

// Health check API
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NURA backend is running!',
  });
});

// Apply rate limiting to all version 1 API routes
app.use('/api/v1', apiLimiter, apiRouter);
// Handle unknown routes
app.use(notFound);

// Handle application errors
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`NURA server running on port ${PORT}`);
}); 
