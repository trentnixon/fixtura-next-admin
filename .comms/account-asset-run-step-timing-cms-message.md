# Account asset run — step timing (CMS message)

**Date:** 2026-05-30  
**From:** fixtura-admin  
**To:** CMS / Strapi team  
**Re:** Per-step timing on asset run status responses

---

## Copy-paste message

> **Subject:** Asset run status API — need per-step timestamps on `items[]`
>
> Admin now shows **Start**, **End**, and **Time taken** for each phase on the asset run detail page (`/dashboard/accounts/asset-runs/[runId]`).
>
> **Run-level timing works** — `startedAt`, `completedAt`, and total duration are correct.
>
> **Step-level timing does not** — each item in `items[]` comes back with `status` but without `startedAt` / `completedAt` / `failedAt`, so Admin cannot show accurate phase durations.
>
> Example: run **#28** (account **574**) shows total time **1h 11m** correctly, but incorrectly assigns that entire duration to the last step (*Asset completion*) and shows **0s** for *Asset creation*.
>
> **We need:** each `account-asset-run-item` in `GET /api/account-asset-runs/:id/status` and `GET .../account/:id/latest` to include `startedAt`, `completedAt`, and `failedAt` — same as account health items.
>
> **Likely fix:** set those fields when item status transitions (same pattern as account health), and include them in the status serializer response. No Admin change required once populated.
>
> See below for detail.

---

## What Admin is doing

On the asset run detail page we display:

1. **Run timeline** — run `startedAt`, `scheduledFor`, `completedAt`, `failedAt`, and **total time**
2. **Steps table** — for each workflow phase (`eligibility_check` → `asset_completion`):
   - **Start**
   - **End**
   - **Time taken**
   - Status, target, result summary

We poll `GET /api/account-asset-runs/:id/status` every 12 seconds while a run is active.

This mirrors the account **health** run detail page, which already works because health items include step timestamps.

---

## What we need from CMS

Each object in `items[]` on these endpoints:

```http
GET /api/account-asset-runs/:id/status
GET /api/account-asset-runs/account/:accountId/latest
```

Must include:

```ts
startedAt: string | null;   // ISO8601 UTC
completedAt: string | null; // ISO8601 UTC
failedAt: string | null;    // ISO8601 UTC
```

**When to set them** (same semantics as account health):

| Item transition | Set |
|-----------------|-----|
| Step begins (`queued` / `running`) | `startedAt` once |
| Step succeeds (`completed`) | `completedAt` |
| Step fails (`failed`) | `failedAt` |
| Step skipped (`skipped`) | leave null |

Timestamps must be **per step**, not copied from the parent run's `startedAt` / `completedAt`.

---

## What we think is missing

Based on run **#28** (club account **574**, `full` on-demand mode):

| Field | Run envelope | Each item in `items[]` |
|-------|--------------|--------------------------|
| `startedAt` | ✅ present | ❌ missing / null |
| `completedAt` | ✅ present | ❌ missing / null |
| `failedAt` | ✅ present | ❌ missing / null |
| `status` | ✅ | ✅ |

Because item timestamps are absent, Admin tried fallbacks (run boundaries, bull job id suffixes). Those produce **wrong** results:

| Step | What Admin showed | Why it is wrong |
|------|-------------------|-----------------|
| Eligibility check | Start 20:48 (estimated) | Only run `startedAt` available |
| Grades / result / remove scrape | mostly `—` | No step data |
| Asset creation | 0s | Bull id enqueue time ≈ run start, not step duration |
| Asset completion | 1h 11m (estimated) | Entire run duration assigned to last step |

**Our assumption:** either the fields are not stored on `account-asset-run-item`, or they are stored but **not serialized** in the status response. Account health already solves this — asset runs should follow the same pattern.

---

## Proposed fix (CMS)

### 1. Persist step timestamps on the item entity

If not already on the content type, add:

- `startedAt`
- `completedAt`
- `failedAt`

### 2. Set them in the orchestration layer

In the same code that updates item `status`, set timestamps on transition — mirror account health item lifecycle handling.

### 3. Expose them in the status API

Ensure the serializer for `GET .../:id/status` and `GET .../latest` returns these three fields on **every** item in `items[]`.

### 4. Optional — enrich `resultSummary` for scrape steps

Not required if item timestamps exist, but helpful for debugging:

```json
{
  "durationMs": 2728000,
  "durationFormatted": "45m 28s"
}
```

Admin treats **item-level timestamps as source of truth**; `resultSummary` is a fallback only.

### Likely CMS files

```text
src/api/account-asset-run/controllers/account-asset-run.js
src/api/account/controllers/services/accountAssetRuns/index.js
src/api/account-asset-run/content-types/account-asset-run-item/   (schema)
```

Reference: account health item timing in `.comms/account-health-status-admin-handoff.md` (`AccountHealthItem`).

---

## What Admin will do after CMS ships

- Read `startedAt` / `completedAt` / `failedAt` directly from each item
- Compute **Time taken** as end − start (same as health runs)
- Remove or hide estimated `(est.)` fallback timings

No further Admin API contract changes expected.

---

## How to verify

1. Run a `full` on-demand asset run.
2. `GET /api/account-asset-runs/{runId}/status` when `status === "completed"`.
3. Confirm each non-skipped item has populated `startedAt` and `completedAt`.
4. Open Admin: `/dashboard/accounts/asset-runs/{runId}?accountId=…&accountType=club`
5. Step times should sum roughly to run total time, with no single step owning the full duration unless it genuinely took that long.

---

## Example — what a correct item should look like

```json
{
  "id": 103,
  "scope": "result_batch_scrape",
  "status": "completed",
  "targetType": "account",
  "targetId": 574,
  "startedAt": "2026-05-29T10:50:12.000Z",
  "completedAt": "2026-05-29T11:35:40.000Z",
  "failedAt": null,
  "failureReason": null,
  "resultSummary": { }
}
```

Admin would display **Time taken: ~45m 28s** for that step.

---

## Related docs

- `.comms/account-asset-run-on-demand-trigger-handoff.md` — trigger + status endpoints
- `.comms/account-health-status-admin-handoff.md` — working reference for item timestamps
