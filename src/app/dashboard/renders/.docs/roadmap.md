# Development Roadmap: Global Render Monitor

## Phase 1: Foundation & Navigation (COMPLETED)
- [x] **Infrastructure Setup**: Create specialized hooks (`useRenderAudit`, `useRenderTelemetry`) for fetching render data.
- [x] **API Deep Population**: Implemented custom Strapi routes (Routes A-E) to handle complex populations efficiently.
- [x] **Base Table**: Implemented the `GlobalRenderTable` with standardized action buttons and status mapping.

## Phase 2: Visibility & Telemetry (COMPLETED)
- [x] **Headline Stats**: Added `GlobalRenderRollup` cards showing Active Renders (Live) and 24h failure metrics.
- [x] **Content Counts**: Integrated "Assets" and "AI" columns in operational tables to track ROI per session.

## Phase 3: Advanced Operations (IN PROGRESS)
- [ ] **Universal Filter**: Add a multi-select filter for Sport (Cricket, AFL, Netball) and Status (Live, Success, Failed, Stalled).
- [ ] **Search System**: Implement a search bar that targets Render Names and Account Names.
- [ ] **Stalled Guard**: Highlight renders that have been `Processing: true` for longer than 30 minutes without completion.

## Phase 4: Custom Diagnostics (COMPLETED)
- [x] **Deep DNA Audit**: Implemented the `Integrity Audit` tool for individual renders to verify fixture coverage.
- [x] **Ghost Render Detection**: Added logic to flag renders marked complete but containing zero assets.

## Phase 5: Deep Analytics & Visualization (COMPLETED)
- [x] **Throughput Dashboard**: Implemented `System Throughput` area charts for trend analysis.
- [x] **Asset Mix Analytics**: Built the `ComposedChart` for tracking asset density and production efficiency.
- [x] **Leaderboards**: Created the `Account Leaderboard` to identify heavy system consumers.

## Phase 6: Maintenance & Performance
- [ ] **Bulk Rerender**: Allow selecting multiple rows to trigger `forceRerender: true` on the CMS entries (via PATCH).
- [ ] **Polling Optimization**: Fine-tune telemetry polling intervals based on system load.
