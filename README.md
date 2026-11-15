# Nura

Nura is a menstrual health tracking and awareness application. The repository
contains a React/Vite client and an Express API.

Deployed Link: https://nura-rho.vercel.app

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
- [SQL Query Examples](docs/database/Database-Queries.sql)
- Prisma models: `server/prisma/schema.prisma`

Set both `DATABASE_URL` and `SHADOW_DATABASE_URL` in `server/.env` before
running local migrations. Never commit `.env` or real database credentials.

```bash
cd server
npm run db:generate
npm run db:deploy
npm run db:seed
```

For local schema development, use `npm run db:migrate`. Prisma models do not
express PostgreSQL `CHECK` constraints directly, so include the documented
checks in each generated migration before applying it.

Authentication, profile, cycle, period-log, symptom-log, reminder, and insight
routes use Prisma and PostgreSQL. Scheduled reminder emails are sent by the API
worker when SMTP is configured. Health-report metadata is modeled but report
file generation is not implemented yet.

## Database-backed API

The API listens on port `5001`. Check database connectivity at
`GET /api/v1/health/database`. Authentication endpoints are:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

Authenticated routes use a bearer token and currently include:

- `GET/PATCH /api/v1/users/me`
- `GET/POST /api/v1/cycles` and `GET/PUT/DELETE /api/v1/cycles/:id`
- Cycle-nested period-log routes at `/api/v1/cycles/:cycleId/period-logs`
- `GET /api/v1/symptoms` and symptom-log routes at `/api/v1/symptoms/logs`
- `GET/POST /api/v1/reminders` and `GET/PUT/DELETE /api/v1/reminders/:id`
- `GET /api/v1/insights`

Cycle, symptom-log, and reminder history endpoints support pagination.
Symptom-log history also supports `from`, `to`, and `symptomId` query filters.

### Scheduled reminder emails

The server polls due reminders every minute and sends a privacy-preserving email
without including the reminder type. Configure `SMTP_HOST` and `SMTP_FROM` in
`server/.env`. Use port `587` with `SMTP_SECURE=false` (the default), or port
`465` with `SMTP_SECURE=true`. Authenticated SMTP requires TLS. Authentication
is optional, but `SMTP_USER` and `SMTP_PASSWORD` must be set together. Set
`APP_URL` to include a link in the message and adjust
`REMINDER_POLL_INTERVAL_MS` if a different polling interval is needed. Without
SMTP configuration, the API starts but logs that delivery is disabled and
keeps reminders queued. Failed sends are retried with exponential backoff up
to five attempts.
Reminder responses include a `deliveryStatus` (`queued`, `processing`, `sent`,
`failed`, or `cancelled`) independently of the reminder's user-facing status.

Apply the reminder delivery migration before starting the updated server:

```bash
cd server
npm run db:deploy
npm run db:generate
```
