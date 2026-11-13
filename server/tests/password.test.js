const {
  hashPassword,
  comparePassword,
} = require('../src/utils/password.util');

describe('Password Utility Tests', () => {
  test('Password should be hashed successfully', async () => {
    const password = 'Test12345';
    const hashedPassword = await hashPassword(password);

    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword.startsWith('$2')).toBe(true);
  });

  test('Correct password should match the hash', async () => {
    const password = 'Test12345';
    const hashedPassword = await hashPassword(password);

    const result = await comparePassword(password, hashedPassword);

    expect(result).toBe(true);
  });

  test('Incorrect password should not match the hash', async () => {
    const hashedPassword = await hashPassword('Test12345');

    const result = await comparePassword('WrongPassword', hashedPassword);

    expect(result).toBe(false);
  });
});
