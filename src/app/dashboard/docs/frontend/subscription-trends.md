# Subscription Trends Endpoint

## Overview

Analyzes subscription lifecycle patterns, renewal vs churn rates, tier migration trends, subscription duration patterns, and customer journey analysis.

## Endpoint Details

- **URL**: `GET /api/orders/analytics/subscription-trends`
- **Purpose**: Subscription lifecycle and migration analysis
- **Response Time**: <2 seconds
- **Data Volume**: High (all subscription data)
- **Authentication**: Currently `auth: false` (Phase 2)

## TypeScript Types

```typescript
interface SubscriptionTrendsResponse {
  data: SubscriptionTrends;
  error?: never;
}

interface SubscriptionTrends {
  // Subscription Lifecycle Stages
  subscriptionLifecycleStages: {
    new: number;
    active: number;
    renewing: number;
    churning: number;
    churned: number;
    dormant: number;
  };

  // Renewal vs Churn Patterns
  renewalChurnPatterns: {
    totalSubscriptions: number;
    renewedSubscriptions: number;
    churnedSubscriptions: number;
    renewalRate: number;
    churnRate: number;
    averageRenewalInterval: number;
    churnByAccountType: Record<string, number>;
    renewalByAccountType: Record<string, number>;
  };

  // Tier Migration Patterns
  tierMigrationPatterns: {
    upgrades: number;
    downgrades: number;
    upgradesByTier: Record<string, number>;
    downgradesByTier: Record<string, number>;
    netMigration: Record<string, number>;
    migrationTrends: MigrationTrend[];
  };

  // Subscription Duration Trends
  subscriptionDurationTrends: {
    averageDuration: number;
    medianDuration: number;
    durationDistribution: Record<string, number>;
    durationByTier: Record<string, number>;
    durationByAccountType: Record<string, number>;
  };

  // Upgrade/Downgrade Patterns
  upgradeDowngradePatterns: {
    totalUpgrades: number;
    totalDowngrades: number;
    upgradeRate: number;
    downgradeRate: number;
    upgradeValue: number;
    downgradeValue: number;
    netValueChange: number;
    upgradeDowngradeRatio: number;
  };

  // Monthly Subscription Trends
  monthlySubscriptionTrends: {
    monthlySubscriptions: Record<string, number>;
    monthlyCancellations: Record<string, number>;
    monthlyRenewals: Record<string, number>;
    netGrowth: Record<string, number>;
    growthRate: number;
    trend: "growing" | "declining" | "stable";
  };

  // Subscription Status Distribution
  subscriptionStatusDistribution: {
    active: number;
    cancelled: number;
    expired: number;
    pending: number;
    suspended: number;
    distribution: Record<string, number>;
  };

  // Customer Journey Analysis
  customerJourneyAnalysis: {
    trialToPaid: number;
    directToPaid: number;
    trialConversionRate: number;
    directConversionRate: number;
    averageTimeToConversion: number;
    journeyPaths: JourneyPath[];
  };

  // Retention Cohort Analysis
  retentionCohortAnalysis: {
    cohorts: CohortData[];
    averageRetentionRate: number;
    retentionTrends: RetentionTrend[];
  };

  // Metadata
  generatedAt: string;
  dataPoints: {
    totalOrders: number;
    totalAccounts: number;
    subscriptionTiers: number;
  };
}

interface MigrationTrend {
  fromTier: string;
  toTier: string;
  count: number;
  percentage: number;
  valueChange: number;
}

interface JourneyPath {
  path: string[];
  count: number;
  conversionRate: number;
  averageDuration: number;
}

interface CohortData {
  cohort: string;
  totalSubscriptions: number;
  retentionRates: Record<string, number>;
  averageLifetimeValue: number;
}

interface RetentionTrend {
  period: string;
  retentionRate: number;
  churnRate: number;
}
```

## Usage Examples

### React Hook

