const { getPrisma } = require('../config/db');
const {
  parsePositiveId,
  toDatabaseDate,
} = require('../utils/databaseInput');
const httpError = require('../utils/httpError');

const serializePeriodLog = (periodLog) => ({
  ...periodLog,
  id: periodLog.id.toString(),
  cycleId: periodLog.cycleId.toString(),
});

const findOwnedCycle = async (prisma, userId, cycleId) => {
  const cycle = await prisma.cycle.findFirst({
    where: {
      id: parsePositiveId(cycleId, 'cycle id'),
      userId: parsePositiveId(userId, 'user id'),
    },
    select: { id: true },
  });

  if (!cycle) {
    throw httpError(404, 'Cycle not found');
  }

  return cycle.id;
};

const listPeriodLogs = async (userId, cycleId) => {
  const prisma = getPrisma();
  const ownedCycleId = await findOwnedCycle(prisma, userId, cycleId);
  const entries = await prisma.periodLog.findMany({
    where: { cycleId: ownedCycleId },
    orderBy: [{ startDate: 'desc' }, { id: 'desc' }],
  });

  return entries.map(serializePeriodLog);
};

const createPeriodLog = async (userId, cycleId, input) => {
  const prisma = getPrisma();
  const ownedCycleId = await findOwnedCycle(prisma, userId, cycleId);
  const entry = await prisma.periodLog.create({
    data: {
      cycleId: ownedCycleId,
      startDate: toDatabaseDate(input.startDate),
      endDate: input.endDate ? toDatabaseDate(input.endDate) : null,
      flowIntensity: input.flowIntensity,
    },
  });

  return serializePeriodLog(entry);
};

const getPeriodLog = async (userId, cycleId, periodLogId) => {
  const prisma = getPrisma();
  const ownedCycleId = await findOwnedCycle(prisma, userId, cycleId);
  const entry = await prisma.periodLog.findFirst({
    where: {
      id: parsePositiveId(periodLogId, 'period-log id'),
      cycleId: ownedCycleId,
    },
  });

  if (!entry) {
    throw httpError(404, 'Period log not found');
  }

  return serializePeriodLog(entry);
};

const updatePeriodLog = async (userId, cycleId, periodLogId, input) => {
  const prisma = getPrisma();
  const ownedCycleId = await findOwnedCycle(prisma, userId, cycleId);
  const id = parsePositiveId(periodLogId, 'period-log id');
  const current = await prisma.periodLog.findFirst({
    where: { id, cycleId: ownedCycleId },
  });

  if (!current) {
    throw httpError(404, 'Period log not found');
  }

  const startDate = input.startDate
    ? toDatabaseDate(input.startDate)
    : current.startDate;
  const endDate = Object.hasOwn(input, 'endDate')
    ? (input.endDate ? toDatabaseDate(input.endDate) : null)
    : current.endDate;

  if (endDate && endDate < startDate) {
    throw httpError(400, 'End date cannot be earlier than start date');
  }

  const entry = await prisma.periodLog.update({
    where: { id },
    data: {
      ...(input.startDate && { startDate }),
      ...(Object.hasOwn(input, 'endDate') && { endDate }),
      ...(input.flowIntensity && { flowIntensity: input.flowIntensity }),
    },
  });

  return serializePeriodLog(entry);
};

const deletePeriodLog = async (userId, cycleId, periodLogId) => {
  const prisma = getPrisma();
  const ownedCycleId = await findOwnedCycle(prisma, userId, cycleId);
  const result = await prisma.periodLog.deleteMany({
    where: {
      id: parsePositiveId(periodLogId, 'period-log id'),
      cycleId: ownedCycleId,
    },
  });

  if (result.count === 0) {
    throw httpError(404, 'Period log not found');
  }
};

module.exports = {
  createPeriodLog,
  deletePeriodLog,
  getPeriodLog,
  listPeriodLogs,
  updatePeriodLog,
};
