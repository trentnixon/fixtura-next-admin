# Admin Reply - Render Activity Endpoint Clarifications

**Date:** 2026-06-02  
**From:** fixtura-admin  
**To:** CMS / Strapi backend  
**Re:** Clarifications for `GET /api/account-asset-runs/render-activity`

## Short Reply

Please implement `GET /api/account-asset-runs/render-activity` on the existing account-asset-run service. For v1, keep it read-only, default to the last 48 hours, use page/pageSize pagination, and return asset-run rows joined to account, scheduler, render status, and render relation counts.

## Remaining Questions - Admin Decisions

### P0 - Blocks Correct Behavior

| Question | Admin decision |
|----------|----------------|
| `status=running` semantics | Treat `running` as all in-progress/non-terminal statuses: `pending`, `queued`, `running`, `scraping_results`, `checking_upcoming_fixtures`, `creating_assets`. |
| Pagination model | Use `page` + `pageSize` for v1. If `limit` is also sent, `page/pageSize` wins. If only `limit` is sent, CMS may treat it as `pageSize` for page 1. |
| Hard cap | `pageSize` hard cap `500` is OK for v1, including 7d views. Larger export-style reporting can come later. |
| `meta.total` | Count of all rows matching filters in the window before pagination/cap. |
| Default 48h timezone | UTC rolling 48 hours, not Sydney calendar days. Admin can send explicit UTC `from`/`to` for custom ranges. |
| Inclusive `to` | Yes. Include rows whose resolved start timestamp equals `to`. |

### P1 - Avoids Wrong Dashboard Data

| Question | Admin decision |
|----------|----------------|
| Scheduled `runKey` example | Illustrative only. Production scheduled keys may be `account-asset-run:{accountId}:{schedulerId}:{dateKey}`. Do not require `:scheduled:full:{epoch}` segments. |
| Missing `trigger` / `mode` | Default missing scheduled/cron values to `trigger: "scheduled"` and `mode: "full"`. For on-demand, use `summary.trigger` / `summary.mode`, with `ondemand` in `runKey` as fallback. |
| "Started" column | Use resolved run start: `startedAt`, then parsed `runKey` epoch, then `createdAt`. Do not use `scheduledFor` as the displayed start for this report. Queue-time `startedAt` is acceptable for v1. |
| Default status set | Include all statuses by default, including `pending`, `queued`, and `cancelled`. |
| Read-only list | Yes. `render-activity` must be read-only and must not call `advanceAccountAssetRun` or reconcile/mutate active runs. |

### P2 - Implementation Detail

| Question | Admin decision |
|----------|----------------|
| `account.name` | Use health-style display resolution: account name, org/club/association label, first/last name, fallback `Account {id}`. |
| `account.type` | Prefer normalized keys (`club`, `association`, etc.) for Admin routing. Display string is acceptable if normalized key is not readily available. |
| `account.sport` | Use `account.Sport`. |
| `scheduler.name` | Use `scheduler.Name`. |
| Render counts | DB counts per relation are OK. `totalItems` is the sum of the five v1 buckets only: downloads, AI articles, game results, upcoming games, grades. |
| Published rows | Match existing Admin render audit semantics. If render audit counts published/visible rows only, use the same rule here. |
| `render: null` | Use stored relation only. Do not attempt render discovery on the list endpoint. |
| `includeItems=true` | Same scopes/statuses as `GET /api/account-asset-runs/:id/status`. Return slim rows by scope/status; no full payloads. Per-scope `durationMs` is useful but may be `null` in v1 if timestamps are missing. |
| In-flight `durationMs` | CMS may compute `now - start` for active rows. If it does not, return `null` and Admin can compute from `startedAt`. If no resolved start exists, return `null`. |
| Cancelled rows | Include cancelled rows. If `cancelledAt` exists, use it as `finishedAt` and duration end. If not available, return `finishedAt: null` and `durationMs: null`. |
| Scope | Asset runs only. Do not include account-health runs. Do not exclude test/debug accounts unless CMS already has a standard Admin-report exclusion rule. |

### CMS Note

Register `/render-activity` before `/:id/status` so `render-activity` is not parsed as an id.

## Decisions

### 1. Auth and exposure

Use the same auth model as the existing account-asset-run custom routes for v1.

Admin already sends `Authorization: Bearer ${APP_API_KEY}` via the shared axios instance when `APP_API_KEY` is configured. If CMS is ready to enforce API-key auth on this new report route, that is preferred, but do not block the endpoint on a broader auth refactor.

### 2. Time window and timezone

Use UTC ISO timestamps for `from` and `to`.

Default:

```text
from = now - 48h
to = now
```

Treat `to` as inclusive for v1.

