# NURA — Deployment and Configuration Guide

**Status:** Deployment configurations are included for Vercel, Render, and Docker. No hosted deployment has been run or verified.

## 1. Current status
The repository includes `client/vercel.json`, `render.yaml`, and `docker-compose.yml`. These are deployment configurations, not evidence that a production deployment has completed. Do not state that NURA is deployed until the smoke tests below pass.

## 2. Vercel + Render
The intended hosted topology is the Vite frontend on Vercel and the Express API plus PostgreSQL on Render. Render can also host the frontend through the included Blueprint.

### Vercel frontend
1. Import the repository in Vercel and set the project root directory to `client`.
2. Use the detected Vite settings (`npm run build`, output directory `dist`); `client/vercel.json` provides SPA fallback for client-side routes.
3. Set `VITE_API_BASE_URL` in the Vercel project to `https://<your-render-api-host>/api/v1`, then redeploy. This value is public and is embedded at build time.
4. Add the exact Vercel production origin to the Render API's `CORS_ORIGINS` environment variable (comma-separated if multiple origins) and redeploy the API.

### Render Blueprint
1. Create a Blueprint from the repository using `render.yaml`.
2. Review Render's plan and current pricing before provisioning. The Blueprint requests a persistent `basic-256mb` PostgreSQL instance; change the plan to one appropriate for expected load and availability.
3. The API build generates the Prisma client and applies committed migrations; the health check is `/api/v1/health`.
4. The Blueprint allows the Render static-site origin by default. If using Vercel, include that origin in `CORS_ORIGINS` in the Render dashboard.
5. Add SMTP credentials in the Render dashboard only if reminder email delivery is required. Never put secrets in `render.yaml`.

The Render Blueprint uses the predictable service URLs `nura-api.onrender.com` and `nura-web.onrender.com`; update the frontend API URL and backend `APP_URL`/`CORS_ORIGINS` if service names or custom domains change.

## 3. Docker Compose
Docker runs the frontend, API, and PostgreSQL together. The API waits for PostgreSQL, applies migrations, and then starts. The database is persisted in the `nura-postgres` volume and is not published to the host.

```bash
cp .env.example .env
# Generate unique URL-safe values, then put them in .env:
openssl rand -hex 32
openssl rand -hex 32
docker compose up --build
```

Open `http://localhost:8080`; the frontend proxies `/api/` to the API. The API health check is at `http://localhost:5001/api/v1/health`. To stop the containers while preserving database data, run `docker compose down`. Back up the volume before upgrades or migrations. The sample secrets and local HTTP setup are for development only; configure TLS, managed secrets, backups, and access controls before exposing this stack publicly.

## 4. Backend environment variables
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
| `CORS_ORIGINS` | Optional | Comma-separated exact frontend origins; defaults to local Vite ports |

Use `server/.env.example` as the source for current variable names. Never commit `.env` or real secrets.

## 5. Frontend build variable
| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Public API base URL, e.g. `https://api.example.tld/api/v1` |

Vite-prefixed variables are embedded in browser code and are public. Never put JWT secrets, database credentials, SMTP passwords, or private keys in frontend variables.

## 6. CORS and HTTPS
The backend reads `CORS_ORIGINS` as a comma-separated exact-origin allowlist, defaulting to `http://localhost:5173,http://localhost:5174`. Add production origins, including scheme and host; do not use wildcard origins for authenticated requests. Keep allowed methods and headers aligned with actual client use. Enable HTTPS, set `VITE_API_BASE_URL` to the HTTPS API URL, and test OPTIONS preflight and authenticated requests from the deployed frontend.

CORS is not authentication or authorization.

## 7. Database deployment
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

## 8. Backend deployment
- Install from lockfile with `npm ci`.
- Use `npm start` (`node src/server.js`).
- Configure environment variables in host settings, not source control.
- Ensure host routes traffic to `PORT`.
- Review startup logs and reminder email configuration warning.
- If email is in demo scope, configure SMTP and verify a test message without including health details.
- Verify `/api/v1/health` and `/api/v1/health/database` over HTTPS.

## 9. Frontend deployment
From `client/`:
```bash
npm ci
npm run lint
npm run build
```
Publish `client/dist/`. Configure SPA fallback so `/login`, `/register`, and `/dashboard` resolve to the app entry point. Set `VITE_API_BASE_URL` before building. The Vite development proxy to localhost:5001 is not a production reverse proxy.

## 10. Security/privacy checklist
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

## 11. Production smoke tests
- [ ] Open frontend over HTTPS.
- [ ] Register/login a test account.
- [ ] Access protected dashboard.
- [ ] Create/read/update/delete test cycle and symptom log.
- [ ] Create/update reminder.
- [ ] Verify API and database health endpoints.
- [ ] Verify CORS preflight and no mixed-content/certificate errors.
- [ ] Verify logs and backup configuration.
- [ ] Record URLs, deployment date, commit SHA, and tester.

## 12. Deployment record
| Item | Value |
| --- | --- |
| Frontend provider / URL | Pending |
| Backend provider / URL | Pending |
| PostgreSQL provider | Pending |
| Domain / HTTPS issuer | Pending |
| Deployed commit SHA | Pending |
| Deployment date | Pending |
| Smoke-test result | Pending |

## 13. Desktop packaging
After offline implementation, select target OS/package; build and sign installer where feasible; test install, upgrade, uninstall, offline startup, sync, local data retention/deletion, and backup/restore. Document local database location and release version.
