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
- **Hook**: `useGlobalRenders` (To be created) - Fetches a paginated list of all renders with account/scheduler distribution.
- **Components**:
    - `GlobalRenderRollup`: Top-level stats (Active, Failed today, Avg time).
    - `GlobalRenderFilter`: Advanced filtering by Sport, Organization, and Status.
    - `GlobalRenderTable`: The master list of all recent renders.

## API Infrastructure
To ensure performance, data fetching is split into specialized routes documented in the `api/` directory:

- [**Route A: Operational Audit**](./api/route-a-operational-audit.md) - The master list and table view.
- [**Route B: Live Telemetry**](./api/route-b-live-telemetry.md) - Real-time headline stats.
- [**Route C: Analytical Aggregations**](./api/route-c-analytical-aggregations.md) - Pre-computed charts.
- [**Route D: Resource Leaders**](./api/route-d-resource-leaders.md) - Leaderboards and distribution.
- [**Route E: Individual Lineage**](./api/route-e-individual-lineage.md) - Deep dive "DNA" audit.

## Data Schema Mapping
Based on the `attributes` provided by the CMS:
- **Status Indicators**: `Processing` (live), `Complete` (finalized), `EmailSent` (delivered).
- **Output Audit**: `downloads` (video/image assets), `ai_articles` (content assets).
- **Source Context**: `scheduler.account` (to see WHO the render is for).
- **Metadata**: `upcoming_games...`, `game_results...`, `grades...` (to see WHAT was processed).
