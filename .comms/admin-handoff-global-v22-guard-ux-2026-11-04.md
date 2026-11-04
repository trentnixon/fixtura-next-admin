# Admin: Global v2.2 guard UX (2026-11-04)

Backend handoff: when `summary.globalV22GuardBlocked` is set and there is no `result_batch_scrape` item, Admin shows:

- Warning banner with link to `blockingRunId`
- Synthetic Step 3 row in the steps table (Blocked / guard)

Parser: `parseGlobalV22GuardBlocked` in `src/lib/account-asset-run/globalV22Guard.ts`.

API field: `GET /api/account-asset-runs/:id/status` → `data.summary.globalV22GuardBlocked`.

Trigger toast warns when queued run already carries guard metadata or `advanced.status === global_v22_guard_blocked`.
