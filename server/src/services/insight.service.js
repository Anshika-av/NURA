const { Prisma } = require('@prisma/client');
const { getPrisma } = require('../config/db');
const { parsePositiveId } = require('../utils/databaseInput');
const httpError = require('../utils/httpError');

const getInsights = async (userId, query) => {
  const minimumOccurrences = Number(query.minOccurrences ?? 1);
  if (!Number.isInteger(minimumOccurrences) || minimumOccurrences < 1 || minimumOccurrences > 1000) {
    throw httpError(400, 'minOccurrences must be between 1 and 1000');
  }

  const ownerId = parsePositiveId(userId, 'user id');
  const prisma = getPrisma();
  const cycleLengths = prisma.$queryRaw(Prisma.sql`
    WITH ordered_cycles AS (
      SELECT
        start_date,
        LAG(start_date) OVER (ORDER BY start_date) AS previous_start
      FROM cycles
      WHERE user_id = ${ownerId}
    ),
    intervals AS (
      SELECT start_date - previous_start AS days
      FROM ordered_cycles
      WHERE previous_start IS NOT NULL
    )
    SELECT
      COUNT(*)::int AS "intervalCount",
      AVG(days)::float8 AS "averageCycleLength"
    FROM intervals
    WHERE days BETWEEN 1 AND 120
  `);
  const frequentSymptoms = prisma.$queryRaw(Prisma.sql`
    SELECT
      symptoms.name,
      symptoms.category,
      COUNT(symptom_log_items.id)::int AS occurrences
    FROM symptom_logs
    INNER JOIN symptom_log_items
      ON symptom_log_items.symptom_log_id = symptom_logs.id
    INNER JOIN symptoms
      ON symptoms.id = symptom_log_items.symptom_id
    WHERE symptom_logs.user_id = ${ownerId}
    GROUP BY symptoms.id, symptoms.name, symptoms.category
    HAVING COUNT(symptom_log_items.id) >= ${minimumOccurrences}
    ORDER BY occurrences DESC, symptoms.name ASC
    LIMIT 10
  `);

  const [cycleSummary, symptoms] = await prisma.$transaction([
    cycleLengths,
    frequentSymptoms,
  ]);

  return {
    cycles: cycleSummary[0],
    frequentSymptoms: symptoms,
  };
};

module.exports = {
  getInsights,
};
