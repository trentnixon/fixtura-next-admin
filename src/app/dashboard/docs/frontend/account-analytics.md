# Account Analytics Endpoint

## Overview

Provides detailed insights for individual accounts including order history, subscription timeline, trial usage, payment status, renewal patterns, and account health scoring.

## Endpoint Details

- **URL**: `GET /api/orders/analytics/account/:id`
- **Purpose**: Account-specific insights and health assessment
- **Response Time**: <1 second
- **Data Volume**: Medium (single account data)
- **Authentication**: Currently `auth: false` (Phase 2)

## Parameters

- `id` (string, required): Account ID

## TypeScript Types

```typescript
interface AccountAnalyticsResponse {
  data: AccountAnalytics;
  error?: never;
}

interface AccountAnalytics {
  // Account Overview
  accountId: number;
  accountType: string;
  sport: string;
  createdAt: string;

  // Order History
  orderHistory: {
    totalOrders: number;
    paidOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    orders: OrderSummary[];
  };

  // Subscription Timeline
  subscriptionTimeline: {
    currentSubscription: SubscriptionInfo | null;
    subscriptionHistory: SubscriptionEvent[];
    totalSubscriptions: number;
    averageSubscriptionDuration: number;
  };

  // Trial Usage
  trialUsage: {
    hasActiveTrial: boolean;
    trialInstance: TrialInfo | null;
    trialHistory: TrialEvent[];
    totalTrials: number;
    trialConversionRate: number;
  };

  // Payment Status
  paymentStatus: {
    successRate: number;
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    lastPaymentDate: string | null;
    averagePaymentAmount: number;
  };

  // Renewal Patterns
  renewalPatterns: {
    hasRenewed: boolean;
    renewalCount: number;
    averageRenewalInterval: number;
    lastRenewalDate: string | null;
    nextExpectedRenewal: string | null;
    renewalConsistency: "consistent" | "irregular" | "unknown";
  };

  // Account Health Score
  accountHealthScore: {
    overallScore: number; // 0-100
    breakdown: {
      accountSetup: number;
      accountActivity: number;
      paymentSuccess: number;
      subscriptionContinuity: number;
      trialConversion: number;
    };
    healthLevel: "excellent" | "good" | "fair" | "poor" | "critical";
  };

  // Current Subscription
  currentSubscription: {
    tier: string;
    status: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    autoRenew: boolean;
  } | null;

  // Financial Summary
  financialSummary: {
    totalLifetimeValue: number;
    monthlyRecurringRevenue: number;
    averageMonthlySpend: number;
    paymentMethod: string;
    billingCycle: string;
  };

  // Usage Patterns
  usagePatterns: {
    orderFrequency: "high" | "medium" | "low";
    seasonalPatterns: string[];
    peakUsageMonths: string[];
    averageDaysBetweenOrders: number;
  };

  // Risk Indicators
  riskIndicators: {
    paymentFailures: number;
    subscriptionCancellations: number;
    longInactivityPeriods: number;
    downgradeHistory: number;
    riskLevel: "low" | "medium" | "high";
    riskFactors: string[];
  };

  // Metadata
  generatedAt: string;
  lastUpdated: string;
}

interface OrderSummary {
  id: number;
  date: string;
  amount: number;
  status: string;
  subscriptionTier: string;
  paymentMethod: string;
}

interface SubscriptionInfo {
  tier: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
}

interface SubscriptionEvent {
  date: string;
  action: "started" | "renewed" | "cancelled" | "upgraded" | "downgraded";
  tier: string;
  amount: number;
}

interface TrialInfo {
  startDate: string;
  endDate: string;
  isActive: boolean;
  subscriptionTier: string;
  daysRemaining: number;
}

interface TrialEvent {
  startDate: string;
  endDate: string;
  converted: boolean;
  subscriptionTier: string;
}
```

## Usage Examples

### React Hook

```typescript
import { useQuery } from "@tanstack/react-query";

export const useAccountAnalytics = (accountId: string) => {
  return useQuery({
    queryKey: ["analytics", "account", accountId],
    queryFn: async (): Promise<AccountAnalytics> => {
      const response = await fetch(
        `/api/orders/analytics/account/${accountId}`
      );
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Failed to fetch account analytics`
        );
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!accountId,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 3,
  });
};
```

### Vue Composable

```typescript
import { ref, computed } from "vue";
import { useFetch } from "@vueuse/core";

