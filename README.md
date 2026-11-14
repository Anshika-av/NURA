# Nura

Nura is a menstrual health tracking and awareness application. The repository
contains a React/Vite client and an Express API.

## Run locally

Start the backend in one terminal:

```bash
cd server
npm install
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm install
npm run dev
```

## Database documentation

Nura uses PostgreSQL. The initial relational design covers user accounts,
preferences, cycles, period and symptom logs, reminders, and health report
metadata.

- [Database Schema and Design](docs/database/Database-Schema.md)
- Prisma models: `server/prisma/schema.prisma`

Set `DATABASE_URL` in `server/.env` before running database commands. Never
commit `.env` or real database credentials.

```bash
cd server
npm run db:generate
npm run db:migrate -- --create-only --name init
```

Review the generated migration and add the PostgreSQL `CHECK` constraints
listed in the schema documentation before applying it with `npm run db:migrate`.
Prisma models do not express those checks directly.

The database schema is a foundation; application routes and services still need
to be connected to the generated database client.
