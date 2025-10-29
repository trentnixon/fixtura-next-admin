# Global Analytics Endpoint

## Overview

Provides comprehensive system-wide analytics including total accounts, subscription distribution, trial conversion rates, revenue trends, and churn analysis.

## Endpoint Details

- **URL**: `GET /api/orders/analytics/global-summary`
- **Purpose**: Overall system analytics and business intelligence
- **Response Time**: <1 second
- **Data Volume**: High (all accounts, orders, trials)
- **Authentication**: Currently `auth: false` (Phase 2)

## TypeScript Types

```typescript
interface GlobalAnalyticsResponse {
  data: GlobalAnalytics;
  error?: never;
}

interface GlobalAnalytics {
  // Account Overview
  totalAccounts: number;
  activeAccounts: number;
  inactiveAccounts: number;
  accountTypesDistribution: Record<string, number>;

  // Subscription Analysis
  subscriptionTierDistribution: {
    distribution: Record<string, number>;
    totalSubscriptions: number;
    averageSubscriptionValue: number;
  };

  // Trial Analysis
  trialConversionRates: {
    totalTrials: number;
    convertedTrials: number;
    conversionRate: number;
    conversionByAccountType: Record<string, number>;
  };

  // Revenue Analysis
  revenueTrends: {
    monthlyRevenue: Record<string, number>;
    quarterlyRevenue: Record<string, number>;
    totalRevenue: number;
    averageMonthlyRevenue: number;
    growthRate: number;
    trend: "increasing" | "decreasing" | "stable";
  };

  // Churn Analysis
  churnRates: {
    totalChurned: number;
    churnRate: number;
    churnByAccountType: Record<string, number>;
    retentionRate: number;
  };

  // Customer Value
  averageCustomerLifetimeValue: number;
  medianCustomerLifetimeValue: number;

  // Sports Distribution
  sportsDistribution: Record<string, number>;

  // Metadata
  generatedAt: string;
  dataPoints: {
    totalAccounts: number;
    totalOrders: number;
    subscriptionTiers: number;
    trialInstances: number;
  };
}
```

## Usage Examples

### React Hook

```typescript
import { useQuery } from "@tanstack/react-query";

export const useGlobalAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "global"],
    queryFn: async (): Promise<GlobalAnalytics> => {
      const response = await fetch("/api/orders/analytics/global-summary");
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Failed to fetch global analytics`
        );
      }
      const data = await response.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
```

### Vue Composable

```typescript
import { ref, computed } from "vue";
import { useFetch } from "@vueuse/core";

export const useGlobalAnalytics = () => {
  const { data, error, isFetching, execute } = useFetch(
    "/api/orders/analytics/global-summary"
  ).json<GlobalAnalyticsResponse>();

  return {
    analytics: computed(() => data.value?.data),
    loading: isFetching,
    error: computed(() => error.value),
    refetch: execute,
  };
};
```

### Vanilla JavaScript

```typescript
async function fetchGlobalAnalytics(): Promise<GlobalAnalytics> {
  try {
    const response = await fetch("/api/orders/analytics/global-summary");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result: GlobalAnalyticsResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch global analytics:", error);
    throw error;
  }
}
```

## Response Example

```json
{
  "data": {
    "totalAccounts": 14,
    "activeAccounts": 8,
    "inactiveAccounts": 6,
    "accountTypesDistribution": {
      "Club": 6,
      "Association": 8
    },
    "subscriptionTierDistribution": {
      "distribution": {
        "Season Pass": 81.25,
        "3 Month Pass": 18.75,
        "Free Trial": 0
      },
      "totalSubscriptions": 20,
      "averageSubscriptionValue": 8000
    },
    "trialConversionRates": {
      "totalTrials": 13,
      "convertedTrials": 1,
      "conversionRate": 7.69,
      "conversionByAccountType": {
        "Club": 0,
        "Association": 12.5
      }
    },
    "revenueTrends": {
      "monthlyRevenue": {
        "2025-10": 130000,
        "2025-09": 30000
      },
      "quarterlyRevenue": {
        "2025-Q4": 130000,
        "2025-Q3": 30000
      },
      "totalRevenue": 160000,
      "averageMonthlyRevenue": 80000,
      "growthRate": 333.33,
      "trend": "increasing"
    },
    "churnRates": {
      "totalChurned": 5,
      "churnRate": 35.7,
      "churnByAccountType": {
        "Club": 100,
        "Association": 0
      },
      "retentionRate": 64.3
    },
    "averageCustomerLifetimeValue": 4642.86,
    "medianCustomerLifetimeValue": 0,
    "sportsDistribution": {
      "Cricket": 100
    },
    "generatedAt": "2025-10-25T11:45:32.630Z",
    "dataPoints": {
      "totalAccounts": 14,
      "totalOrders": 35,
      "subscriptionTiers": 10,
      "trialInstances": 13
    }
  }
}
```

## Error Handling

```typescript
try {
  const analytics = await fetchGlobalAnalytics();
  console.log("Total accounts:", analytics.totalAccounts);
} catch (error) {
  if (error instanceof Error) {
    console.error("Analytics error:", error.message);
  }
}
```

## Use Cases

### Dashboard Widgets

```typescript
// Key Metrics Widget
const KeyMetricsWidget = () => {
  const { data: analytics, isLoading, error } = useGlobalAnalytics();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading analytics</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      <MetricCard title="Total Accounts" value={analytics.totalAccounts} />
      <MetricCard title="Active Accounts" value={analytics.activeAccounts} />
      <MetricCard
        title="Total Revenue"
        value={`$${analytics.revenueTrends.totalRevenue.toLocaleString()}`}
      />
      <MetricCard
        title="Conversion Rate"
        value={`${analytics.trialConversionRates.conversionRate.toFixed(1)}%`}
      />
    </div>
  );
};
```

### Revenue Chart

```typescript
const RevenueChart = () => {
  const { data: analytics } = useGlobalAnalytics();

  const chartData = Object.entries(analytics.revenueTrends.monthlyRevenue).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );

  return (
    <LineChart
      data={chartData}
      xKey="month"
      yKey="revenue"
      title="Monthly Revenue Trends"
    />
  );
};
```

## Performance Notes

- **Caching**: Recommended 5-minute cache for dashboard widgets
- **Real-time**: Not real-time, suitable for periodic updates
- **Data Volume**: High - consider loading states for large datasets
- **Error Recovery**: Implement retry logic for network failures

## Future Enhancements

- **Phase 2**: Authentication and rate limiting
- **Phase 3**: Real-time updates via WebSocket
- **Phase 4**: Custom date range filtering
- **Phase 5**: Export capabilities (CSV, PDF)
