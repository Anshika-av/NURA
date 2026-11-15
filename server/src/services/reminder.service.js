const { getPrisma } = require('../config/db');
const {
  parsePagination,
  parsePositiveId,
} = require('../utils/databaseInput');
const httpError = require('../utils/httpError');

const serializeReminder = (reminder) => ({
  id: reminder.id.toString(),
  userId: reminder.userId.toString(),
  reminderType: reminder.reminderType,
  scheduledAt: reminder.scheduledAt,
  status: reminder.status,
  deliveryStatus: reminder.deliveryStatus,
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
      deliveryStatus: 'queued',
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
    select: { id: true, status: true, deliveryStatus: true },
  });

  if (!current) {
    throw httpError(404, 'Reminder not found');
  }

  const isCancelling = ['completed', 'cancelled'].includes(input.status);
  if (current.deliveryStatus === 'processing' && !isCancelling) {
    throw httpError(409, 'Reminder delivery is in progress');
  }

  const isRescheduling = input.scheduledAt !== undefined;
  const shouldRequeue = isRescheduling || input.status === 'pending';
  const status = input.status ?? (isRescheduling ? 'pending' : current.status);
  const deliveryStatus = isCancelling
    ? (current.deliveryStatus === 'sent' ? 'sent' : 'cancelled')
    : input.status === 'sent'
      ? 'sent'
      : shouldRequeue
        ? 'queued'
        : current.deliveryStatus;
  const data = {
    ...(input.reminderType !== undefined && { reminderType: input.reminderType }),
    ...(isRescheduling && { scheduledAt: new Date(input.scheduledAt) }),
    ...(input.status !== undefined || isRescheduling ? { status } : {}),
    ...(deliveryStatus !== current.deliveryStatus && { deliveryStatus }),
    ...((isCancelling || input.status === 'sent' || shouldRequeue) && {
      deliveryAttempts: 0,
      nextAttemptAt: null,
      processingStartedAt: null,
      lastDeliveryError: null,
    }),
  };
  const result = await prisma.reminder.updateMany({
    where: {
      id,
      userId: ownerId,
      status: current.status,
      deliveryStatus: current.deliveryStatus,
    },
    data,
  });

  if (result.count === 0) {
    throw httpError(409, 'Reminder changed while it was being updated');
  }

  const reminder = await prisma.reminder.findFirst({
    where: { id, userId: ownerId },
  });
  if (!reminder) {
    throw httpError(404, 'Reminder not found');
  }
  return serializeReminder(reminder);
};

const deleteReminder = async (userId, reminderId) => {
  const prisma = getPrisma();
  const where = {
    id: parsePositiveId(reminderId, 'reminder id'),
    userId: parsePositiveId(userId, 'user id'),
  };

  const reminder = await prisma.reminder.findFirst({
    where,
    select: { deliveryStatus: true },
  });
  if (!reminder) {
    throw httpError(404, 'Reminder not found');
  }
  if (reminder.deliveryStatus === 'processing') {
    throw httpError(409, 'Reminder delivery is in progress');
  }

  const result = await prisma.reminder.deleteMany({
    where: { ...where, deliveryStatus: { not: 'processing' } },
  });
  if (result.count === 0) {
    throw httpError(409, 'Reminder changed while it was being deleted');
  }
};

module.exports = {
  createReminder,
  deleteReminder,
  getReminder,
  listReminders,
  updateReminder,
};
