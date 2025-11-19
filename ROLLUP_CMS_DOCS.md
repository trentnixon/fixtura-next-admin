# Rollup Frontend Endpoints - Implementation Plan

**Purpose**: Design and implement frontend-friendly API endpoints for accessing rollup data in Next.js with TanStack Query.

**Last Updated**: 2025-11-15

---

## Overview

The frontend needs easy access to rollup data for:

1. Displaying render costs alongside renders
2. Showing account cost summaries
3. Displaying global weekly/monthly cost trends
4. Providing cost insights and analytics

---

## Frontend Requirements

### Technology Stack

- **Framework**: Next.js
- **Data Fetching**: TanStack Query (React Query)
- **Type Safety**: TypeScript
- **Pattern**: Component → Hook (TanStack Query) → API Endpoint

### Data Format Requirements

- Consistent response structure: `{ data: {...}, meta?: {...} }`
- TypeScript types for all responses
- Error handling with standardized error format
- Caching-friendly (query keys, staleTime)
- Pagination support where needed
- Filtering and sorting capabilities

---

## Endpoint Categories

### Category 1: Render Rollups (Tier 0)

**Purpose**: Get cost data for specific renders

### Category 2: Account Rollups

**Purpose**: Get cost summaries for specific accounts

### Category 3: Period Rollups (Daily/Weekly/Monthly)

**Purpose**: Get aggregated costs for time periods

### Category 4: Global Analytics

**Purpose**: Get system-wide cost analytics

---

## Proposed Endpoints

### Category 1: Render Rollups

#### 1.1 Get Render Rollup by ID

**Endpoint**: `GET /api/rollups/render/:renderId`

**Purpose**: Get cost rollup for a specific render

**Response**:

```typescript
{
  data: {
    id: number;
    renderId: number;
    renderName: string;
    schedulerId: number;
    accountId: number;
    accountType: string;
    completedAt: string;
    renderStartedAt: string;
    processingDuration: number;
    // Cost Summary
    totalCost: number;
    totalLambdaCost: number;
    totalAiCost: number;
    totalDownloads: number;
    totalAiArticles: number;
    totalDigitalAssets: number;
    averageCostPerAsset: number;
    totalTokens: number;
    // Detailed Breakdowns
    costBreakdown: {
      global: {...};
      assetBreakdown: {...};
      assetTypeBreakdown: {...};
    };
    performanceMetrics: {...};
    fileSizeMetrics: {...};
    modelBreakdown: {...};
    // Period Info
    renderYear: number;
    renderMonth: number;
    renderWeek: number;
    renderPeriod: string;
  }
}
```

**Use Cases**:

- Display render cost in render detail view
- Show cost breakdown in render list
- Cost comparison between renders

---

#### 1.2 Get Render Rollups by Render IDs

**Endpoint**: `GET /api/rollups/render/batch`

**Query Params**: `?renderIds=1,2,3,4,5`

**Purpose**: Get multiple render rollups in one request

**Response**:

```typescript
{
  data: Array<RenderRollup>;
  meta: {
    total: number;
    requested: number;
    found: number;
  }
}
```

**Use Cases**:

- Display costs for multiple renders in a list
- Batch loading for performance

---

#### 1.3 Get Render Rollups by Scheduler

**Endpoint**: `GET /api/rollups/render/scheduler/:schedulerId`

**Query Params**:

- `?limit=50` (optional, default: 50)
- `?offset=0` (optional, default: 0)
- `?sortBy=completedAt` (optional, default: completedAt)
- `?sortOrder=desc` (optional, default: desc)

**Purpose**: Get all render rollups for a scheduler

**Response**:

```typescript
{
  data: Array<RenderRollup>;
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }
}
```

**Use Cases**:

- Scheduler detail view showing all render costs
- Scheduler cost breakdown

---

### Category 2: Account Rollups

#### 2.1 Get Account Current Month Rollup

**Endpoint**: `GET /api/rollups/account/:accountId/current-month`

**Purpose**: Get current month's cost rollup for an account (updates daily)

**Response**:

