# Development Roadmap – Club Drilldown

## ✅ Completed

- [x] Audit `DisplayClub` tabs and confirm placement for club competitions drilldown (see TKT-2025-013)
- [x] Model CMS club drilldown types, service, and hook for `GET /api/competition/admin/:clubId/clubs` (see TKT-2025-013)
- [x] Implement club competitions UI (summary + competitions table) integrated into the account view (see TKT-2025-013)

## ⏳ To Do (easy → hard)

1. [ ] Monitor payload/performance for large clubs and plan pagination or virtualization if necessary
2. [ ] Add Storybook or snapshot coverage for club competitions drilldown components

## 💡 Recommendations

- Reuse shared competition components between association and club flows to minimize divergence
- Consider lazy-loading nested grade/team data in future enhancements
- Coordinate with backend on potential filters (active only, season) as needs evolve
