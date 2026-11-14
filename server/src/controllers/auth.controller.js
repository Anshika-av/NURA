const { generateToken } = require('../utils/jwt.util');
const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      data: {
        user,
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body.email, req.body.password);
    res.status(200).json({
      success: true,
      data: {
        user,
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
