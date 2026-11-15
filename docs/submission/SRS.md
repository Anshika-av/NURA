# NURA — Software Requirements Specification

**Version:** 1.0  
**Status:** Draft aligned with `main` at commit `9b36d08`; team and mentor approval remain pending

## 1. Purpose
NURA is a menstrual health tracking and awareness platform. It helps users record menstrual cycles, period dates, symptoms, moods, and reminders, and view cycle-related summaries. The project includes an online web application and a separately required offline desktop application.

## 2. Scope

### 2.1 Online application represented in the repository
- React 19 and Vite web client.
- Express 5 REST API versioned under `/api/v1`.
- PostgreSQL persistence through Prisma.
- Registration and login using JWT bearer authentication.
- Profile, cycle, period-log, symptom-log, reminder, and insight routes.
- Scheduled reminder email delivery when SMTP is configured.

### 2.2 Offline desktop application — planned
The team selected desktop as its offline application type. Proposed implementation: Electron desktop shell reusing the React UI, local SQLite persistence, and a synchronization service to the existing API when connectivity returns. Confirm these technology choices with the mentor. A desktop wrapper that only loads the hosted website does not meet the offline requirement.

### 2.3 Out of scope unless separately approved
- Medical diagnosis, treatment, or emergency medical advice.
- Guaranteed period or fertility predictions.
- Health report file generation (the current schema stores report metadata; README says file generation is not implemented).
- Device integrations or clinical-provider workflows.

## 3. Stakeholders
- End user: records personal cycle and symptom information.
- Project team: designs, implements, tests, documents, and demonstrates NURA.
- Mentor/evaluator: reviews the project against course rubrics.
- Operator/deployer: configures hosting, API, database, HTTPS, CORS, and optional SMTP.

## 4. Functional requirements

### 4.1 Online requirements and current status
| ID | Requirement | Current evidence |
| --- | --- | --- |
| FR-01 | Register with name, email, password. | Implemented: `POST /api/v1/auth/register` |
| FR-02 | Log in and receive an auth token. | Implemented: `POST /api/v1/auth/login` |
| FR-03 | Require a valid bearer token on protected routes. | Implemented by auth middleware |
| FR-04 | Retrieve/update own profile. | Implemented: `/api/v1/users/me` |
| FR-05 | Create/list/retrieve/update/delete own cycles. | Implemented: `/api/v1/cycles` |
| FR-06 | Manage period logs under a cycle. | Implemented: nested period-log routes |
| FR-07 | Browse symptoms and manage symptom logs. | Implemented: `/api/v1/symptoms` |
| FR-08 | Create/list/retrieve/update/delete reminders. | Implemented: `/api/v1/reminders` |
| FR-09 | Retrieve cycle insights. | Implemented: `GET /api/v1/insights` |
| FR-10 | Check API and database health. | Implemented: `/api/v1/health` and `/health/database` |
| FR-11 | Deliver due reminders by email when SMTP is configured. | Scheduler and delivery service exist; production SMTP remains to be verified |

### 4.2 Offline desktop requirements — to implement
| ID | Requirement | Acceptance condition |
| --- | --- | --- |
| OF-01 | Launch without internet. | App opens and core screens remain usable with network disabled. |
| OF-02 | View locally available cycle and symptom history offline. | Previously synchronized data is displayed. |
| OF-03 | Create/edit agreed tracking records offline. | Local transaction completes before UI confirms save. |
| OF-04 | Queue offline changes durably. | Pending operations survive application restart. |
| OF-05 | Retry synchronization after reconnect. | Pending changes sync after network returns without loss. |
| OF-06 | Prevent duplicate synchronization. | Replaying an operation does not create duplicate server records. |
| OF-07 | Detect conflicting edits. | Conflict is surfaced or resolved by an agreed, tested policy. |
| OF-08 | Display synchronization state. | UI distinguishes offline, pending, syncing, synced, and failed. |
| OF-09 | Protect local sensitive data. | Local data and credentials use an approved secure storage approach. |

## 5. Desktop design decisions to settle
- First-time authentication and offline session behavior.
- Record types included in the first offline release.
- Client-generated IDs/idempotency keys and server ID mapping.
- Conflict policy; recommended initial behavior is detect and surface conflicts, not silently overwrite health records.
- Local database encryption, key management, logout, account switching, and data retention.
- Target desktop operating system and installer format.

## 6. Non-functional requirements
- Privacy: menstrual and symptom information is sensitive; minimize collection and avoid logging it.
- Security: password hashes only, secrets in environment configuration, HTTPS in production, restrictive CORS, rate limiting, and ownership checks.
- Reliability: network/database errors must be handled; offline writes must survive restart.
- Usability: clear navigation, accessible labels, readable dates, and visible save/sync feedback.
- Maintainability: separate UI, routes, validation, business logic, and persistence; version migrations.
- Portability: define and test supported desktop OS and package format.

## 7. Data requirements
The canonical online data model is documented in `docs/database/Database-Schema.md` and `server/prisma/schema.prisma`. It covers Users, UserPreferences, Cycles, PeriodLogs, SymptomLogs, Symptoms, SymptomLogItems, Reminders, and HealthReports. The desktop store must map to this model consistently.

## 8. Assumptions and constraints
- PostgreSQL is the online system of record.
- API prefix is `/api/v1`.
- Frontend API URL is configurable through `VITE_API_BASE_URL`.
- Backend runtime settings are environment-based.
- SMTP is optional; email delivery is disabled when required SMTP settings are absent.
- Hosting provider, domains, desktop OS, and offline sync implementation are not confirmed in the reviewed branch.

## 9. Approval
| Reviewer | Name | Date | Approval/comments |
| --- | --- | --- | --- |
| Mentor | To be completed | | |
| Team member 1 | To be completed | | |
| Team member 2 | To be completed | | |
| Team member 3 | To be completed | | |
