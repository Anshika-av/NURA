const express = require('express');
require('dotenv').config();

const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');
const apiRouter = require('./routes');
const app = express();

const PORT = process.env.PORT || 5000;

// Built-in middleware
app.use(express.json());

// Health check API
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NURA backend is running!',
  });
});
// API version 1 routes
app.use('/api/v1', apiRouter);
// Handle unknown routes
app.use(notFound);

// Handle application errors
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`NURA server running on port ${PORT}`);
}); 
