# Folder Overview

This folder handles budget and costings analysis for global render costs.

## Files

- `page.tsx`: Budget & costings dashboard page integrating summary, trends, and top accounts
- `components/GlobalCostSummary.tsx`: Displays global cost summary (current month)
- `components/PeriodTrendsChart.tsx`: Displays cost trends over time (daily/weekly/monthly)
- `components/TopAccountsList.tsx`: Displays top accounts by cost
- `Tickets.md`: Ticket planning and phased tasks for this feature
- `DevelopmentRoadMap.md`: High-level progress, priorities, and recommendations

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation
- Key dependencies: Rollup services, analytics services

## Dependencies

- Internal: `../../hooks/rollups/` hooks; `../../lib/services/rollups/` services
- External: CMS API for cost data (rollup endpoints)
