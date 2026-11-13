const { verifyToken } = require('../utils/jwt.util');

// Check whether the request contains a valid JWT
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please provide a valid token.',
    });
  }

  // Extract the token after "Bearer"
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using our JWT utility
    const decoded = verifyToken(token);

    // Attach the authenticated user's ID to the request
    req.user = { userId: decoded.userId };

    // Allow the request to continue
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};

module.exports = authenticate;
