# NURA Submission Documentation

**Project:** NURA — Menstrual Health Tracking and Awareness  
**Reviewed branch:** `main`  

**Status:** Submission draft. The free-tier hosted deployment passed smoke tests on 2026-11-15. Desktop offline implementation, team contribution, and approval details remain pending.

## Document index
1. [Software Requirements Specification](SRS.md)
2. [Use-case diagram and descriptions](USE-CASES.md)
3. [System architecture](SYSTEM-ARCHITECTURE.md)
4. [REST API specification](API-SPECIFICATION.md)
5. [Testing and verification report](TEST-REPORT.md)
6. [Deployment and configuration guide](DEPLOYMENT-GUIDE.md)
7. [Individual contribution record](INDIVIDUAL-CONTRIBUTIONS.md)

## Existing database documentation
The ER model and data dictionary remain in `docs/database/Database-Schema.md`, with the canonical Prisma model in `server/prisma/schema.prisma`. They are not duplicated here.

## Status notes
- The online React/Vite + Express + PostgreSQL application exists in the repository.
- The course requires online and offline applications; the team selected desktop for the offline component.
- Desktop offline storage and synchronization described here are planned, not implemented or tested.
- The production frontend is available at https://nura-rho.vercel.app. Frontend routes, signup/login, API and database health, and the symptom catalogue were smoke-tested; complete cycle and reminder workflows remain unverified.
- Complete the contribution record with team-confirmed responsibilities and evidence; do not infer ownership from commit totals.

Prepared from `main`; recheck course-specific details and production behavior against the final release before submission.
