const helmet = require('helmet');

// Configure security headers for the NURA API
const securityMiddleware = helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

module.exports = securityMiddleware;
