jest.mock('../src/config/db', () => ({
  getPrisma: jest.fn(),
}));

jest.mock('../src/utils/password.util', () => ({
  comparePassword: jest.fn(),
  hashPassword: jest.fn(),
}));

const { getPrisma } = require('../src/config/db');
const { comparePassword, hashPassword } = require('../src/utils/password.util');
const { loginUser, registerUser } = require('../src/services/auth.service');

describe('Authentication persistence', () => {
  const user = {
    id: 21n,
    name: 'Nura User',
    email: 'user@example.test',
    passwordHash: 'stored-hash',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };
  const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getPrisma.mockReturnValue({
      user: {
        create: jest.fn().mockResolvedValue(publicUser),
        findUnique: jest.fn().mockResolvedValue(user),
      },
    });
  });

  test('registers a normalized account with default preferences and returns no hash', async () => {
    hashPassword.mockResolvedValue('stored-hash');

    const result = await registerUser({
      name: ' Nura User ',
      email: ' USER@example.test ',
      password: 'strong-password',
    });

    expect(getPrisma().user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'user@example.test',
          passwordHash: 'stored-hash',
          preferences: {
            create: {
              cycleLength: 28,
              periodLength: 5,
            },
          },
        }),
      })
    );
    expect(result.id).toBe('21');
    expect(result).not.toHaveProperty('passwordHash');
  });

  test('returns a conflict for a duplicate email', async () => {
    hashPassword.mockResolvedValue('stored-hash');
    getPrisma().user.create.mockRejectedValue({ code: 'P2002' });

    await expect(
      registerUser({
        name: 'Nura User',
        email: 'user@example.test',
        password: 'strong-password',
      })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  test('rejects invalid login credentials with a generic response', async () => {
    comparePassword.mockResolvedValue(false);

    await expect(
      loginUser('user@example.test', 'wrong-password')
    ).rejects.toMatchObject({
      statusCode: 401,
      message: 'Invalid email or password',
    });
  });
});
