# Development Roadmap – Association Drilldown

## ✅ Completed

- [x] Audit current `DisplayAssociation` tabs and determine placement for association competitions drilldown (see TKT-2025-012)
- [x] Model CMS association drilldown types, service, and hook for `GET /api/competition/admin/:associationId/associations` (see TKT-2025-012)
- [x] Implement association competitions UI (summary + competitions list with nested grades/clubs) integrated into the account view (see TKT-2025-012)

## ⏳ To Do (easy → hard)

1. [ ] Evaluate payload size/performance and consider lazy loading or pagination for large associations
2. [ ] Add Storybook or visual regression coverage for the association competitions components

## 💡 Recommendations

- Reuse competition dashboard/drilldown components where practicable to maintain consistency
- Consider lazy-loading heavy competition data within the tab to reduce initial page load
- Coordinate with backend on pagination or filtering once association payload sizes are validated
