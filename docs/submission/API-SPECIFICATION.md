# NURA — REST API Specification

**API prefix:** `/api/v1`  
**Format:** JSON  
**Authentication:** JWT bearer token on protected routes

This specification is based on `server/src/routes`, validators, middleware, and README. Where the exact query parameter or response shape was not confirmed, it is explicitly marked for verification rather than guessed.

## 1. Conventions
- Protected routes require `Authorization: Bearer <token>`.
- Registration and login are public.
- Success responses generally use `success: true` and `data`; health responses include `success` and `message`.
- Errors use `success: false` and `message`; validation middleware may add field errors.
- 401: missing/invalid/expired token. 429: rate limit. 503: database health check unavailable. 500: unexpected server error.
- Date-only fields use `YYYY-MM-DD`. Reminder `scheduledAt` requires an offset-aware ISO datetime.

## 2. Health
| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | No | API process health |
| GET | `/health/database` | No | Database connectivity check; 503 on failure |
| GET | `/` | No | API v1 status |

## 3. Authentication
| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Authenticate account |

Registration JSON:
```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "at-least-8-characters"
}
```
Name is trimmed, 2–100 chars; email must be valid and is normalized to lowercase; password minimum is 8 characters.

Login JSON:
```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```
Successful registration/login returns user and JWT under `data`. Never log or publish the token.

## 4. User profile
| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/users/me` | Yes | Retrieve authenticated user's profile |
| PATCH | `/users/me` | Yes | Update profile; request validated by user validator |

## 5. Cycles and period logs
| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/cycles` | Yes | List user's cycles |
| POST | `/cycles` | Yes | Create cycle |
| GET | `/cycles/:id` | Yes | Retrieve cycle |
| PUT | `/cycles/:id` | Yes | Update cycle |
| DELETE | `/cycles/:id` | Yes | Delete cycle |
| GET | `/cycles/:cycleId/period-logs` | Yes | List period logs for cycle |
| POST | `/cycles/:cycleId/period-logs` | Yes | Create period log |
| GET | `/cycles/:cycleId/period-logs/:periodLogId` | Yes | Retrieve period log |
| PUT | `/cycles/:cycleId/period-logs/:periodLogId` | Yes | Update period log |
| DELETE | `/cycles/:cycleId/period-logs/:periodLogId` | Yes | Delete period log |

Cycle create accepts `startDate` (valid date) and optional nullable `endDate`. If `endDate` is supplied it cannot precede `startDate`. Update requires at least one cycle field. `GET /cycles` returns `data.cycles` and `data.pagination`; each listed cycle includes its `periodLogs`, ordered newest first.

Example:
```json
{
  "startDate": "2026-11-01",
  "endDate": null
}
```

## 6. Symptoms and logs
| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/symptoms` | Yes | List symptom catalogue |
| GET | `/symptoms/logs` | Yes | List symptom logs |
| POST | `/symptoms/logs` | Yes | Create symptom log |
| GET | `/symptoms/logs/:id` | Yes | Retrieve log |
| PUT | `/symptoms/logs/:id` | Yes | Update log |
| DELETE | `/symptoms/logs/:id` | Yes | Delete log |

A symptom log accepts `date`, optional nullable `mood`, optional nullable `notes` (max 5,000 chars), and `items` (max 30). Each item has `name`, `category`, and severity: `mild`, `moderate`, or `severe`. Duplicate name/category pairs in one log are rejected. `GET /symptoms/logs` returns `data.logs` and `data.pagination`; `GET /symptoms` returns the catalogue array directly under `data`. Symptom-log history accepts `from`, `to`, and `symptomId` filters.

## 7. Reminders
| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/reminders` | Yes | List reminders |
| POST | `/reminders` | Yes | Create reminder |
| GET | `/reminders/:id` | Yes | Retrieve reminder |
| PUT | `/reminders/:id` | Yes | Update reminder |
| DELETE | `/reminders/:id` | Yes | Delete reminder |

Create requires `reminderType` (1–50 chars) and `scheduledAt` (offset-aware ISO datetime). Update accepts one or more of `reminderType`, `scheduledAt`, `status`. Allowed statuses: `pending`, `sent`, `completed`, `cancelled`. Responses include `deliveryStatus`: `queued`, `processing`, `sent`, `failed`, or `cancelled`. Creating or rescheduling queues an email; successful delivery sets status to `sent`. Cancelling/completing a queued reminder prevents delivery. Rescheduling/type edits or deletion during active delivery may return 409. Email delivery runs only when SMTP is configured, and the message omits the reminder type.

## 8. Insights
| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/insights` | Yes | Retrieve cycle-related insights |

Optional query parameter `minOccurrences` defaults to `1` and must be an integer from `1` to `1000`. The response contains `data.cycles` (`intervalCount`, nullable `averageCycleLength`) and `data.frequentSymptoms` (up to 10 `{name, category, occurrences}` entries).

## 9. Pagination/filtering
Paginated `GET /cycles`, `GET /symptoms/logs`, and `GET /reminders` accept `page` (default `1`) and `limit` (default `20`, maximum `100`). Invalid values return 400. Their `data.pagination` object contains `page`, `limit`, `total`, and `pages`.

Cycles sort by `startDate` descending, then ID descending; symptom logs sort by `date` descending, then ID descending; reminders sort by `scheduledAt` ascending, then ID ascending. Symptom-log history also accepts `from` and `to` (`YYYY-MM-DD`) and `symptomId`; `from` cannot be later than `to`.

## 10. Security and operational behavior
- All cycle, period-log, symptom, profile, reminder, and insight routes require JWT authentication.
- Auth endpoints have a stricter rate limit; API has a general rate limit.
- Helmet supplies security headers.
- Current CORS config permits local development origins only; production origin configuration remains pending.
- Do not include sensitive menstrual details in logs or email content beyond what is strictly necessary.

## 11. Desktop sync API — not implemented
The current route tree contains no desktop synchronization endpoints. Before desktop release, design authenticated upload/download or incremental sync with stable client operation IDs, idempotent replay, per-record ownership checks, version metadata, explicit conflict responses, deletion tombstones, pagination/cursors, and retryable error classification. Do not present these as existing endpoints.