For legacy rows where `startedAt` is null, use this fallback order:

1. parse epoch ms suffix from `runKey` when present
2. `createdAt`

For the dashboard "Started" column, use the resolved run start timestamp above. Do not use `scheduledFor` as the primary started value.

### 3. Status filter semantics

`status=running` should mean all active, non-terminal workflow states:

```text
pending, queued, running, scraping_results, checking_upcoming_fixtures, creating_assets
```

Default `all` should include every status, including `cancelled`.

Pending and queued rows should appear in the default activity report because they are useful for operations. Admin can filter them out client-side or request `status=completed,failed` if needed.

### 4. Mode and trigger

For scheduled/cron rows where `summary.mode` or `summary.trigger` is missing:

```ts
trigger = "scheduled"
mode = "full"
```

The example runKey with `:scheduled:full:` was illustrative. Production legacy scheduled keys may be simpler, so please do not require those segments to exist.

### 5. Duration and finish times

Use:

```text
completed: completedAt - resolvedStartedAt
failed: failedAt - resolvedStartedAt
cancelled: cancelledAt - resolvedStartedAt, if cancelledAt exists
active: now - resolvedStartedAt
```

If CMS does not expose `cancelledAt`, return `finishedAt: null` and `durationMs: null` for cancelled rows unless another reliable terminal timestamp exists.

If no resolved start timestamp exists, return `durationMs: null`.

Please include a normalized `finishedAt` field in addition to `completedAt` / `failedAt` if practical. Admin can then render one finish column without repeating terminal-state logic.

### 6. Pagination and meta.total

Use page/pageSize as the canonical v1 model.

Defaults:

```text
page = 1
pageSize = 100
max pageSize = 500
```

`meta.total` should mean the count of all rows matching the filters before pagination. If computing an exact total is too expensive for the resolved timestamp fallback, return the best exact count CMS can support and include `meta.totalIsEstimated: true` only if needed.

### 7. Account and scheduler display fields

For account names, reuse the same resolution approach as account health/global status.

Return:

```ts
account.name // human display label
account.type // normalized key if available: "club" | "association" | etc.
account.sport // account.Sport
scheduler.name // scheduler.Name
```

If only the display account type name is easy to return, that is acceptable for v1, but normalized keys are better for Admin links later.

### 8. Render object and counts

Please normalize render fields to camelCase in this custom response:

```text
Name -> name
Processing -> processing
Complete -> complete
EmailSent -> emailSent
```

Counts can be DB counts per relation. Full relation population is not required.

Count these buckets:

- downloads
- aiArticles
- gameResults
- upcomingGames
- grades

For v1, `totalItems` should be the strict sum of those five buckets.

Count only the records CMS considers visible/valid for the render in existing Admin render audit semantics. If that means published-only for draftAndPublish collections, use published-only.

If `render` is null, do not attempt expensive discovery in this list endpoint. Return `render: null`; Admin will show "Render pending" and link to the run detail.

### 9. `includeItems=true`

Use the same item scopes and statuses as `GET /api/account-asset-runs/:id/status`.

`includeItems=true` is optional for v1 and should be false by default.

When true, return slim item summary and per-scope rows. Item-level `durationMs` is useful but can be `null` until item timestamps are available. No full payloads are needed.

If a run has many item rows, a slim list is still acceptable because current account asset runs have a small fixed set of orchestration scopes.

### 10. Read model behavior

The report endpoint should be read-only.

Do not call `advanceAccountAssetRun`, reconcile active runs, or mutate state during this list request. Admin will continue using detail polling for per-run progression.

### 11. Scope

This dashboard report is for account asset runs only.

Do not mix in account-health runs. No test/debug exclusion is needed for v1 unless CMS already has an established "exclude test accounts" rule for Admin reports.

### 12. Performance guardrails

`includeItems=false` should be the default for dashboard loads.

`pageSize=500` is enough for v1. If Admin later needs large 7-day or export workflows, we can add CSV/export or cursor pagination separately.

Avoid N+1 fetches. Prefer server-side joins/populates and relation counts.

## Preferred v1 Response Additions

The original contract is still good. These additions would make Admin rendering simpler:

```ts
run: {
  startedAt: string | null;
  finishedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  durationMs: number | null;
}
```

`finishedAt` should be:

```text
completedAt || failedAt || cancelledAt || null
```

## Admin Integration Plan

Once CMS ships this endpoint, Admin will add:

- service: `fetchAccountAssetRunRenderActivity`
- hook: `useAccountAssetRunRenderActivity`
- dashboard component for the `/dashboard` Renders tab
- time-window controls for 24h / 48h / 7d / custom
- table columns: Org, Started, Finished, Time taken, Status, Render items, Render link, Run link
