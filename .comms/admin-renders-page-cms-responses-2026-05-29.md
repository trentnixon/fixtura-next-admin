# CMS responses — Admin `/dashboard/renders` integration

**Date:** 2026-05-29  
**From:** fixtura-admin  
**To:** CMS / Strapi backend  
**Re:** Confirmed behaviour for Global Render Monitor + account asset runs

## Summary

Admin v1 for `/dashboard/renders` uses **existing routes only**. Mock fallbacks were removed from analytics and distribution services. This document archives CMS-confirmed behaviour and optional follow-up field additions.

## Confirmed API behaviour

### Render routes

| Route | Behaviour |
|-------|-----------|
| `GET /renders/telemetry` | `activeCount` = `Processing` only; `failedToday` = published today, incomplete, not processing; `successRate24h` = complete / published last 24h; status thresholds per CMS |
| `GET /renders/audit` | One row per render; `pageSize` 25; `publishedAt desc`; `isGhostRender` server-side |
| `GET /renders/analytics?period=` | `day` = daily / 30d; `week` = ISO / 12w; `month` = monthly / 12mo; empty `data: []` valid |
| `GET /renders/distribution` | Leaderboard 12 months; asset mix all time; articles-only mix valid |

### Account asset runs

| Route | Behaviour |
|-------|-----------|
| `GET /account-asset-runs/status?limit=` | Slim rows; `createdAt desc`; no `accountName` / `accountType` / `startedAt` today |
| `renderId` | Set when run discovers or has render — not immediate for all modes |

## Admin changes shipped (v1)

- Removed mock fallbacks in `fetchRenderAnalytics` / `fetchRenderDistribution`
- Per-render audit table with ghost badge
- Asset runs on Render Snapshot with client rollup (last 25 runs)
- Analytics empty states and period window copy
- Distribution footnotes (12mo vs all time)
- Removed duplicate Accounts tab on renders page

## Optional CMS follow-ups (P1)

Not blocking v1.

1. **`GET /account-asset-runs/status`** — add `accountName`, `accountType` (and optionally `startedAt`) to slim rows for Admin navigation.
2. **`GET /renders/audit`** — add nullable `accountAssetRunId` per row **or** provide `GET /account-asset-runs/by-render/:renderId` for reverse lookup.

## Optional CMS follow-ups (P2)

- Global asset-run metrics on `GET /renders/telemetry` or new `GET /account-asset-runs/metrics`
- Audit query params: `accountId`, `ghostOnly`, `Processing`, date range
- Explicit `limit` cap on `/account-asset-runs/status`

## References (CMS codebase)

- `src/api/render/routes/custom-render.js`
- `src/api/account-asset-run/routes/custom-account-asset-run.js`
- Render controllers: audit, telemetry, analytics, distribution
- `.comms/account-asset-run-on-demand-trigger-handoff.md` (Admin)
