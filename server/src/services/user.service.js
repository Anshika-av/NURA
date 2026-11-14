const { getPrisma } = require('../config/db');
const { parsePositiveId } = require('../utils/databaseInput');
const httpError = require('../utils/httpError');

const profileSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  preferences: {
    select: {
      cycleLength: true,
      periodLength: true,
      notificationSettings: true,
    },
  },
};

const serializeProfile = (user) => {
  if (!user) {
    throw httpError(404, 'User not found');
  }

  return {
    ...user,
    id: user.id.toString(),
  };
};

const getProfile = async (userId) => {
  const user = await getPrisma().user.findUnique({
    where: { id: parsePositiveId(userId, 'user id') },
    select: profileSelect,
  });

  return serializeProfile(user);
};

const updateProfile = async (userId, input) => {
  const preferenceData = {
    ...(input.cycleLength !== undefined && { cycleLength: input.cycleLength }),
    ...(input.periodLength !== undefined && { periodLength: input.periodLength }),
    ...(input.notificationSettings !== undefined && {
      notificationSettings: input.notificationSettings,
    }),
  };

  const user = await getPrisma().user.update({
    where: { id: parsePositiveId(userId, 'user id') },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(Object.keys(preferenceData).length > 0 && {
        preferences: {
          upsert: {
            create: {
              cycleLength: input.cycleLength ?? 28,
              periodLength: input.periodLength ?? 5,
              notificationSettings: input.notificationSettings ?? {},
            },
            update: preferenceData,
          },
        },
      }),
    },
    select: profileSelect,
  });

  return serializeProfile(user);
};

module.exports = {
  getProfile,
  updateProfile,
};