```typescript
{
  data: {
    accountId: number;
    period: {
      year: number;
      month: number;
      periodStart: string;
      periodEnd: string;
      isCurrentPeriod: true;
    };
    // Summary
    totalCost: number;
    totalLambdaCost: number;
    totalAiCost: number;
    totalRenders: number;
    totalSchedulers: number;
    // Breakdowns
    costBreakdown: {...};
    insights: {...};
    // Last updated
    lastCalculatedAt: string;
  }
}
```

**Use Cases**:

- Account dashboard showing current month costs
- Real-time cost tracking
- Account billing preview

---

#### 2.2 Get Account Monthly Rollup

**Endpoint**: `GET /api/rollups/account/:accountId/month/:year/:month`

**Purpose**: Get specific month's rollup for an account

**Response**: Same as 2.1 but `isCurrentPeriod` may be false

**Use Cases**:

- Historical month view
- Month-over-month comparison
- Account billing history

---

#### 2.3 Get Account Monthly Rollups (Range)

**Endpoint**: `GET /api/rollups/account/:accountId/months`

**Query Params**:

- `?startYear=2025&startMonth=1` (required)
- `?endYear=2025&endMonth=12` (required)
- `?limit=12` (optional, default: 12)

**Purpose**: Get multiple months of rollups for an account

**Response**:

```typescript
{
  data: Array<MonthlyRollup>;
  meta: {
    total: number;
    startPeriod: {
      year: number;
      month: number;
    }
    endPeriod: {
      year: number;
      month: number;
    }
  }
}
```

**Use Cases**:

- Account cost trends chart
- Year-to-date costs
- Historical cost analysis

---

#### 2.4 Get Account All Rollups Summary

**Endpoint**: `GET /api/rollups/account/:accountId/summary`

**Purpose**: Get comprehensive summary of all rollup types for an account

**Response**:

```typescript
{
  data: {
    accountId: number;
    // Current Period
    currentMonth: MonthlyRollup | null;
    // Recent Activity
    recentRenders: Array<RenderRollup>; // Last 10
    recentSchedulers: Array<SchedulerRollup>; // Last 5
    // Totals (all time or configurable period)
    totals: {
      totalCost: number;
      totalRenders: number;
      totalSchedulers: number;
      averageCostPerRender: number;
    }
    // Trends
    monthlyTrend: Array<{ month: string; cost: number }>;
  }
}
```

**Use Cases**:

- Account overview dashboard
- Quick cost summary
- Account analytics page

---

### Category 3: Period Rollups

#### 3.1 Get Daily Rollup

**Endpoint**: `GET /api/rollups/daily/:date`

**Date Format**: `YYYY-MM-DD`

**Purpose**: Get daily rollup for a specific date

**Response**:

```typescript
{
  data: {
    date: string;
    periodStart: string;
    periodEnd: string;
    // Summary
    totalCost: number;
    totalRenders: number;
    totalSchedulers: number;
    // Breakdowns
    accountBreakdown: {
      [accountId: string]: {
        totalRenders: number;
        totalCost: number;
        schedulers: number[];
      };
    };
    costBreakdown: {...};
    insights: {...};
  }
}
```

**Use Cases**:

- Daily cost report
- Date-specific cost analysis
- Daily cost trends

---

#### 3.2 Get Daily Rollups (Range)

**Endpoint**: `GET /api/rollups/daily`

**Query Params**:

- `?startDate=2025-11-01` (required)
- `?endDate=2025-11-30` (required)
- `?limit=31` (optional, default: 31)

**Purpose**: Get multiple daily rollups for a date range

**Response**:

```typescript
{
  data: Array<DailyRollup>;
  meta: {
    total: number;
    startDate: string;
    endDate: string;
    totalCost: number; // Sum of all days
  }
}
```

**Use Cases**:

- Daily cost trends chart
- Month view with daily breakdown
- Cost analysis over period

---

#### 3.3 Get Weekly Rollup

**Endpoint**: `GET /api/rollups/weekly/:year/:week`

**Purpose**: Get weekly rollup for specific ISO week

