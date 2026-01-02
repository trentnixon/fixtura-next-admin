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
- **Main Components**:
    - `GlobalRenderRollup`: Live headline metrics (Active, Failures, Success Rate). Powered by `useRenderTelemetry`.
    - `RenderAnalyticsDashboard`: Historical throughput and asset mix trends. Powered by `useRenderAnalytics`.
    - `RenderResourceLeaders`: High-volume account leaderboards and global asset distribution. Powered by `useRenderDistribution`.
    - `GlobalRenderTable`: The master operational audit list. Powered by `useRenderAudit`.

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