```typescript
import { useQuery } from "@tanstack/react-query";

export const useSubscriptionTrends = () => {
  return useQuery({
    queryKey: ["analytics", "subscription-trends"],
    queryFn: async (): Promise<SubscriptionTrends> => {
      const response = await fetch("/api/orders/analytics/subscription-trends");
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Failed to fetch subscription trends`
        );
      }
      const data = await response.json();
      return data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};
```

### Vue Composable

```typescript
import { ref, computed } from "vue";
import { useFetch } from "@vueuse/core";

export const useSubscriptionTrends = () => {
  const { data, error, isFetching, execute } = useFetch(
    "/api/orders/analytics/subscription-trends"
  ).json<SubscriptionTrendsResponse>();

  return {
    trends: computed(() => data.value?.data),
    loading: isFetching,
    error: computed(() => error.value),
    refetch: execute,
  };
};
```

### Vanilla JavaScript

```typescript
async function fetchSubscriptionTrends(): Promise<SubscriptionTrends> {
  try {
    const response = await fetch("/api/orders/analytics/subscription-trends");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result: SubscriptionTrendsResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch subscription trends:", error);
    throw error;
  }
}
```

## Response Example

```json
{
  "data": {
    "subscriptionLifecycleStages": {
      "new": 0,
      "active": 8,
      "renewing": 0,
      "churning": 0,
      "churned": 5,
      "dormant": 0
    },
    "renewalChurnPatterns": {
      "totalSubscriptions": 13,
      "renewedSubscriptions": 0,
      "churnedSubscriptions": 5,
      "renewalRate": 0,
      "churnRate": 38.46,
      "averageRenewalInterval": 0,
      "churnByAccountType": {
        "Club": 100,
        "Association": 0
      },
      "renewalByAccountType": {
        "Club": 0,
        "Association": 0
      }
    },
    "tierMigrationPatterns": {
      "upgrades": 0,
      "downgrades": 0,
      "upgradesByTier": {},
      "downgradesByTier": {},
      "netMigration": {},
      "migrationTrends": []
    },
    "subscriptionDurationTrends": {
      "averageDuration": 0,
      "medianDuration": 0,
      "durationDistribution": {},
      "durationByTier": {},
      "durationByAccountType": {}
    },
    "upgradeDowngradePatterns": {
      "totalUpgrades": 0,
      "totalDowngrades": 0,
      "upgradeRate": 0,
      "downgradeRate": 0,
      "upgradeValue": 0,
      "downgradeValue": 0,
      "netValueChange": 0,
      "upgradeDowngradeRatio": 0
    },
    "monthlySubscriptionTrends": {
      "monthlySubscriptions": {
        "2025-10": 8,
        "2025-09": 4,
        "2025-08": 1
      },
      "monthlyCancellations": {
        "2025-10": 0,
        "2025-09": 0,
        "2025-08": 0
      },
      "monthlyRenewals": {
        "2025-10": 0,
        "2025-09": 0,
        "2025-08": 0
      },
      "netGrowth": {
        "2025-10": 8,
        "2025-09": 4,
        "2025-08": 1
      },
      "growthRate": 700,
      "trend": "growing"
    },
    "subscriptionStatusDistribution": {
      "active": 8,
      "cancelled": 0,
      "expired": 5,
      "pending": 0,
      "suspended": 0,
      "distribution": {
        "active": 61.54,
        "expired": 38.46
      }
    },
    "customerJourneyAnalysis": {
      "trialToPaid": 1,
      "directToPaid": 7,
      "trialConversionRate": 7.69,
      "directConversionRate": 53.85,
      "averageTimeToConversion": 0,
      "journeyPaths": []
    },
    "retentionCohortAnalysis": {
      "cohorts": [],
      "averageRetentionRate": 61.54,
      "retentionTrends": []
    },
    "generatedAt": "2025-10-25T11:45:32.630Z",
    "dataPoints": {
      "totalOrders": 35,
      "totalAccounts": 14,
      "subscriptionTiers": 10
    }
  }
}
```

## Error Handling

```typescript
try {
  const trends = await fetchSubscriptionTrends();
  console.log("Churn rate:", trends.renewalChurnPatterns.churnRate);
} catch (error) {
  if (error instanceof Error) {
    console.error("Subscription trends error:", error.message);
  }
}
```

## Use Cases

### Subscription Health Dashboard

```typescript
const SubscriptionHealthWidget = () => {
  const { data: trends, isLoading, error } = useSubscriptionTrends();

  if (isLoading) return <div>Loading subscription trends...</div>;
  if (error) return <div>Error loading trends</div>;

  const { renewalChurnPatterns, subscriptionLifecycleStages } = trends;

  return (
    <div className="subscription-health-dashboard">
      <div className="lifecycle-stages">
        <h3>Subscription Lifecycle</h3>
        <div className="stages-grid">
          {Object.entries(subscriptionLifecycleStages).map(([stage, count]) => (
            <div key={stage} className={`stage ${stage}`}>
              <span className="stage-name">{stage}</span>
              <span className="stage-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="renewal-churn">
        <h3>Renewal vs Churn</h3>
        <div className="metrics">
          <MetricCard
            title="Renewal Rate"
            value={`${renewalChurnPatterns.renewalRate.toFixed(1)}%`}
            trend="up"
          />
          <MetricCard
            title="Churn Rate"
            value={`${renewalChurnPatterns.churnRate.toFixed(1)}%`}
            trend="down"
          />
        </div>
      </div>
    </div>
  );
};
```

### Monthly Growth Chart

```typescript
const MonthlyGrowthChart = () => {
  const { data: trends } = useSubscriptionTrends();

  const chartData = Object.entries(
    trends.monthlySubscriptionTrends.monthlySubscriptions
  ).map(([month, count]) => ({
    month,
    subscriptions: count,
    cancellations:
      trends.monthlySubscriptionTrends.monthlyCancellations[month] || 0,
    netGrowth: trends.monthlySubscriptionTrends.netGrowth[month] || 0,
  }));

  return (
    <MultiLineChart
      data={chartData}
      xKey="month"
      yKeys={["subscriptions", "cancellations", "netGrowth"]}
      title="Monthly Subscription Trends"
      colors={["#10B981", "#EF4444", "#3B82F6"]}
    />
  );
};
```

### Tier Migration Analysis

```typescript
const TierMigrationWidget = () => {
  const { data: trends } = useSubscriptionTrends();

  const { tierMigrationPatterns } = trends;

  return (
    <div className="tier-migration">
      <h3>Tier Migration Patterns</h3>
      <div className="migration-stats">
        <div className="stat">
          <span className="label">Upgrades:</span>
          <span className="value">{tierMigrationPatterns.upgrades}</span>
        </div>
        <div className="stat">
          <span className="label">Downgrades:</span>
          <span className="value">{tierMigrationPatterns.downgrades}</span>
        </div>
        <div className="stat">
          <span className="label">Net Migration:</span>
          <span
            className={`value ${
              tierMigrationPatterns.upgrades > tierMigrationPatterns.downgrades
                ? "positive"
                : "negative"
            }`}
          >
            {tierMigrationPatterns.upgrades - tierMigrationPatterns.downgrades}
          </span>
        </div>
      </div>

      {tierMigrationPatterns.migrationTrends.length > 0 && (
        <div className="migration-trends">
          <h4>Migration Trends</h4>
          {tierMigrationPatterns.migrationTrends.map((trend, index) => (
            <div key={index} className="migration-trend">
              <span>
                {trend.fromTier} → {trend.toTier}
              </span>
              <span>
                {trend.count} ({trend.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Performance Notes

- **Caching**: Recommended 10-minute cache for subscription widgets
- **Real-time**: Not real-time, suitable for periodic updates
- **Data Volume**: High - consider loading states for large datasets
- **Error Recovery**: Implement retry logic for network failures

## Future Enhancements

- **Phase 2**: Authentication and rate limiting
- **Phase 3**: Real-time subscription updates
- **Phase 4**: Predictive churn modeling
- **Phase 5**: Subscription optimization recommendations
