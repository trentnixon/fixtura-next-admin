# Global Render Monitoring (.docs)

This folder contains the documentation and strategy for the Global Render Monitor page (`/dashboard/renders`). This page aims to provide a high-level operational overview of all rendering activity within the Fixtura system.

## Strategy

The Global Render Monitor is designed for system administrators to track heavy rendering loads, identify failures across multiple accounts, and ensure the system queue is processing correctly.

### Key Objectives
1. **Visibility**: Real-time tracking of what is rendering, what is queued, and what has recently completed.
2. **Identification**: Quickly find renders that have stalled or failed.
3. **Audit**: Trace the lineage of assets back to specific render IDs across any scheduler.

## Page Infrastructure

- **Path**: `/dashboard/renders/page.tsx`
- **Tabs**: Render Snapshot | Analytics | Operational Audit (Accounts tab removed — leaderboard lives on Snapshot only)
- **Main Components**:
    - `GlobalRenderRollup`: Live headline render metrics. `useRenderTelemetry` → `GET /renders/telemetry`
    - `AssetRunSnapshotSection`: Rollup (last 25 runs) + table. `useAccountAssetRunGlobalStatus` → `GET /account-asset-runs/status`
    - `RenderResourceLeaders`: Leaderboard (12 months) + asset mix (all time). `useRenderDistribution` — no mock fallback
    - `RenderAnalyticsDashboard`: Time-series charts. `useRenderAnalytics` — empty `data: []` shows EmptyState
    - `GlobalRenderTable`: One row per render, ghost badge. `useRenderAudit` → `GET /renders/audit`
- **Shared**: `GlobalAccountAssetRunTable` (also used on home dashboard Renders tab)
- **CMS comms**: `.comms/admin-renders-page-cms-responses-2026-05-29.md`

## API & Data Infrastructure
The dashboard utilizes a specialized multi-route architecture to balance real-time performance with deep analytical insights:

- [**Route A: Operational Audit**](./api/route-a-operational-audit.md) - Master data synchronization for the audit table.
- [**Route B: Live Telemetry**](./api/route-b-live-telemetry.md) - High-frequency polling for system health.
- [**Route C: Analytical Aggregations**](./api/route-c-analytical-aggregations.md) - Time-series data for trend visualization.
- [**Route D: Resource Leaders**](./api/route-d-resource-leaders.md) - Account-level ROI and product mix analysis.
- [**Route E: Individual Lineage**](./api/route-e-individual-lineage.md) - Deep "DNA" audit for troubleshooting specific renders.

## Advanced Troubleshooting
For technical disputes (e.g., "Why is my video missing?"), the system provides an **Integrity Audit** tool within the individual render view (`/dashboard/renders/[renderID]`). This tool performs a full relational expansion to detect discrepancies between scheduler expectations and actual render output.

## Data Schema Mapping
Based on the `attributes` provided by the CMS:
- **Status Indicators**: `Processing` (live), `Complete` (finalized), `EmailSent` (delivered).
- **Output Audit**: `downloads` (video/image assets), `ai_articles` (content assets).
- **Source Context**: `scheduler.account` (to see WHO the render is for).
- **Metadata**: `upcoming_games...`, `game_results...`, `grades...` (to see WHAT was processed).
