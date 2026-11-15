# NURA — Deployment and Configuration Guide

**Status:** Deployment plan/checklist. Production hosting has not been verified in the reviewed branch.

## 1. Current status
The branch contains local development instructions and a backend environment example, but no verified production frontend URL, API URL, managed database configuration, deployment workflow, or production domain. Do not state that NURA is deployed until the checks below pass.

## 2. Target topology
1. Frontend: publish Vite production build from `client/` to static hosting/CDN.
2. Backend: deploy Node.js Express application from `server/` to application hosting.
3. Database: managed/private PostgreSQL accessible to backend and migration process only.
4. Email: optional SMTP provider for reminder delivery.
5. Desktop: package a desktop application for the agreed evaluation OS after offline functionality is implemented.

Hosting providers and domains need team/mentor selection.

## 3. Backend environment variables
| Variable | Required? | Purpose |
| --- | --- | --- |
| `PORT` | Host-dependent | Port supplied by host; server defaults to 5001 |
| `JWT_SECRET` | Yes | Long random production-only JWT signing secret |
| `DATABASE_URL` | Yes | PostgreSQL runtime connection string |
| `SHADOW_DATABASE_URL` | Dev/migration workflow | Separate Prisma shadow DB; never point to production data |
| `SMTP_HOST` | Required to enable email | SMTP host |
| `SMTP_PORT` | Optional | SMTP port; example defaults to 587 |
| `SMTP_SECURE` | Optional | Use true with implicit TLS (often 465), false with STARTTLS (often 587) |
| `SMTP_USER` | Optional | SMTP username; configure with `SMTP_PASSWORD` |
| `SMTP_PASSWORD` | Optional | SMTP password/app password; configure with `SMTP_USER` |
| `SMTP_FROM` | Required to enable email | Verified sender address |
| `APP_URL` | Optional | Public frontend URL for reminder links |
| `REMINDER_POLL_INTERVAL_MS` | Optional | Scheduler interval; example 60000 ms |

Use `server/.env.example` as the source for current variable names. Never commit `.env` or real secrets.

## 4. Frontend build variable
| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Public API base URL, e.g. `https://api.example.tld/api/v1` |

Vite-prefixed variables are embedded in browser code and are public. Never put JWT secrets, database credentials, SMTP passwords, or private keys in frontend variables.

## 5. CORS and HTTPS
The current `server/src/config/cors.js` permits only `http://localhost:5173` and `http://localhost:5174`. This is development-only. Before production:
1. Refactor CORS to read an explicit comma-separated allowlist from a backend environment variable such as `CORS_ORIGINS`.
2. Add the exact production frontend origin, including scheme and host; do not use wildcard origins for authenticated requests.
3. Keep allowed methods and headers aligned with actual client use.
4. Enable HTTPS for frontend and API using the host's managed TLS or a trusted certificate.
5. Set `VITE_API_BASE_URL` to the HTTPS API URL and avoid mixed content.
6. Configure Express proxy trust only if required by the host's documented reverse-proxy topology.
7. Test OPTIONS preflight and authenticated requests from the deployed frontend.

CORS is not authentication or authorization.

## 6. Database deployment
1. Provision PostgreSQL and a least-privilege application user.
2. Store production `DATABASE_URL` in the backend host's secret manager.
3. Back up database before migrations.
4. Run controlled release migration:
```bash
cd server
npm ci
npm run db:generate
npm run db:deploy
```
5. Verify migration status and database health.
6. Do not run development migration commands against production. Keep shadow DB credentials separate.

## 7. Backend deployment
- Install from lockfile with `npm ci`.
- Use `npm start` (`node src/server.js`).
- Configure environment variables in host settings, not source control.
- Ensure host routes traffic to `PORT`.
- Review startup logs and reminder email configuration warning.
- If email is in demo scope, configure SMTP and verify a test message without including health details.
- Verify `/api/v1/health` and `/api/v1/health/database` over HTTPS.

## 8. Frontend deployment
From `client/`:
```bash
npm ci
npm run lint
npm run build
```
Publish `client/dist/`. Configure SPA fallback so `/login`, `/register`, and `/dashboard` resolve to the app entry point. Set `VITE_API_BASE_URL` before building. The Vite development proxy to localhost:5001 is not a production reverse proxy.

## 9. Security/privacy checklist
- [ ] Production-only high-entropy JWT secret in host secret manager.
- [ ] PostgreSQL network access restricted.
- [ ] HTTPS for frontend and API; secure DB connection as supported.
- [ ] Exact production CORS origin configured and tested.
- [ ] No secrets in Git or frontend build variables.
- [ ] Database backup and restore procedure tested.
- [ ] Logs exclude passwords, tokens, and sensitive health content.
- [ ] Ownership checks and rate limits verified.
- [ ] SMTP credentials stored securely; email remains privacy-preserving.
- [ ] Privacy notice, retention, account deletion, and desktop local-data policy reviewed.

## 10. Production smoke tests
- [ ] Open frontend over HTTPS.
- [ ] Register/login a test account.
- [ ] Access protected dashboard.
- [ ] Create/read/update/delete test cycle and symptom log.
- [ ] Create/update reminder.
- [ ] Verify API and database health endpoints.
- [ ] Verify CORS preflight and no mixed-content/certificate errors.
- [ ] Verify logs and backup configuration.
- [ ] Record URLs, deployment date, commit SHA, and tester.

## 11. Deployment record
| Item | Value |
| --- | --- |
| Frontend provider / URL | Pending |
| Backend provider / URL | Pending |
| PostgreSQL provider | Pending |
| Domain / HTTPS issuer | Pending |
| Deployed commit SHA | Pending |
| Deployment date | Pending |
| Smoke-test result | Pending |

## 12. Desktop packaging
After offline implementation, select target OS/package; build and sign installer where feasible; test install, upgrade, uninstall, offline startup, sync, local data retention/deletion, and backup/restore. Document local database location and release version.
