# Development Roadmap – Budget (Rollups Integration)

## ✅ Completed
- [x] Define rollup TypeScript types and response envelopes
- [x] Implement services for Render, Account, Period, and Global rollups
- [x] Implement TanStack Query hooks for all rollup services
- [x] Create initial Budget components: Global summary, Trends chart, Top accounts
- [x] Integrate components into `page.tsx`

## ⏳ To Do (easy → hard)
1. [ ] Add Account cost widgets (current month, monthly range)
   * (see TKT-2025-011 Phase 4)
2. [ ] Add Render cost breakdown widget
   * (see TKT-2025-011 Phase 4)
3. [ ] Filters & Controls (granularity, date range, period presets)
   * (see TKT-2025-011 Phase 5)
4. [ ] Charting implementation (swap placeholder for actual chart lib)
   * (see TKT-2025-011 Phase 5)
5. [ ] QA & performance tuning (staleTime/refetch, pagination, virtualization)
   * (see TKT-2025-011 Phase 6)

## 💡 Recommendations
- Use cohesive query keys to optimize caching and background refetches
- Consider memoized selectors for large trend datasets
- Validate API auth and rate limits; add graceful error fallbacks
- Align UI metrics with business definitions (e.g., “total cost” includes AI + Lambda)



