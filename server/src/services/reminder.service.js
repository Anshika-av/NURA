const { getPrisma } = require('../config/db');
const {
  parsePagination,
  parsePositiveId,
} = require('../utils/databaseInput');
const httpError = require('../utils/httpError');

const serializeReminder = (reminder) => ({
  ...reminder,
  id: reminder.id.toString(),
  userId: reminder.userId.toString(),
});

const listReminders = async (userId, query) => {
  const prisma = getPrisma();
  const ownerId = parsePositiveId(userId, 'user id');
  const { page, limit, skip } = parsePagination(query);
  const [reminders, total] = await prisma.$transaction([
    prisma.reminder.findMany({
      where: { userId: ownerId },
      orderBy: [{ scheduledAt: 'asc' }, { id: 'asc' }],
      skip,
      take: limit,
    }),
    prisma.reminder.count({ where: { userId: ownerId } }),
  ]);

  return {
    reminders: reminders.map(serializeReminder),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const createReminder = async (userId, input) => {
  const reminder = await getPrisma().reminder.create({
    data: {
      userId: parsePositiveId(userId, 'user id'),
      reminderType: input.reminderType,
      scheduledAt: new Date(input.scheduledAt),
    },
  });

  return serializeReminder(reminder);
};

const getReminder = async (userId, reminderId) => {
  const reminder = await getPrisma().reminder.findFirst({
    where: {
      id: parsePositiveId(reminderId, 'reminder id'),
      userId: parsePositiveId(userId, 'user id'),
    },
  });

  if (!reminder) {
    throw httpError(404, 'Reminder not found');
  }

  return serializeReminder(reminder);
};

const updateReminder = async (userId, reminderId, input) => {
  const prisma = getPrisma();
  const ownerId = parsePositiveId(userId, 'user id');
  const id = parsePositiveId(reminderId, 'reminder id');
  const current = await prisma.reminder.findFirst({
    where: { id, userId: ownerId },
    select: { id: true },
  });

  if (!current) {
    throw httpError(404, 'Reminder not found');
  }

  const reminder = await prisma.reminder.update({
    where: { id },
    data: {
      ...(input.reminderType !== undefined && { reminderType: input.reminderType }),
      ...(input.scheduledAt !== undefined && {
        scheduledAt: new Date(input.scheduledAt),
      }),
      ...(input.status !== undefined && { status: input.status }),
    },
  });

  return serializeReminder(reminder);
};

const deleteReminder = async (userId, reminderId) => {
  const result = await getPrisma().reminder.deleteMany({
    where: {
      id: parsePositiveId(reminderId, 'reminder id'),
      userId: parsePositiveId(userId, 'user id'),
    },
  });

  if (result.count === 0) {
    throw httpError(404, 'Reminder not found');
  }
};

module.exports = {
  createReminder,
  deleteReminder,
  getReminder,
  listReminders,
  updateReminder,
};
