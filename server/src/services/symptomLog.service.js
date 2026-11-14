const { z } = require('zod');
const { getPrisma } = require('../config/db');
const {
  parsePagination,
  parsePositiveId,
  toDatabaseDate,
} = require('../utils/databaseInput');
const httpError = require('../utils/httpError');

const symptomLogFiltersSchema = z.object({
  from: z.string().date().optional(),
  to: z.string().date().optional(),
  symptomId: z.string().regex(/^[1-9]\d*$/).optional(),
});

const includeItems = {
  items: {
    include: {
      symptom: true,
    },
    orderBy: { id: 'asc' },
  },
};

const serializeSymptomLog = (log) => ({
  ...log,
  id: log.id.toString(),
  userId: log.userId.toString(),
  items: log.items.map((item) => ({
    id: item.id.toString(),
    severity: item.severity,
    symptom: {
      id: item.symptom.id.toString(),
      name: item.symptom.name,
      category: item.symptom.category,
    },
  })),
});

const createItems = (items) => items.map((item) => ({
  severity: item.severity,
  symptom: {
    connectOrCreate: {
      where: {
        name_category: {
          name: item.name,
          category: item.category,
        },
      },
      create: {
        name: item.name,
        category: item.category,
      },
    },
  },
}));

const listSymptomLogs = async (userId, query) => {
  const prisma = getPrisma();
  const ownerId = parsePositiveId(userId, 'user id');
  const filters = symptomLogFiltersSchema.safeParse(query);
  if (!filters.success) {
    throw httpError(400, 'Invalid symptom-log filters');
  }
  const { from, to, symptomId } = filters.data;
  if (from && to && from > to) {
    throw httpError(400, 'from cannot be later than to');
  }
  const { page, limit, skip } = parsePagination(query);
  const where = {
    userId: ownerId,
    ...((from || to) && {
      date: {
        ...(from && { gte: toDatabaseDate(from) }),
        ...(to && { lte: toDatabaseDate(to) }),
      },
    }),
    ...(symptomId && {
      items: {
        some: { symptomId: parsePositiveId(symptomId, 'symptom id') },
      },
    }),
  };
  const [logs, total] = await prisma.$transaction([
    prisma.symptomLog.findMany({
      where,
      include: includeItems,
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.symptomLog.count({ where }),
  ]);

  return {
    logs: logs.map(serializeSymptomLog),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const createSymptomLog = async (userId, input) => {
  const log = await getPrisma().symptomLog.create({
    data: {
      userId: parsePositiveId(userId, 'user id'),
      date: toDatabaseDate(input.date),
      mood: input.mood ?? null,
      notes: input.notes ?? null,
      items: {
        create: createItems(input.items),
      },
    },
    include: includeItems,
  });

  return serializeSymptomLog(log);
};

const getSymptomLog = async (userId, logId) => {
  const log = await getPrisma().symptomLog.findFirst({
    where: {
      id: parsePositiveId(logId, 'symptom-log id'),
      userId: parsePositiveId(userId, 'user id'),
    },
    include: includeItems,
  });

  if (!log) {
    throw httpError(404, 'Symptom log not found');
  }

  return serializeSymptomLog(log);
};

const updateSymptomLog = async (userId, logId, input) => {
  const prisma = getPrisma();
  const id = parsePositiveId(logId, 'symptom-log id');
  const ownerId = parsePositiveId(userId, 'user id');
  const current = await prisma.symptomLog.findFirst({
    where: { id, userId: ownerId },
    select: { id: true },
  });

  if (!current) {
    throw httpError(404, 'Symptom log not found');
  }

  const log = await prisma.symptomLog.update({
    where: { id },
    data: {
      ...(input.date && { date: toDatabaseDate(input.date) }),
      ...(Object.hasOwn(input, 'mood') && { mood: input.mood }),
      ...(Object.hasOwn(input, 'notes') && { notes: input.notes }),
      ...(input.items && {
        items: {
          deleteMany: {},
          create: createItems(input.items),
        },
      }),
    },
    include: includeItems,
  });

  return serializeSymptomLog(log);
};

const deleteSymptomLog = async (userId, logId) => {
  const result = await getPrisma().symptomLog.deleteMany({
    where: {
      id: parsePositiveId(logId, 'symptom-log id'),
      userId: parsePositiveId(userId, 'user id'),
    },
  });

  if (result.count === 0) {
    throw httpError(404, 'Symptom log not found');
  }
};

const listSymptoms = async () => {
  const symptoms = await getPrisma().symptom.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  return symptoms.map((symptom) => ({
    ...symptom,
    id: symptom.id.toString(),
  }));
};

module.exports = {
  createSymptomLog,
  deleteSymptomLog,
  getSymptomLog,
  listSymptoms,
  listSymptomLogs,
  updateSymptomLog,
};