**Response**:

```typescript
{
  data: {
    year: number;
    week: number;
    periodStart: string;
    periodEnd: string;
    totalDays: number;
    // Summary
    totalCost: number;
    totalRenders: number;
    averageDailyCost: number;
    // Breakdowns
    costBreakdown: {...};
    insights: {...};
  }
}
```

**Use Cases**:

- Weekly cost report
- Week-over-week comparison
- Weekly trends

---

#### 3.4 Get Weekly Rollups (Range)

**Endpoint**: `GET /api/rollups/weekly`

**Query Params**:

- `?startYear=2025&startWeek=1` (required)
- `?endYear=2025&endWeek=52` (required)
- `?limit=52` (optional, default: 52)

**Purpose**: Get multiple weekly rollups

**Response**:

```typescript
{
  data: Array<WeeklyRollup>;
  meta: {
    total: number;
    startPeriod: {
      year: number;
      week: number;
    }
    endPeriod: {
      year: number;
      week: number;
    }
    totalCost: number;
  }
}
```

**Use Cases**:

- Weekly trends chart
- Year view with weekly breakdown
- Quarterly analysis

---

#### 3.5 Get Monthly Rollup (Global)

**Endpoint**: `GET /api/rollups/monthly/:year/:month`

**Purpose**: Get global monthly rollup (all accounts)

**Response**:

```typescript
{
  data: {
    year: number;
    month: number;
    periodStart: string;
    periodEnd: string;
    isGlobal: true;
    isCurrentPeriod: boolean;
    // Summary
    totalCost: number;
    totalRenders: number;
    totalAccounts: number; // Unique accounts
    // Breakdowns
    costBreakdown: {...};
    insights: {...};
  }
}
```

**Use Cases**:

- Global monthly report
- System-wide cost analysis
- Monthly cost trends

---

#### 3.6 Get Monthly Rollups (Range)

**Endpoint**: `GET /api/rollups/monthly`

**Query Params**:

- `?startYear=2025&startMonth=1` (required)
- `?endYear=2025&endMonth=12` (required)
- `?global=true` (optional, default: false - if true, returns global rollups)
- `?limit=12` (optional, default: 12)

**Purpose**: Get multiple monthly rollups

**Response**:

```typescript
{
  data: Array<MonthlyRollup>;
  meta: {
    total: number;
    startPeriod: {
      year: number;
      month: number;
    }
    endPeriod: {
      year: number;
      month: number;
    }
    totalCost: number;
    isGlobal: boolean;
  }
}
```

**Use Cases**:

- Monthly trends chart
- Year view
- Historical analysis

---

### Category 4: Global Analytics

#### 4.1 Get Global Cost Summary

**Endpoint**: `GET /api/rollups/global/summary`

**Query Params**:

- `?period=current-month` (optional: current-month, last-month, current-year, all-time, default: current-month)

**Purpose**: Get high-level global cost summary

**Response**:

```typescript
{
  data: {
    period: string;
    periodStart: string;
    periodEnd: string;
    // Totals
    totalCost: number;
    totalLambdaCost: number;
    totalAiCost: number;
    totalRenders: number;
    totalAccounts: number;
    totalSchedulers: number;
    // Averages
    averageCostPerRender: number;
    averageCostPerAccount: number;
    averageCostPerDay: number;
    // Trends
    costTrend: "up" | "down" | "stable";
    percentageChange: number; // vs previous period
    // Top Accounts
    topAccounts: Array<{
      accountId: number;
      totalCost: number;
      renderCount: number;
    }>;
  }
}
```

**Use Cases**:

- Admin dashboard
- System overview
- Cost monitoring

---

#### 4.2 Get Global Cost Trends

**Endpoint**: `GET /api/rollups/global/trends`

**Query Params**:

- `?granularity=daily` (optional: daily, weekly, monthly, default: daily)
- `?startDate=2025-11-01` (required)
- `?endDate=2025-11-30` (required)

**Purpose**: Get cost trends over time

**Response**:

