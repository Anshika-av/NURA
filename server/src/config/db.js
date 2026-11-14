const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');

let pool;
let client;

const getPrisma = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be configured');
  }

  if (!client) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    });
    client = new PrismaClient({
      adapter: new PrismaPg(pool),
    });
  }

  return client;
};

const disconnectPrisma = async () => {
  if (client) {
    await client.$disconnect();
    client = undefined;
    pool = undefined;
    return;
  }

  if (pool) {
    await pool.end();
    pool = undefined;
  }
};

module.exports = {
  getPrisma,
  disconnectPrisma,
};
