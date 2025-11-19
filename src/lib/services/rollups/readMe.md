# Folder Overview

Services for Rollup CMS endpoints used by the Budget route and analytics sections.

## Files

- `fetchRenderRollupById.ts`
- `fetchRenderRollupsBatch.ts`
- `fetchRenderRollupsByScheduler.ts`
- `fetchAccountCurrentMonthRollup.ts`
- `fetchAccountMonthlyRollup.ts`
- `fetchAccountMonthlyRollupsRange.ts`
- `fetchAccountRollupsSummary.ts`
- `fetchDailyRollup.ts`
- `fetchDailyRollupsRange.ts`
- `fetchWeeklyRollup.ts`
- `fetchWeeklyRollupsRange.ts`
- `fetchMonthlyRollup.ts`
- `fetchMonthlyRollupsRange.ts`
- `fetchGlobalCostSummary.ts`
- `fetchGlobalCostTrends.ts`
- `fetchTopAccountsByCost.ts`

## Relations

- Parent: [../readMe.md](../readMe.md)
- Consumed by: `src/hooks/rollups/*`
- Depends on: `@/lib/axios`, `@/types/rollups`

## Pattern

- `"use server"` at top
- Use `axiosInstance`
- Return typed `RollupResponse<T>`
- Catch `AxiosError` and throw standardized `Error`
