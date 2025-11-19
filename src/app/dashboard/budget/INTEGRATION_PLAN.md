# Rollup CMS Endpoints - Integration Plan

**Purpose**: Integrate rollup CMS endpoints into the budget route using established patterns (services, hooks, components, TanStack Query).

**Created**: 2025-01-15

---

## Overview

This plan outlines the integration of rollup CMS endpoints into the admin application's budget route. The integration follows existing patterns:

1. **Services** (`src/lib/services/rollups/`) - API calls using axiosInstance
2. **Hooks** (`src/hooks/rollups/`) - TanStack Query hooks wrapping services
3. **Types** (`src/types/rollups.ts`) - TypeScript type definitions
4. **Components** (`src/app/dashboard/budget/components/`) - UI components using hooks
5. **Page** (`src/app/dashboard/budget/page.tsx`) - Main budget page integrating components

---

## Architecture Pattern

```
Component → Hook (TanStack Query) → Service (axiosInstance) → CMS API
```

### Example Flow:

1. Component calls `useRenderRollup(renderId)`
2. Hook uses `fetchRenderRollup(renderId)` service
3. Service makes API call to `/api/rollups/render/:renderId`
4. Data flows back through hook to component
5. Component renders UI with loading/error states

---

## Implementation Phases

### Phase 1: Foundation (Types & Core Services) ✅ COMPLETED

**Goal**: Establish type system and core service functions

#### Tasks:

1. ✅ Create `src/types/rollups.ts` with all TypeScript interfaces

   - `RenderRollup`
   - `DailyRollup`
   - `WeeklyRollup`
   - `MonthlyRollup`
   - `GlobalCostSummary`
   - `GlobalCostTrends`
   - `TopAccount`
   - Response wrappers (`RollupResponse<T>`, `ErrorResponse`)
   - Breakdown types (`CostBreakdown`, `PerformanceMetrics`, etc.)

2. ✅ Create `src/lib/services/rollups/` folder structure
   - All service files created with graceful 404 handling
   - Standardized error handling across all services

**Status**: ✅ Completed

---

### Phase 2: Category 1 - Render Rollups ✅ COMPLETED

**Goal**: Implement render-specific rollup endpoints

#### Services to Create:

1. `fetchRenderRollupById.ts` - `GET /api/rollups/render/:renderId`
2. `fetchRenderRollupsBatch.ts` - `GET /api/rollups/render/batch?renderIds=1,2,3`
3. `fetchRenderRollupsByScheduler.ts` - `GET /api/rollups/render/scheduler/:schedulerId`

#### Hooks to Create:

1. `useRenderRollup.ts` - Hook for single render rollup
2. `useRenderRollupsBatch.ts` - Hook for batch render rollups
3. `useRenderRollupsByScheduler.ts` - Hook for scheduler render rollups

**Pattern Example**:

