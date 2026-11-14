const { getPrisma } = require('../config/db');
const httpError = require('../utils/httpError');
const {
  parsePagination,
  parsePositiveId: parseId,
  toDatabaseDate: asDate,
} = require('../utils/databaseInput');

const serializeCycle = (cycle) => ({
  ...cycle,
  id: cycle.id.toString(),
  userId: cycle.userId.toString(),
});

const listCycles = async (userId, query) => {
  const prisma = getPrisma();
  const ownerId = parseId(userId, 'user id');
  const { page, limit, skip } = parsePagination(query);
  const [cycles, total] = await prisma.$transaction([
    prisma.cycle.findMany({
      where: { userId: ownerId },
      orderBy: [{ startDate: 'desc' }, { id: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.cycle.count({ where: { userId: ownerId } }),
  ]);

  return {
    cycles: cycles.map(serializeCycle),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const createCycle = async (userId, input) => {
  const ownerId = parseId(userId, 'user id');
  const endDate = input.endDate ? asDate(input.endDate) : null;
  const cycle = await getPrisma().cycle.create({
    data: {
      userId: ownerId,
      startDate: asDate(input.startDate),
      endDate,
      status: endDate ? 'completed' : 'active',
    },
  });

  return serializeCycle(cycle);
};

const getCycle = async (userId, cycleId) => {
  const cycle = await getPrisma().cycle.findFirst({
    where: {
      id: parseId(cycleId, 'cycle id'),
      userId: parseId(userId, 'user id'),
    },
  });

  if (!cycle) {
    throw httpError(404, 'Cycle not found');
  }

  return serializeCycle(cycle);
};

const updateCycle = async (userId, cycleId, input) => {
  const prisma = getPrisma();
  const ownerId = parseId(userId, 'user id');
  const id = parseId(cycleId, 'cycle id');
  const current = await prisma.cycle.findFirst({
    where: { id, userId: ownerId },
  });

  if (!current) {
    throw httpError(404, 'Cycle not found');
  }

  const startDate = input.startDate ? asDate(input.startDate) : current.startDate;
  const endDate = Object.hasOwn(input, 'endDate')
    ? (input.endDate ? asDate(input.endDate) : null)
    : current.endDate;

  if (endDate && endDate < startDate) {
    throw httpError(400, 'End date cannot be earlier than start date');
  }

  const cycle = await prisma.cycle.update({
    where: { id },
    data: {
      ...(input.startDate && { startDate }),
      ...(Object.hasOwn(input, 'endDate') && { endDate }),
      status: endDate ? 'completed' : 'active',
    },
  });

  return serializeCycle(cycle);
};

const deleteCycle = async (userId, cycleId) => {
  const result = await getPrisma().cycle.deleteMany({
    where: {
      id: parseId(cycleId, 'cycle id'),
      userId: parseId(userId, 'user id'),
    },
  });

  if (result.count === 0) {
    throw httpError(404, 'Cycle not found');
  }
};

module.exports = {
  createCycle,
  deleteCycle,
  getCycle,
  listCycles,
  updateCycle,
};
