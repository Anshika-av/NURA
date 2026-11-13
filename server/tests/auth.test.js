const authenticate = require('../src/middleware/auth.middleware');
const { verifyToken } = require('../src/utils/jwt.util');

jest.mock('../src/utils/jwt.util');

describe('Authentication Middleware Tests', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  test('Should reject requests without a token', () => {
    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('Should reject invalid tokens', () => {
    req.headers.authorization = 'Bearer invalid-token';
    verifyToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('Should authenticate a valid token', () => {
    req.headers.authorization = 'Bearer valid-token';
    verifyToken.mockReturnValue({ userId: 'user123' });

    authenticate(req, res, next);

    expect(req.user).toEqual({ userId: 'user123' });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