```typescript
{
  data: {
    granularity: string;
    period: {
      start: string;
      end: string;
    }
    dataPoints: Array<{
      period: string; // Date or week or month
      totalCost: number;
      totalLambdaCost: number;
      totalAiCost: number;
      totalRenders: number;
    }>;
    summary: {
      totalCost: number;
      averageCost: number;
      peakCost: number;
      peakPeriod: string;
      trend: "up" | "down" | "stable";
    }
  }
}
```

**Use Cases**:

- Cost trends chart
- Analytics dashboard
- Cost forecasting

---

#### 4.3 Get Top Accounts by Cost

**Endpoint**: `GET /api/rollups/global/top-accounts`

**Query Params**:

- `?period=current-month` (optional: current-month, last-month, current-year, all-time)
- `?limit=10` (optional, default: 10)
- `?sortBy=totalCost` (optional: totalCost, renderCount, default: totalCost)
- `?sortOrder=desc` (optional: asc, desc, default: desc)

**Purpose**: Get top accounts by cost

**Response**:

```typescript
{
  data: Array<{
    accountId: number;
    accountName?: string;
    accountType?: string;
    totalCost: number;
    totalLambdaCost: number;
    totalAiCost: number;
    totalRenders: number;
    averageCostPerRender: number;
    percentageOfTotal: number; // % of global total
  }>;
  meta: {
    period: string;
    totalAccounts: number;
    limit: number;
  }
}
```

**Use Cases**:

- Top accounts leaderboard
- Cost analysis
- Account segmentation

---

## Response Format Standardization

### Success Response

```typescript
{
  data: T; // The actual data
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
    hasMore?: boolean;
    [key: string]: any; // Additional metadata
  };
}
```

### Error Response

```typescript
{
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}
```

---

## Implementation Phases

### Phase 1: Core Endpoints (Priority 1)

**Goal**: Essential endpoints for basic rollup access

1. ✅ Get Render Rollup by ID
2. ✅ Get Account Current Month Rollup
3. ✅ Get Daily Rollup
4. ✅ Get Global Cost Summary

**Estimated Time**: 2-3 days

---

### Phase 2: Account & Period Endpoints (Priority 2)

**Goal**: Complete account and period rollup access

1. ✅ Get Account Monthly Rollup
2. ✅ Get Account Monthly Rollups (Range)
3. ✅ Get Daily Rollups (Range)
4. ✅ Get Weekly Rollup
5. ✅ Get Weekly Rollups (Range)
6. ✅ Get Monthly Rollup (Global)
7. ✅ Get Monthly Rollups (Range)

**Estimated Time**: 3-4 days

---

### Phase 3: Batch & Advanced Endpoints (Priority 3)

**Goal**: Performance optimizations and advanced features

1. ✅ Get Render Rollups by Render IDs (Batch)
2. ✅ Get Render Rollups by Scheduler
3. ✅ Get Account All Rollups Summary
4. ✅ Get Global Cost Trends
5. ✅ Get Top Accounts by Cost

**Estimated Time**: 2-3 days

---

## Frontend Hook Examples

### Example 1: Get Render Rollup

```typescript
// hooks/rollups/useRenderRollup.ts
import { useQuery } from "@tanstack/react-query";

export function useRenderRollup(renderId: number | null) {
  return useQuery({
    queryKey: ["rollups", "render", renderId],
    queryFn: async () => {
      const response = await fetch(`/api/rollups/render/${renderId}`);
      if (!response.ok) throw new Error("Failed to fetch render rollup");
      const data = await response.json();
      return data.data;
    },
    enabled: !!renderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Example 2: Get Account Current Month

```typescript
// hooks/rollups/useAccountCurrentMonth.ts
import { useQuery } from "@tanstack/react-query";

