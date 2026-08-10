# Development Roadmap – Competition Drilldown

## ✅ Completed

- [x] Document current drilldown page structure and align with admin detail requirements (see TKT-2025-011)
- [x] Design CMS-powered drilldown data flow (types, service, hook) for `GET /api/competition/admin/:competitionId` (see TKT-2025-011)
- [x] Implement full drilldown UI (meta header, analytics, tables, insights) using the new endpoint (see TKT-2025-011)
- [x] Add "Scrape Grades" button to trigger single-competition grades scrape via `POST /api/competition/trigger-grades-comps-single-scrape` (see `.comms/admin-frontend-trigger-grades-comps-single-integration.md`)
- [x] Add "Lookup Grade Teams" button on competitions list page (`/dashboard/competitions/`) to trigger grade-teams scrape via `POST /api/grade-teams/trigger-grades-lookup-teams-scrape` (see `.comms/admin-frontend-trigger-grades-lookup-teams-integration.md`)
- [x] Add "Scrape Teams" button on competition detail page to trigger single-competition grades-teams scrape via `POST /api/competition/trigger-grades-lookup-teams-single-scrape` (see `.comms/admin-frontend-trigger-grades-lookup-teams-single-integration.md`)
- [x] Add batch result scrape for grade and competition scope via `POST /api/game-meta-data/trigger-result-batch-scrape` (`TKT-2026-053`, see [`../../.comms/admin-frontend-trigger-result-batch-scrape-integration.md`](../../.comms/admin-frontend-trigger-result-batch-scrape-integration.md))

## ⏳ To Do (easy → hard)

1. [ ] Capture load/performance metrics for large competitions and plan pagination if required
2. [ ] Add Storybook/visual regression coverage for drilldown widgets

## 💡 Recommendations

- Reuse newly built competitions dashboard widgets where practical to maintain visual parity
- Plan for pagination/virtualization strategies if team/club lists become large
- Coordinate with backend on handling inactive competitions and large media payloads
