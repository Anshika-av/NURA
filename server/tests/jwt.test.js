require('dotenv').config();
const {
  generateToken,
  verifyToken,
} = require('../src/utils/jwt.util');

describe('JWT Utility Tests', () => {
  test('Should generate a valid token', () => {
    const token = generateToken('user123');

    expect(typeof token).toBe('string');

    const decoded = verifyToken(token);

    expect(decoded.userId).toBe('user123');
  });

  test('Should reject an invalid token', () => {
    expect(() => verifyToken('invalid.token.value')).toThrow();
  });

  test('Should reject a tampered token', () => {
    const token = generateToken('user123');
    const tamperedToken = token + 'tampered';

    expect(() => verifyToken(tamperedToken)).toThrow();
  });
});