```typescript
// Service: fetchRenderRollupById.ts
export async function fetchRenderRollupById(
  renderId: number
): Promise<RollupResponse<RenderRollup>> {
  const response = await axiosInstance.get(`/api/rollups/render/${renderId}`);
  return response.data;
}

// Hook: useRenderRollup.ts
export function useRenderRollup(
  renderId: number | null
): UseQueryResult<RenderRollup, Error> {
  return useQuery({
    queryKey: ["rollups", "render", renderId],
    queryFn: () => fetchRenderRollupById(renderId!),
    enabled: !!renderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

**Status**: ✅ Completed

---

### Phase 3: Category 2 - Account Rollups ✅ COMPLETED

**Goal**: Implement account-specific rollup endpoints

#### Services to Create:

1. `fetchAccountCurrentMonthRollup.ts` - `GET /api/rollups/account/:accountId/current-month`
2. `fetchAccountMonthlyRollup.ts` - `GET /api/rollups/account/:accountId/month/:year/:month`
3. `fetchAccountMonthlyRollupsRange.ts` - `GET /api/rollups/account/:accountId/months?startYear&startMonth&endYear&endMonth`
4. `fetchAccountRollupsSummary.ts` - `GET /api/rollups/account/:accountId/summary`

#### Hooks to Create:

1. `useAccountCurrentMonthRollup.ts`
2. `useAccountMonthlyRollup.ts`
3. `useAccountMonthlyRollupsRange.ts`
4. `useAccountRollupsSummary.ts`

**Status**: ✅ Completed

---

### Phase 4: Category 3 - Period Rollups ✅ COMPLETED

**Goal**: Implement time-period rollup endpoints

#### Services to Create:

1. `fetchDailyRollup.ts` - `GET /api/rollups/daily/:date`
2. `fetchDailyRollupsRange.ts` - `GET /api/rollups/daily?startDate&endDate`
3. `fetchWeeklyRollup.ts` - `GET /api/rollups/weekly/:year/:week`
4. `fetchWeeklyRollupsRange.ts` - `GET /api/rollups/weekly?startYear&startWeek&endYear&endWeek`
5. `fetchMonthlyRollup.ts` - `GET /api/rollups/monthly/:year/:month`
6. `fetchMonthlyRollupsRange.ts` - `GET /api/rollups/monthly?startYear&startMonth&endYear&endMonth&global`

#### Hooks to Create:

1. `useDailyRollup.ts`
2. `useDailyRollupsRange.ts`
3. `useWeeklyRollup.ts`
4. `useWeeklyRollupsRange.ts`
5. `useMonthlyRollup.ts`
6. `useMonthlyRollupsRange.ts`

**Status**: ✅ Completed (with graceful 404 handling for endpoints not yet available)

---

### Phase 5: Category 4 - Global Analytics ✅ COMPLETED

**Goal**: Implement global analytics endpoints

#### Services to Create:

1. `fetchGlobalCostSummary.ts` - `GET /api/rollups/global/summary?period`
2. `fetchGlobalCostTrends.ts` - `GET /api/rollups/global/trends?granularity&startDate&endDate`
3. `fetchTopAccountsByCost.ts` - `GET /api/rollups/global/top-accounts?period&limit&sortBy`

#### Hooks to Create:

1. `useGlobalCostSummary.ts`
2. `useGlobalCostTrends.ts`
3. `useTopAccountsByCost.ts`

**Status**: ✅ Completed

---

### Phase 6: Components & UI ✅ COMPLETED

**Goal**: Create UI components for budget page

#### Components Created:

1. ✅ `GlobalCostSummary.tsx` - Display global cost summary card
2. ✅ `AccountCostWidget.tsx` - Display account cost information (current month)
3. ✅ `PeriodTrendsChart.tsx` - Display cost trends over time (daily/weekly/monthly)
4. ✅ `TopAccountsList.tsx` - Display top accounts by cost
5. ✅ `RenderCostBreakdown.tsx` - Display render cost details (tabbed interface)
6. ✅ `CostBreakdownChart.tsx` - Pie chart for Lambda vs AI breakdown
7. ✅ `PeriodComparison.tsx` - Period comparison widget (WoW/MoM)
8. ✅ `SchedulerCostTable.tsx` - Scheduler cost analysis table
9. ✅ `AccountMonthlyTrendChart.tsx` - Account monthly trend chart
10. ✅ `PeriodTable.tsx` - Switchable period rollup table
11. ✅ `AssetTypeBreakdown.tsx` - Asset type visualization
12. ✅ `ModelTokenAnalysis.tsx` - Model and token analysis
13. ✅ `EfficiencyMetrics.tsx` - Efficiency scatter plot and rankings
14. ✅ `PeakPeriodsChart.tsx` - Top 10 peak periods chart
15. ✅ `AccountShareChart.tsx` - Account share pie chart
16. ✅ `StackedCostTrendsChart.tsx` - Stacked cost trends (Lambda vs AI)
17. ✅ `PeriodControls.tsx` - Period and granularity selector
18. ✅ `FeatureIdeasGrid.tsx` - Roadmap feature ideas display

#### Component Pattern:

```typescript
"use client";

