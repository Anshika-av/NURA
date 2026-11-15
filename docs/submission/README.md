# NURA Submission Documentation

**Project:** NURA — Menstrual Health Tracking and Awareness  
**Reviewed branch:** `main`  
**Reviewed commit:** `c186021`

**Status:** Submission draft. Free-tier deployment configuration is prepared but not deployed or verified. Desktop offline implementation, team contribution, and approval details remain pending.

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
- The repository includes Vercel, Render, and Docker deployment configuration; no production URL or verified hosted deployment is recorded.
- Complete the contribution record with team-confirmed responsibilities and evidence; do not infer ownership from commit totals.

Prepared from `main` at commit `c186021`; free-tier deployment configuration was added in commit `d6190c4`. Recheck against the final release before submission.
