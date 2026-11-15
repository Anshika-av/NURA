# NURA — Testing and Verification Report

**Status:** Current local automated checks recorded; manual evidence and team sign-off remain pending.  
**Environment:** Local development on macOS.  
**Verification date:** 2026-11-15  
**Reviewed commit:** `9b36d08`  
**Production tests:** Not performed because no production deployment was verified.

## 1. Latest local verification

| Check | Recorded result | Command/evidence |
| --- | --- | --- |
| Frontend lint | Passed | `cd client && npm run lint` |
| Frontend production build | Passed | `cd client && npm run build` |
| Backend automated tests | 41 passed across 12 suites | `cd server && npm test` |
| Prisma schema validation | Passed | `cd server && npx prisma validate` |
| Prisma migrations | Database schema up to date | `cd server && npx prisma migrate status` |
| Reminder delivery unit tests | Passed with mocked SMTP sender; live SMTP not configured | `server/tests/reminderDelivery.service.test.js`, `server/tests/reminderEmail.service.test.js` |
| Production deployment | Not verified | No production URL/configuration found |
| Desktop offline behavior | Not implemented/tested | Desktop, local DB, and sync are planned |

These checks were run locally on the verification date above. They do not replace manual end-to-end testing or production verification. Attach dated output/screenshots and tester details before submission.

## 2. Recommended regression commands
```bash
cd server
npm test
npx prisma migrate status
```
```bash
cd client
npm run lint
npm run build
```
With server running:
```bash
curl -i http://localhost:5001/api/v1/health
curl -i http://localhost:5001/api/v1/health/database
```
Never include real credentials, tokens, or real health records in evidence.

## 3. Functional test matrix
| ID | Test | Expected result | Status |
| --- | --- | --- | --- |
| T-01 | Register valid account | Account and token returned | Re-run/attach evidence |
| T-02 | Invalid email or short password | Validation error | Re-run/attach evidence |
| T-03 | Valid login | Token returned | Re-run/attach evidence |
| T-04 | Invalid login | Authentication failure | Re-run/attach evidence |
| T-05 | Protected endpoint without token | 401 response | Re-run/attach evidence |
| T-06 | Create and retrieve cycle | Owning user's record returned | Re-run/attach evidence |
| T-07 | End date earlier than start | Validation error | Re-run/attach evidence |
| T-08 | Create period log | Log linked to cycle | Re-run/attach evidence |
| T-09 | Create symptom log | Log and items persisted | Re-run/attach evidence |
| T-10 | Duplicate symptom in one log | Validation error | Re-run/attach evidence |
| T-11 | Create/update/delete reminder | State changes persisted | Re-run/attach evidence |
| T-12 | Retrieve insights | Insight response returned | Re-run/attach evidence |
| T-13 | Access another user's record | Denied/not found per ownership policy | Verify explicitly |
| T-14 | Database unavailable | Health endpoint returns 503 | Verify explicitly |
| T-15 | Exceed rate limit | 429 response | Verify explicitly |
| T-16 | Deliver a due reminder with configured SMTP | Generic email sent; delivery state becomes `sent` | Live SMTP test pending |

## 4. Desktop tests — pending implementation
| ID | Test | Expected result |
| --- | --- | --- |
| D-01 | Launch with network disabled | Desktop opens |
| D-02 | View synchronized history offline | Local data displayed |
| D-03 | Add/edit record offline | Local save succeeds |
| D-04 | Quit and relaunch offline | Local changes remain |
| D-05 | Restore network | Pending queue synchronizes |
| D-06 | Interrupt sync | Pending changes retained and retried |
| D-07 | Replay same operation | No duplicate server record |
| D-08 | Edit same record on two clients | Conflict detected/handled |
| D-09 | Log out/switch account | Local data isolated per policy |
| D-10 | Inspect renderer privileges | No unrestricted Node/filesystem access |

## 5. Defects and evidence
| Defect | Description | Severity | Resolution | Evidence |
| --- | --- | --- | --- | --- |
| None recorded in this interim report | Populate during regression testing. | | | |

Attach dated terminal output/screenshots, app version/commit, tester, and pass/fail status. Do not attach real user menstrual records.

## 6. Sign-off
| Tester | Name | Date | Notes |
| --- | --- | --- | --- |
| Team member 1 | To be completed | | |
| Team member 2 | To be completed | | |
| Team member 3 | To be completed | | |