import { useGlobalCostSummary } from "@/hooks/rollups/useGlobalCostSummary";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";

export default function GlobalCostSummary() {
  const { data, isLoading, isError, error } =
    useGlobalCostSummary("current-month");

  if (isLoading) return <LoadingState message="Loading cost summary..." />;
  if (isError) return <ErrorState error={error} />;
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Cost Summary</CardTitle>
      </CardHeader>
      <CardContent>{/* Display data */}</CardContent>
    </Card>
  );
}
```

**Status**: ✅ Completed

---

### Phase 7: Budget Page Integration ✅ COMPLETED

**Goal**: Integrate all components into budget page

#### Tasks Completed:

1. ✅ Updated `src/app/dashboard/budget/page.tsx` with all rollup components
2. ✅ Created comprehensive layout with sections:
   - Global Summary + Period Comparison (top)
   - Period Trends + Stacked Trends + Cost Breakdown + Account Share + Top Accounts
   - Peak Periods Chart
   - Account widgets (current month + monthly trend)
   - Render analysis (cost breakdown + scheduler table)
   - Detailed analysis (asset breakdown + model analysis)
   - Efficiency metrics
   - Period tables
   - Feature ideas grid
3. ✅ Added period and granularity filtering with `PeriodControls`
4. ✅ All components have loading/error state handling

**Status**: ✅ Completed

---

### Phase 8: Documentation ✅ IN PROGRESS

**Goal**: Update all documentation files

#### Files Updated:

1. ✅ `src/app/dashboard/budget/BUILDABLE_NOW.md` - Updated with completion status
2. ✅ `src/app/dashboard/budget/AnalyticsRoadMap.md` - Created comprehensive roadmap
3. ✅ `src/app/dashboard/budget/Tickets.md` - Created ticket tracking
4. ✅ `src/app/dashboard/budget/INTEGRATION_PLAN.md` - This file, updated with progress
5. ⏳ `src/lib/services/rollups/readMe.md` - Could be enhanced
6. ⏳ `src/types/rollups.ts` - JSDoc comments could be added

**Status**: ✅ Mostly Complete

---

## File Structure

```
src/
├── types/
│   └── rollups.ts                    # All rollup TypeScript types
├── lib/
│   └── services/
│       └── rollups/
│           ├── readMe.md
│           ├── fetchRenderRollupById.ts
│           ├── fetchRenderRollupsBatch.ts
│           ├── fetchRenderRollupsByScheduler.ts
│           ├── fetchAccountCurrentMonthRollup.ts
│           ├── fetchAccountMonthlyRollup.ts
│           ├── fetchAccountMonthlyRollupsRange.ts
│           ├── fetchAccountRollupsSummary.ts
│           ├── fetchDailyRollup.ts
│           ├── fetchDailyRollupsRange.ts
│           ├── fetchWeeklyRollup.ts
│           ├── fetchWeeklyRollupsRange.ts
│           ├── fetchMonthlyRollup.ts
│           ├── fetchMonthlyRollupsRange.ts
│           ├── fetchGlobalCostSummary.ts
│           ├── fetchGlobalCostTrends.ts
│           └── fetchTopAccountsByCost.ts
├── hooks/
│   └── rollups/
│       ├── readMe.md
│       ├── useRenderRollup.ts
│       ├── useRenderRollupsBatch.ts
│       ├── useRenderRollupsByScheduler.ts
│       ├── useAccountCurrentMonthRollup.ts
│       ├── useAccountMonthlyRollup.ts
│       ├── useAccountMonthlyRollupsRange.ts
│       ├── useAccountRollupsSummary.ts
│       ├── useDailyRollup.ts
│       ├── useDailyRollupsRange.ts
│       ├── useWeeklyRollup.ts
│       ├── useWeeklyRollupsRange.ts
│       ├── useMonthlyRollup.ts
│       ├── useMonthlyRollupsRange.ts
│       ├── useGlobalCostSummary.ts
│       ├── useGlobalCostTrends.ts
│       └── useTopAccountsByCost.ts
└── app/
    └── dashboard/
        └── budget/
            ├── readMe.md
            ├── DevelopmentRoadMap.md
            ├── Tickets.md
            ├── INTEGRATION_PLAN.md (this file)
            ├── page.tsx
            └── components/
                ├── GlobalCostSummary.tsx
                ├── AccountCostCard.tsx
                ├── PeriodTrendsChart.tsx
                ├── TopAccountsList.tsx
                ├── RenderCostBreakdown.tsx
                └── CostMetricsGrid.tsx
