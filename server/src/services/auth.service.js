const { getPrisma } = require('../config/db');
const httpError = require('../utils/httpError');
const { comparePassword, hashPassword } = require('../utils/password.util');

const registerUser = async (userData) => {
  const prisma = getPrisma();

  try {
    const user = await prisma.user.create({
      data: {
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        passwordHash: await hashPassword(userData.password),
        preferences: {
          create: {
            cycleLength: 28,
            periodLength: 5,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return {
      ...user,
      id: user.id.toString(),
    };
  } catch (error) {
    if (error.code === 'P2002') {
      throw httpError(409, 'An account with that email already exists');
    }

    throw error;
  }
};

const loginUser = async (email, password) => {
  const user = await getPrisma().user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw httpError(401, 'Invalid email or password');
  }

  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
