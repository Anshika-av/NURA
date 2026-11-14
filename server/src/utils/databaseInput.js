const httpError = require('./httpError');

const parsePositiveId = (value, label = 'id') => {
  if (!/^[1-9]\d*$/.test(String(value))) {
    throw httpError(400, `Invalid ${label}`);
  }
  return BigInt(value);
};

const parsePagination = (query) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw httpError(400, 'page must be positive and limit must be between 1 and 100');
  }

  return { page, limit, skip: (page - 1) * limit };
};

const toDatabaseDate = (value) => new Date(`${value}T00:00:00.000Z`);

module.exports = {
  parsePagination,
  parsePositiveId,
  toDatabaseDate,
};
