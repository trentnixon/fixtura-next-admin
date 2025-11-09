# Development Roadmap – Competition Drilldown

## ✅ Completed

- [x] Document current drilldown page structure and align with admin detail requirements (see TKT-2025-011)
- [x] Design CMS-powered drilldown data flow (types, service, hook) for `GET /api/competition/admin/:competitionId` (see TKT-2025-011)
- [x] Implement full drilldown UI (meta header, analytics, tables, insights) using the new endpoint (see TKT-2025-011)

## ⏳ To Do (easy → hard)

1. [ ] Capture load/performance metrics for large competitions and plan pagination if required
2. [ ] Add Storybook/visual regression coverage for drilldown widgets

## 💡 Recommendations

- Reuse newly built competitions dashboard widgets where practical to maintain visual parity
- Plan for pagination/virtualization strategies if team/club lists become large
- Coordinate with backend on handling inactive competitions and large media payloads
