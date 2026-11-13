const cors = require('cors');

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:5173',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header (e.g. curl)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

   return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