export const useAccountAnalytics = (accountId: string) => {
  const { data, error, isFetching, execute } = useFetch(
    `/api/orders/analytics/account/${accountId}`
  ).json<AccountAnalyticsResponse>();

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
async function fetchAccountAnalytics(
  accountId: string
): Promise<AccountAnalytics> {
  try {
    const response = await fetch(`/api/orders/analytics/account/${accountId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result: AccountAnalyticsResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch account analytics:", error);
    throw error;
  }
}
```

## Response Example

```json
{
  "data": {
    "accountId": 430,
    "accountType": "Club",
    "sport": "Cricket",
    "createdAt": "2025-10-21T00:00:00.000Z",
    "orderHistory": {
      "totalOrders": 1,
      "paidOrders": 1,
      "totalSpent": 0,
      "averageOrderValue": 0,
      "orders": [
        {
          "id": 430,
          "date": "2025-10-21T00:00:00.000Z",
          "amount": 0,
          "status": "paid",
          "subscriptionTier": "Free Trial",
          "paymentMethod": "Unknown"
        }
      ]
    },
    "subscriptionTimeline": {
      "currentSubscription": null,
      "subscriptionHistory": [],
      "totalSubscriptions": 0,
      "averageSubscriptionDuration": 0
    },
    "trialUsage": {
      "hasActiveTrial": true,
      "trialInstance": {
        "startDate": "2025-10-21T00:00:00.000Z",
        "endDate": "2025-11-04T00:00:00.000Z",
        "isActive": true,
        "subscriptionTier": "Free Trial",
        "daysRemaining": 10
      },
      "trialHistory": [
        {
          "startDate": "2025-10-21T00:00:00.000Z",
          "endDate": "2025-11-04T00:00:00.000Z",
          "converted": false,
          "subscriptionTier": "Free Trial"
        }
      ],
      "totalTrials": 1,
      "trialConversionRate": 0
    },
    "paymentStatus": {
      "successRate": 100,
      "totalPayments": 1,
      "successfulPayments": 1,
      "failedPayments": 0,
      "lastPaymentDate": "2025-10-21T00:00:00.000Z",
      "averagePaymentAmount": 0
    },
    "renewalPatterns": {
      "hasRenewed": false,
      "renewalCount": 0,
      "averageRenewalInterval": 0,
      "lastRenewalDate": null,
      "nextExpectedRenewal": null,
      "renewalConsistency": "unknown"
    },
    "accountHealthScore": {
      "overallScore": 90,
      "breakdown": {
        "accountSetup": 20,
        "accountActivity": 20,
        "paymentSuccess": 20,
        "subscriptionContinuity": 20,
        "trialConversion": 10
      },
      "healthLevel": "excellent"
    },
    "currentSubscription": null,
    "financialSummary": {
      "totalLifetimeValue": 0,
      "monthlyRecurringRevenue": 0,
      "averageMonthlySpend": 0,
      "paymentMethod": "Unknown",
      "billingCycle": "Unknown"
    },
    "usagePatterns": {
      "orderFrequency": "low",
      "seasonalPatterns": [],
      "peakUsageMonths": [],
      "averageDaysBetweenOrders": 0
    },
    "riskIndicators": {
      "paymentFailures": 0,
      "subscriptionCancellations": 0,
      "longInactivityPeriods": 0,
      "downgradeHistory": 0,
      "riskLevel": "low",
      "riskFactors": []
    },
    "generatedAt": "2025-10-25T11:45:32.630Z",
    "lastUpdated": "2025-10-25T11:45:32.630Z"
  }
}
```

## Error Handling

```typescript
try {
  const analytics = await fetchAccountAnalytics("430");
  console.log(
    "Account health score:",
    analytics.accountHealthScore.overallScore
  );
} catch (error) {
  if (error instanceof Error) {
    console.error("Account analytics error:", error.message);
  }
}
```

## Use Cases

### Account Health Dashboard

```typescript
const AccountHealthWidget = ({ accountId }: { accountId: string }) => {
  const { data: analytics, isLoading, error } = useAccountAnalytics(accountId);

  if (isLoading) return <div>Loading account health...</div>;
  if (error) return <div>Error loading account data</div>;

  const { accountHealthScore, riskIndicators } = analytics;

  return (
    <div className="account-health-dashboard">
      <div className="health-score">
        <h3>Account Health Score</h3>
        <div className={`score ${accountHealthScore.healthLevel}`}>
          {accountHealthScore.overallScore}/100
        </div>
        <div className="breakdown">
          {Object.entries(accountHealthScore.breakdown).map(([key, score]) => (
            <div key={key} className="breakdown-item">
              <span>{key}:</span>
              <span>{score}/20</span>
            </div>
          ))}
        </div>
      </div>

      <div className="risk-indicators">
        <h3>Risk Assessment</h3>
        <div className={`risk-level ${riskIndicators.riskLevel}`}>
          {riskIndicators.riskLevel.toUpperCase()} RISK
        </div>
        {riskIndicators.riskFactors.length > 0 && (
          <ul>
            {riskIndicators.riskFactors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
```

### Trial Status Widget

```typescript
const TrialStatusWidget = ({ accountId }: { accountId: string }) => {
  const { data: analytics } = useAccountAnalytics(accountId);

  const { trialUsage } = analytics;

  if (!trialUsage.hasActiveTrial) {
    return <div>No active trial</div>;
  }

  const { trialInstance } = trialUsage;

  return (
    <div className="trial-status">
      <h3>Active Trial</h3>
      <div className="trial-info">
        <p>Tier: {trialInstance.subscriptionTier}</p>
        <p>Days Remaining: {trialInstance.daysRemaining}</p>
        <p>Ends: {new Date(trialInstance.endDate).toLocaleDateString()}</p>
      </div>

      {trialInstance.daysRemaining <= 3 && (
        <div className="trial-alert">
          ⚠️ Trial expires soon! Consider outreach.
        </div>
      )}
    </div>
  );
};
```

### Order History Chart

```typescript
const OrderHistoryChart = ({ accountId }: { accountId: string }) => {
  const { data: analytics } = useAccountAnalytics(accountId);

  const chartData = analytics.orderHistory.orders.map((order) => ({
    date: order.date,
    amount: order.amount,
    status: order.status,
  }));

  return (
    <LineChart
      data={chartData}
      xKey="date"
      yKey="amount"
      title="Order History"
      colorKey="status"
    />
  );
};
```

## Performance Notes

- **Caching**: Recommended 1-minute cache for account widgets
- **Real-time**: Not real-time, suitable for periodic updates
- **Data Volume**: Medium - single account data
- **Error Recovery**: Implement retry logic for network failures

## Future Enhancements

- **Phase 2**: Authentication and account access control
- **Phase 3**: Real-time updates for account changes
- **Phase 4**: Account comparison features
- **Phase 5**: Predictive analytics for account health
