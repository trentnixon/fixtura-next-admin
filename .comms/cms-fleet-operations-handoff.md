# CMS handoff — fleet operations visibility (account sync + render pipeline)

**Audience:** Fixtura CMS / Strapi backend team  
**Consumer:** Fixtura admin (`fixtura-admin`) — dashboard, `/dashboard/accounts`, account detail  
**Date:** 2026-09-14  
**Related admin docs:** `.comms/account-health-status-admin-handoff.md`, `.comms/account-health-run-abort-handoff.md`

---

## Summary

Admin now surfaces **two separate** fleet attention streams:

| Stream | Meaning | Current admin data source |
|--------|---------|---------------------------|
| **Account sync** | Season data refresh (`account-health` runs) | `GET /api/account/health/status` |
| **Stuck rendering** | Scheduler/render still processing | Today’s schedulers API + render flags |

Both streams have **blind spots** when fleet-wide active work falls outside “recent window” payloads. This handoff requests CMS changes so admin can list every active/stuck item and enrich account lookup.

---

## Problem 1 — Account sync: `activeCount` vs `latestRuns`

### Current behaviour (documented v1)

- `activeCount`: all runs in `pending`, `queued`, or `running`.
- `latestRuns`: newest **20** rows from newest **100** health runs.

Long-running actives (e.g. 50–60+ hours) may be **counted** in `activeCount` but **missing** from `latestRuns`.

### Request A — `activeRuns` on global health status

**Endpoint:** `GET /api/account/health/status`

Add field:

```ts
activeRuns: Array<AccountHealthGlobalLatestRunRow>;
```

Rules:

- Include **every** run that contributes to `activeCount` (no cap).
- Same row shape as existing `latestRuns[]` entries (id, accountId, accountName, primaryOrgLabel, status, accountType, startedAt, completedAt, failedAt, finalizedAt, failureReason, summary).

Admin will merge `activeRuns` into attention lists (dedupe by run id) and remove “hidden active” banners when this is complete.

---

## Problem 2 — Render pipeline: “today” window vs multi-day stuck

### Current behaviour

Admin uses **today’s scheduler/render rollup** to detect `processing === true` longer than 30 minutes. A render can show **157h+** elapsed while still being tied to “today’s” scheduler payload — confusing and incomplete for fleet audit.

### Request B — fleet in-progress renders

**New endpoint (recommended):**

```http
GET /api/render/admin/in-progress
```

(or extend existing render telemetry / operational audit route if preferred)

**Response shape (proposal):**

```ts
type RenderInProgressRow = {
  renderId: number;
  renderName: string | null;
  processing: boolean;
  complete: boolean;
  startedAt: string | null;
  schedulerId: number;
  schedulerName: string | null;
  accountId: number;
  accountName: string | null;
  accountType: "association" | "club" | string;
  scheduledTime: string | null; // scheduler slot if relevant
};

type RenderInProgressResponse = {
  data: {
    activeCount: number;
    rows: RenderInProgressRow[];
  };
};
```

Rules:

- Include all renders where `processing === true` and `complete !== true` (define exact CMS truth).
- No pagination cap for v1 (expected low cardinality; if high, add `?limit=` with default 500).
- Sort by `startedAt` ascending (oldest / worst first).

Admin will prefer this over today-only scheduler rollup for fleet stuck lists once available.

---

## Problem 3 — Account lookup enrichment

**Endpoint:** `GET /api/account/admin/lookup` (existing)

Add optional fields on each account row (denormalized from account + latest health + scheduler state):

```ts
accountHealthStatus: AccountHealthAccountStatus;
accountHealthLastStartedAt: string | null;
accountHealthLastCompletedAt: string | null;
accountHealthFailureReason: string | null;
isSchedulerRendering: boolean;
renderProcessingSince: string | null; // if a render is processing
```

Admin will use these for **directory table columns** and filters without N+1 per-account health calls.

Until shipped, admin derives flags client-side from global health + today’s renders only (incomplete).

---

## Request D — Render stuck operator action (optional, phase 2)

Admin needs a **support-safe** way to clear stale `processing` / `isRendering` when a render will never complete (e.g. 157h outlier).

Proposal:

```http
POST /api/render/:renderId/abort
Content-Type: application/json

{ "reason": "operator_aborted", "resetSchedulerFlags": true }
```

Semantics (to confirm with worker team):

- Mark render failed or complete-with-error (define canonical status).
- Clear scheduler `isRendering` / queue flags if stuck.
- Idempotent; restricted to admin/support roles.

If this already exists under another path, document it in reply — admin will wire buttons on fleet lists.

Account-health **abort / reconcile / resume** already documented in `.comms/account-health-status-admin-handoff.md` — no change required for sync ops.

---

## Auth & permissions

Follow existing Account / Render admin permission patterns. Document new permission keys if added, e.g.:

```text
api::account.account.getAccountHealthGlobalStatus  (extend response)
api::render.render.getRenderInProgress            (new)
api::render.render.postRenderAbort                (new, if implemented)
```

---

## Acceptance criteria (CMS)

1. `activeRuns.length` equals count of non-terminal runs included in `activeCount`.
2. A run active 60+ hours appears in `activeRuns` even when absent from `latestRuns`.
3. Fleet in-progress renders returns a 157h+ processing row with correct `accountId` / `renderId`.
4. Account lookup returns health + rendering flags for at least active accounts.
5. Smoke test: manual trigger health run + one stuck render visible in both new payloads.

---

## Admin rollout (after CMS deploy)

1. Types + fetchers for `activeRuns` and in-progress renders.
2. Replace `hiddenActiveCount` workaround with `activeRuns` merge.
3. Switch stuck rendering lists from today-only to in-progress endpoint.
4. Enable lookup columns when fields present.

---

## Contact / references

- Admin operator playbook: `src/app/dashboard/.docs/fleet-ops-playbook.md`
- Prior partial request: `.comms/account-health-global-active-runs-request.md` (superseded by this doc)
