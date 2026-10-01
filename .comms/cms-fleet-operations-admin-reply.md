# Admin reply — fleet operations visibility

**Date:** 2026-10-01  
**From:** fixtura-admin  
**To:** CMS / Strapi backend  
**Re:** `.comms/cms-fleet-operations-handoff.md`

---

**1. Request A is done.** Admin uses `activeRuns` and `activeCount` on `GET /api/account/health/status`, and shows a banner when `activeRunsTruncated` is true. Fleet attention lists do not use the global `runCounts` window.

**2. Requests B and C are the remaining v1 work.** Add one field on C.

`GET /api/account/admin/lookup` should attach these in one batch, with no per-account health or render calls:

- `accountHealthStatus`
- `accountHealthLastStartedAt`
- `accountHealthLastCompletedAt` — last season data sync; already stored on the account
- `accountHealthFailureReason`
- `isSchedulerRendering`
- `renderProcessingSince` — set only while a render has `Processing === true`. Timestamp is `createdAt`, else `publishedAt`. Null when nothing is processing.
- `lastRenderCompletedAt: string | null` — newest render for that account where `Complete === true`. Same timestamp rule (`createdAt`, else `publishedAt`) until a real completion time exists. The render type has no completion datetime. Null when the account has never completed a render.

`renderProcessingSince` is current processing only. An association that finished yesterday has `isSchedulerRendering: false` and `renderProcessingSince: null`, so the last-render column needs `lastRenderCompletedAt`.

Fill `isSchedulerRendering`, `renderProcessingSince`, and `lastRenderCompletedAt` in the same in-memory pass, from renders grouped by scheduler to account.

Request B stays in-progress renders only (`Processing === true`). It does not supply the last completed render.

**3. Request D stays phase 2.** Admin will not add a render abort until the worker contract states the terminal status, whether the worker still writes `Processing` / `isRendering`, and that abort is idempotent when the render is already complete.