export function useAccountCurrentMonth(accountId: number | null) {
  return useQuery({
    queryKey: ["rollups", "account", accountId, "current-month"],
    queryFn: async () => {
      const response = await fetch(
        `/api/rollups/account/${accountId}/current-month`
      );
      if (!response.ok)
        throw new Error("Failed to fetch account current month");
      const data = await response.json();
      return data.data;
    },
    enabled: !!accountId,
    staleTime: 1 * 60 * 1000, // 1 minute (updates daily)
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
```

### Example 3: Get Daily Rollups Range

```typescript
// hooks/rollups/useDailyRollups.ts
import { useQuery } from "@tanstack/react-query";

interface UseDailyRollupsParams {
  startDate: string;
  endDate: string;
  limit?: number;
}

export function useDailyRollups(params: UseDailyRollupsParams) {
  const { startDate, endDate, limit = 31 } = params;

  return useQuery({
    queryKey: ["rollups", "daily", startDate, endDate, limit],
    queryFn: async () => {
      const url = new URL("/api/rollups/daily", window.location.origin);
      url.searchParams.set("startDate", startDate);
      url.searchParams.set("endDate", endDate);
      url.searchParams.set("limit", limit.toString());

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch daily rollups");
      const data = await response.json();
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

---

## TypeScript Types

### Base Types

```typescript
// types/rollups.ts

export interface RenderRollup {
  id: number;
  renderId: number;
  renderName: string | null;
  schedulerId: number | null;
  accountId: number | null;
  accountType: string | null;
  completedAt: string;
  renderStartedAt: string;
  processingDuration: number;
  totalCost: number;
  totalLambdaCost: number;
  totalAiCost: number;
  totalDownloads: number;
  totalAiArticles: number;
  totalDigitalAssets: number;
  averageCostPerAsset: number;
  totalTokens: number;
  costBreakdown: CostBreakdown;
  performanceMetrics: PerformanceMetrics;
  fileSizeMetrics: FileSizeMetrics;
  modelBreakdown: ModelBreakdown;
  renderYear: number;
  renderMonth: number;
  renderWeek: number;
  renderPeriod: string;
}

export interface DailyRollup {
  id: number;
  date: string;
  periodStart: string;
  periodEnd: string;
  totalCost: number;
  totalRenders: number;
  totalSchedulers: number;
  accountBreakdown: Record<string, AccountBreakdown>;
  costBreakdown: CostBreakdown;
  insights: Insights;
}

export interface WeeklyRollup {
  id: number;
  year: number;
  week: number;
  periodStart: string;
  periodEnd: string;
  totalDays: number;
  totalCost: number;
  totalRenders: number;
  averageDailyCost: number;
  costBreakdown: CostBreakdown;
  insights: Insights;
}

export interface MonthlyRollup {
  id: number;
  accountId: number | null;
  year: number;
  month: number;
  periodStart: string;
  periodEnd: string;
  isGlobal: boolean;
  isCurrentPeriod: boolean;
  totalCost: number;
  totalRenders: number;
  totalWeeks: number;
  totalDays: number;
  costBreakdown: CostBreakdown;
  insights: Insights;
}
```

---

## Next Steps

1. **Review & Approve Plan**: Review this plan and approve endpoint designs
2. **Create Endpoint Controllers**: Implement controllers for each endpoint
3. **Create Routes**: Add routes to Strapi
4. **Add Response Formatting**: Format responses for frontend consumption
5. **Create TypeScript Types**: Generate TypeScript types for frontend
6. **Create Frontend Hooks**: Implement TanStack Query hooks
7. **Testing**: Test all endpoints with frontend integration
8. **Documentation**: Create frontend integration guide

---

## Questions to Resolve

1. **Authentication**: Should these endpoints require authentication? What level?
2. **Rate Limiting**: Should we implement rate limiting? What limits?
3. **Caching**: Should we add server-side caching? Redis?
4. **Pagination**: Default page size? Maximum?
5. **Filtering**: What additional filters might be needed?
6. **Sorting**: What sort options are needed?
7. **Error Handling**: Standard error codes and messages?

---

## Notes

- All endpoints should follow RESTful conventions
- Use consistent naming (kebab-case for URLs, camelCase for JSON)
- Include proper HTTP status codes
- Support CORS if needed
- Consider GraphQL alternative if query complexity grows
- Monitor performance and optimize as needed
