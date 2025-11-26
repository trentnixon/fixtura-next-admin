# Development Roadmap – Club Data

## ✅ Completed

- [x] Placeholder page scaffolded
- [x] Data infrastructure implemented (service, hook, types) - TKT-2025-022 Phase 1
- [x] Club Admin Insights API endpoint integrated (`GET /api/club/admin/insights`)

## ⏳ To Do (easy → hard)

1. [ ] Create Club Gantt chart component - TKT-2025-023 Phase 2
2. [ ] Create core UI components (SportFilter, DataWrapper, OverviewStatsCard) - TKT-2025-022 Phase 2
3. [ ] Create distribution and insights components (DistributionsCard, TeamsInsightsCard, AccountsInsightsCard, CompetitionTimelineCard) - TKT-2025-022 Phase 2
4. [ ] Create ClubsTable component with client-side pagination/virtual scrolling - TKT-2025-022 Phase 2
5. [ ] Integrate all components into page layout - TKT-2025-022 Phase 3
6. [ ] Performance optimization for large datasets (7,000+ clubs) - TKT-2025-022 Phase 4
7. [ ] QA and testing - TKT-2025-022 Phase 5

## 💡 Recommendations

- Reuse patterns from association insights page (`/dashboard/association`) where applicable
- Implement virtual scrolling or client-side pagination for ClubsTable (API returns all clubs, can be 7,000+)
- Link to single club detail page (`/dashboard/club/[id]`) from clubs table
- Consider adding search/filter functionality within ClubsTable for better UX
- Sport filter is required (unlike association insights) - make this clear in UI
- Handle null `activeAccounts` field gracefully in AccountsInsightsCard
