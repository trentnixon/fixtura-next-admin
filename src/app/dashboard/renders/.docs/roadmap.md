# Development Roadmap: Global Render Monitor

## Phase 1: Foundation & Navigation
- [ ] **Infrastructure Setup**: Create `useGlobalRenders` query hook for fetching the broad list of renders.
- [ ] **API Deep Population**: Ensure the endpoint populates `scheduler.account` and `downloads` at the top level for the list view.
- [ ] **Base Table**: Implement the `GlobalRenderTable` using the standardized `variant="primary"` action buttons.

## Phase 2: Visibility & Telemetry
- [ ] **Headline Stats**: Add `GlobalRenderRollup` cards showing:
    - Active Renders (Live)
    - Failures in the last 24h
    - Success Rate (Lifetime)
- [ ] **Content Counts**: Display "Assets Generated" and "AI Articles" columns in the main table to show ROI per render.

## Phase 3: Advanced Operations
- [ ] **Universal Filter**: Add a multi-select filter for Sport (Cricket, AFL, Netball) and Status (Live, Success, Failed, Stalled).
- [ ] **Search System**: Implement a search bar that targets Render Names and Account Names.
- [ ] **Stalled Guard**: Highlight renders that have been `Processing: true` for longer than 30 minutes without completion.

## Phase 4: Bulk Actions & Troubleshooting
- [ ] **Bulk Rerender**: Allow selecting multiple rows to trigger `forceRerender: true` on the CMS entries (via PATCH).
- [ ] **Performance Heatmap**: Integrate a chart showing when the system is under the most render stress during the week.

## Phase 5: Deep Analytics & Visualization
- [ ] **Throughput Dashboard**: Implement the `System Throughput` area charts (Week/Month).
- [ ] **Asset Mix Analytics**: Build the multi-line chart for Avg Assets and Asset Type distribution.
- [ ] **Leaderboards**: Create the "Large Accounts by Asset Type" horizontal bar charts.
- [ ] **Efficiency Tracking**: Visualization of Complexity Score vs. Render Time.