```

---

## Implementation Order

1. **Phase 1** - Types & Foundation (blocking)
2. **Phase 2** - Render Rollups (can be done in parallel with Phase 3-5)
3. **Phase 3** - Account Rollups (can be done in parallel with Phase 2, 4-5)
4. **Phase 4** - Period Rollups (can be done in parallel with Phase 2-3, 5)
5. **Phase 5** - Global Analytics (can be done in parallel with Phase 2-4)
6. **Phase 6** - Components (depends on Phases 1-5)
7. **Phase 7** - Page Integration (depends on Phase 6)
8. **Phase 8** - Documentation (can be done incrementally)

---

## Key Patterns to Follow

### Service Pattern:

```typescript
"use server";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

export async function fetchX(...params): Promise<ResponseType> {
  try {
    const response = await axiosInstance.get<ResponseType>(`/api/rollups/...`);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Error handling
    }
    throw new Error("...");
  }
}
```

### Hook Pattern:

```typescript
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchX } from "@/lib/services/rollups/fetchX";

export function useX(...params): UseQueryResult<DataType, Error> {
  return useQuery({
    queryKey: ["rollups", "category", ...params],
    queryFn: () => fetchX(...params),
    enabled: /* condition */,
    staleTime: /* appropriate time */,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
```

### Component Pattern:

```typescript
"use client";
import { useX } from "@/hooks/rollups/useX";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";

export default function Component() {
  const { data, isLoading, isError, error } = useX(...params);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error} />;
  if (!data) return null;

  return (/* UI */);
}
```

---

## Testing Strategy

1. **Service Testing**: Test each service function with mock data
2. **Hook Testing**: Test hooks with React Query testing utilities
3. **Component Testing**: Test components with mocked hooks
4. **Integration Testing**: Test full flow from component to API

---

## Error Handling

- All services should handle AxiosError and throw standardized errors
- All hooks should use TanStack Query's built-in error handling
- All components should display ErrorState for user-friendly error messages
- Log errors appropriately for debugging

---

## Performance Considerations

- Use appropriate `staleTime` for each hook based on data update frequency
- Implement pagination for large datasets
- Use `enabled` flag to prevent unnecessary queries
- Consider caching strategies for frequently accessed data

---

## Next Steps

1. Review and approve this plan
2. Start with Phase 1 (Types & Foundation)
3. Implement phases in order (or parallel where possible)
4. Test each phase before moving to next
5. Update documentation incrementally

---

## Questions to Resolve

1. **API Base URL**: Confirm the base URL for rollup endpoints (likely `/api/rollups/...`)
2. **Authentication**: Do rollup endpoints require special authentication?
3. **Rate Limiting**: Are there rate limits we should be aware of?
4. **Error Format**: Confirm error response format matches our ErrorResponse type
5. **Pagination**: Default page sizes and maximum limits?
6. **Date Formats**: Confirm date format expectations (YYYY-MM-DD, ISO strings, etc.)

---

## Notes

- Follow existing code style and patterns
- Use TypeScript strictly (no `any` types where possible)
- Add JSDoc comments to all exported functions
- Keep components focused and reusable
- Use existing UI components from `@/components/ui` and `@/components/ui-library`
