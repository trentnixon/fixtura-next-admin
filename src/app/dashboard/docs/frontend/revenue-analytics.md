# Revenue Analytics Endpoint

## Overview

Provides comprehensive revenue analysis including monthly/quarterly trends, revenue by subscription tier, payment method analysis, billing cycles, revenue projections, customer lifetime value, and seasonal patterns.

## Endpoint Details

- **URL**: `GET /api/orders/analytics/revenue-analytics`
- **Purpose**: Financial insights and revenue analysis
- **Response Time**: <2 seconds
- **Data Volume**: High (all revenue data)
- **Authentication**: Currently `auth: false` (Phase 2)

## TypeScript Types

```typescript
interface RevenueAnalyticsResponse {
  data: RevenueAnalytics;
  error?: never;
}

interface RevenueAnalytics {
  // Monthly and Quarterly Revenue Trends
  monthlyQuarterlyRevenueTrends: {
    monthlyRevenue: Record<string, number>;
    quarterlyRevenue: Record<string, number>;
    monthlyOrderCounts: Record<string, number>;
    quarterlyOrderCounts: Record<string, number>;
    monthlyTrends: TrendAnalysis;
    quarterlyTrends: TrendAnalysis;
    totalRevenue: number;
    averageMonthlyRevenue: number;
  };

  // Revenue by Subscription Tier
  revenueBySubscriptionTier: {
    revenueByTier: Record<string, number>;
    orderCountsByTier: Record<string, number>;
    averageOrderValueByTier: Record<string, number>;
    totalRevenue: number;
    revenueDistribution: Record<string, number>;
  };

  // Payment Method Analysis
  paymentMethodAnalysis: Record<string, PaymentMethodData>;

  // Billing Cycle Patterns
  billingCyclePatterns: Record<string, BillingCycleData>;

  // Revenue Projections
  revenueProjections: {
    trend: "increasing" | "decreasing" | "stable";
    growthRate: number;
    projections: Record<string, number>;
    confidence: "high" | "medium" | "low";
    basedOnMonths: number;
  };

  // Customer Lifetime Value Analysis
  customerLifetimeValueAnalysis: {
    averageCLV: number;
    medianCLV: number;
    totalCustomers: number;
    clvByAccountType: Record<string, CLVData>;
    customerDistribution: CLVDistribution;
  };

  // Revenue by Account Type
  revenueByAccountType: {
    revenueByAccountType: Record<string, number>;
    orderCountsByAccountType: Record<string, number>;
    averageOrderValueByAccountType: Record<string, number>;
    revenueDistribution: Record<string, number>;
  };

  // Revenue Growth Metrics
  revenueGrowthMetrics: {
    monthOverMonthGrowth: MonthGrowth[];
    averageMoMGrowth: number;
    totalRevenue: number;
    revenueTrend: "increasing" | "decreasing" | "stable";
  };

  // Revenue Concentration Analysis
  revenueConcentrationAnalysis: {
    top10PercentRevenue: number;
    top25PercentRevenue: number;
    top50PercentRevenue: number;
    totalCustomers: number;
    averageRevenuePerCustomer: number;
    medianRevenuePerCustomer: number;
  };

  // Seasonal Revenue Patterns
  seasonalRevenuePatterns: {
    byMonth: Record<string, number>;
    byQuarter: Record<string, number>;
    byDayOfWeek: Record<string, number>;
    byHour: Record<string, number>;
  };

  // Revenue Per Customer Metrics
  revenuePerCustomerMetrics: {
    totalCustomers: number;
    totalRevenue: number;
    averageRevenuePerCustomer: number;
    accountTypeMetrics: Record<string, AccountTypeMetrics>;
  };

  // Metadata
  generatedAt: string;
  dataPoints: {
    totalOrders: number;
    totalAccounts: number;
    subscriptionTiers: number;
  };
}

interface TrendAnalysis {
  trend: "increasing" | "decreasing" | "stable";
  growthRate: number;
}

interface PaymentMethodData {
  orderCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  revenuePercentage: number;
}

interface BillingCycleData {
  orderCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  revenuePercentage: number;
}

interface CLVData {
  averageCLV: number;
  medianCLV: number;
  customerCount: number;
  totalRevenue: number;
}

interface CLVDistribution {
  lowValue: number;
  mediumValue: number;
  highValue: number;
  lowValuePercentage: number;
  mediumValuePercentage: number;
  highValuePercentage: number;
}

interface MonthGrowth {
  month: string;
  growthRate: number;
}

interface AccountTypeMetrics {
  totalRevenue: number;
  totalOrders: number;
  customerCount: number;
  revenues: number[];
  averageRevenuePerCustomer: number;
  averageOrdersPerCustomer: number;
  averageOrderValue: number;
}
```

## Usage Examples

### React Hook

```typescript
import { useQuery } from "@tanstack/react-query";

export const useRevenueAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "revenue"],
    queryFn: async (): Promise<RevenueAnalytics> => {
      const response = await fetch("/api/orders/analytics/revenue-analytics");
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Failed to fetch revenue analytics`
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

export const useRevenueAnalytics = () => {
  const { data, error, isFetching, execute } = useFetch(
    "/api/orders/analytics/revenue-analytics"
  ).json<RevenueAnalyticsResponse>();

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
async function fetchRevenueAnalytics(): Promise<RevenueAnalytics> {
  try {
    const response = await fetch("/api/orders/analytics/revenue-analytics");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result: RevenueAnalyticsResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch revenue analytics:", error);
    throw error;
  }
}
```

## Response Example

```json
{
  "data": {
    "monthlyQuarterlyRevenueTrends": {
      "monthlyRevenue": {
        "2025-10": 130000,
        "2025-09": 30000,
        "2025-08": 0
      },
      "quarterlyRevenue": {
        "2025-Q4": 130000,
        "2025-Q3": 30000
      },
      "monthlyOrderCounts": {
        "2025-10": 24,
        "2025-09": 4,
        "2025-08": 6
      },
      "quarterlyOrderCounts": {
        "2025-Q4": 24,
        "2025-Q3": 10
      },
      "monthlyTrends": {
        "trend": "stable",
        "growthRate": 0
      },
      "quarterlyTrends": {
        "trend": "increasing",
        "growthRate": 333.33
      },
      "totalRevenue": 160000,
      "averageMonthlyRevenue": 53333.33
    },
    "revenueBySubscriptionTier": {
      "revenueByTier": {
        "Season Pass": 130000,
        "Free Trial": 0,
        "3 Month Pass": 30000
      },
      "orderCountsByTier": {
        "Season Pass": 18,
        "Free Trial": 1,
        "3 Month Pass": 1
      },
      "averageOrderValueByTier": {
        "Season Pass": 7222.22,
        "Free Trial": 0,
        "3 Month Pass": 30000
      },
      "totalRevenue": 160000,
      "revenueDistribution": {
        "Season Pass": 81.25,
        "Free Trial": 0,
        "3 Month Pass": 18.75
      }
    },
    "paymentMethodAnalysis": {
      "Unknown": {
        "orderCount": 34,
        "totalRevenue": 160000,
        "averageOrderValue": 4705.88,
        "revenuePercentage": 100
      }
    },
    "billingCyclePatterns": {
      "Seasonal": {
        "orderCount": 18,
        "totalRevenue": 130000,
        "averageOrderValue": 7222.22,
        "revenuePercentage": 81.25
      },
      "One-time": {
        "orderCount": 15,
        "totalRevenue": 0,
        "averageOrderValue": 0,
        "revenuePercentage": 0
      },
      "Monthly": {
        "orderCount": 1,
        "totalRevenue": 30000,
        "averageOrderValue": 30000,
        "revenuePercentage": 18.75
      }
    },
    "revenueProjections": {
      "trend": "stable",
      "growthRate": 0,
      "projections": {
        "2025-10": 130000,
        "2025-11": 130000,
        "2025-12": 130000
      },
      "confidence": "high",
      "basedOnMonths": 3
    },
    "customerLifetimeValueAnalysis": {
      "averageCLV": 4642.86,
      "medianCLV": 0,
      "totalCustomers": 14,
      "clvByAccountType": {
        "Club": {
          "averageCLV": 0,
          "medianCLV": 0,
          "customerCount": 6,
          "totalRevenue": 0
        },
        "Association": {
          "averageCLV": 8125,
          "medianCLV": 0,
          "customerCount": 8,
          "totalRevenue": 65000
        }
      },
      "customerDistribution": {
        "lowValue": 0,
        "mediumValue": 0,
        "highValue": 65000,
        "lowValuePercentage": 0,
        "mediumValuePercentage": 0,
        "highValuePercentage": 100
      }
    },
    "revenueByAccountType": {
      "revenueByAccountType": {
        "Association": 65000,
        "Club": 0
      },
      "orderCountsByAccountType": {
        "Association": 10,
        "Club": 1
      },
      "averageOrderValueByAccountType": {
        "Association": 6500,
        "Club": 0
      },
      "revenueDistribution": {
        "Association": 100,
        "Club": 0
      }
    },
    "revenueGrowthMetrics": {
      "monthOverMonthGrowth": [
        {
          "month": "2025-09",
          "growthRate": 0
        },
        {
          "month": "2025-10",
          "growthRate": 333.33
        }
      ],
      "averageMoMGrowth": 166.67,
      "totalRevenue": 160000,
      "revenueTrend": "increasing"
    },
    "revenueConcentrationAnalysis": {
      "top10PercentRevenue": 100,
      "top25PercentRevenue": 100,
      "top50PercentRevenue": 100,
      "totalCustomers": 14,
      "averageRevenuePerCustomer": 4642.86,
      "medianRevenuePerCustomer": 0
    },
    "seasonalRevenuePatterns": {
      "byMonth": {
        "7": 0,
        "8": 30000,
        "9": 130000
      },
      "byQuarter": {
        "3": 30000,
        "4": 130000
      },
      "byDayOfWeek": {
        "1": 30000,
        "2": 0,
        "3": 0,
        "4": 65000,
        "5": 65000
      },
      "byHour": {
        "9": 0,
        "10": 0,
        "11": 65000,
        "12": 0,
        "13": 0,
        "14": 0,
        "15": 0,
        "16": 65000,
        "18": 0,
        "20": 0,
        "21": 0,
        "22": 0,
        "23": 30000
      }
    },
    "revenuePerCustomerMetrics": {
      "totalCustomers": 14,
      "totalRevenue": 65000,
      "averageRevenuePerCustomer": 4642.86,
      "accountTypeMetrics": {
        "Club": {
          "totalRevenue": 0,
          "totalOrders": 6,
          "customerCount": 6,
          "revenues": [0, 0, 0, 0, 0, 0],
          "averageRevenuePerCustomer": 0,
          "averageOrdersPerCustomer": 1,
          "averageOrderValue": 0
        },
        "Association": {
          "totalRevenue": 65000,
          "totalOrders": 10,
          "customerCount": 8,
          "revenues": [0, 0, 0, 0, 0, 65000, 0, 0],
          "averageRevenuePerCustomer": 8125,
          "averageOrdersPerCustomer": 1.25,
          "averageOrderValue": 6500
        }
      }
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
  const analytics = await fetchRevenueAnalytics();
  console.log(
    "Total revenue:",
    analytics.monthlyQuarterlyRevenueTrends.totalRevenue
  );
} catch (error) {
  if (error instanceof Error) {
    console.error("Revenue analytics error:", error.message);
  }
}
```

## Use Cases

### Revenue Dashboard

```typescript
const RevenueDashboard = () => {
  const { data: analytics, isLoading, error } = useRevenueAnalytics();

  if (isLoading) return <div>Loading revenue analytics...</div>;
  if (error) return <div>Error loading revenue data</div>;

  const { monthlyQuarterlyRevenueTrends, revenueProjections } = analytics;

  return (
    <div className="revenue-dashboard">
      <div className="revenue-overview">
        <h3>Revenue Overview</h3>
        <div className="metrics">
          <MetricCard
            title="Total Revenue"
            value={`$${monthlyQuarterlyRevenueTrends.totalRevenue.toLocaleString()}`}
            trend="up"
          />
          <MetricCard
            title="Average Monthly Revenue"
            value={`$${monthlyQuarterlyRevenueTrends.averageMonthlyRevenue.toLocaleString()}`}
          />
          <MetricCard
            title="Growth Rate"
            value={`${revenueProjections.growthRate.toFixed(1)}%`}
            trend={revenueProjections.trend === "increasing" ? "up" : "down"}
          />
        </div>
      </div>

      <div className="revenue-projection">
        <h3>Revenue Projections</h3>
        <div className="projection-info">
          <span className="confidence">
            Confidence: {revenueProjections.confidence}
          </span>
          <span className="trend">Trend: {revenueProjections.trend}</span>
        </div>
        <div className="projections">
          {Object.entries(revenueProjections.projections).map(
            ([month, revenue]) => (
              <div key={month} className="projection-item">
                <span className="month">{month}</span>
                <span className="revenue">${revenue.toLocaleString()}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
```

### Revenue Trends Chart

```typescript
const RevenueTrendsChart = () => {
  const { data: analytics } = useRevenueAnalytics();

  const chartData = Object.entries(
    analytics.monthlyQuarterlyRevenueTrends.monthlyRevenue
  ).map(([month, revenue]) => ({
    month,
    revenue,
    orders:
      analytics.monthlyQuarterlyRevenueTrends.monthlyOrderCounts[month] || 0,
  }));

  return (
    <MultiLineChart
      data={chartData}
      xKey="month"
      yKeys={["revenue"]}
      title="Monthly Revenue Trends"
      colors={["#10B981"]}
      secondaryYKey="orders"
      secondaryYLabel="Orders"
    />
  );
};
```

### Revenue by Tier Widget

```typescript
const RevenueByTierWidget = () => {
  const { data: analytics } = useRevenueAnalytics();

  const { revenueBySubscriptionTier } = analytics;

  return (
    <div className="revenue-by-tier">
      <h3>Revenue by Subscription Tier</h3>
      <div className="tier-breakdown">
        {Object.entries(revenueBySubscriptionTier.revenueByTier).map(
          ([tier, revenue]) => (
            <div key={tier} className="tier-item">
              <div className="tier-info">
                <span className="tier-name">{tier}</span>
                <span className="tier-revenue">
                  ${revenue.toLocaleString()}
                </span>
              </div>
              <div className="tier-bar">
                <div
                  className="bar-fill"
                  style={{
                    width: `${revenueBySubscriptionTier.revenueDistribution[tier]}%`,
                  }}
                />
                <span className="percentage">
                  {revenueBySubscriptionTier.revenueDistribution[tier].toFixed(
                    1
                  )}
                  %
                </span>
              </div>
              <div className="tier-details">
                <span>
                  Orders: {revenueBySubscriptionTier.orderCountsByTier[tier]}
                </span>
                <span>
                  Avg: $
                  {revenueBySubscriptionTier.averageOrderValueByTier[
                    tier
                  ].toLocaleString()}
                </span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
```

### Customer Lifetime Value Widget

```typescript
const CLVWidget = () => {
  const { data: analytics } = useRevenueAnalytics();

  const { customerLifetimeValueAnalysis } = analytics;

  return (
    <div className="clv-widget">
      <h3>Customer Lifetime Value</h3>
      <div className="clv-overview">
        <div className="clv-metric">
          <span className="label">Average CLV</span>
          <span className="value">
            ${customerLifetimeValueAnalysis.averageCLV.toLocaleString()}
          </span>
        </div>
        <div className="clv-metric">
          <span className="label">Median CLV</span>
          <span className="value">
            ${customerLifetimeValueAnalysis.medianCLV.toLocaleString()}
          </span>
        </div>
        <div className="clv-metric">
          <span className="label">Total Customers</span>
          <span className="value">
            {customerLifetimeValueAnalysis.totalCustomers}
          </span>
        </div>
      </div>

      <div className="clv-by-account-type">
        <h4>CLV by Account Type</h4>
        {Object.entries(customerLifetimeValueAnalysis.clvByAccountType).map(
          ([type, data]) => (
            <div key={type} className="account-type-clv">
              <span className="type">{type}</span>
              <span className="clv">${data.averageCLV.toLocaleString()}</span>
              <span className="customers">
                ({data.customerCount} customers)
              </span>
            </div>
          )
        )}
      </div>

      <div className="clv-distribution">
        <h4>CLV Distribution</h4>
        <div className="distribution-bars">
          <div className="distribution-item">
            <span className="segment">High Value</span>
            <div className="bar">
              <div
                className="fill high"
                style={{
                  width: `${customerLifetimeValueAnalysis.customerDistribution.highValuePercentage}%`,
                }}
              />
              <span className="percentage">
                {customerLifetimeValueAnalysis.customerDistribution.highValuePercentage.toFixed(
                  1
                )}
                %
              </span>
            </div>
          </div>
          <div className="distribution-item">
            <span className="segment">Medium Value</span>
            <div className="bar">
              <div
                className="fill medium"
                style={{
                  width: `${customerLifetimeValueAnalysis.customerDistribution.mediumValuePercentage}%`,
                }}
              />
              <span className="percentage">
                {customerLifetimeValueAnalysis.customerDistribution.mediumValuePercentage.toFixed(
                  1
                )}
                %
              </span>
            </div>
          </div>
          <div className="distribution-item">
            <span className="segment">Low Value</span>
            <div className="bar">
              <div
                className="fill low"
                style={{
                  width: `${customerLifetimeValueAnalysis.customerDistribution.lowValuePercentage}%`,
                }}
              />
              <span className="percentage">
                {customerLifetimeValueAnalysis.customerDistribution.lowValuePercentage.toFixed(
                  1
                )}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## Performance Notes

- **Caching**: Recommended 5-minute cache for revenue widgets
- **Real-time**: Not real-time, suitable for periodic updates
- **Data Volume**: High - consider loading states for large datasets
- **Error Recovery**: Implement retry logic for network failures

## Future Enhancements

- **Phase 2**: Authentication and rate limiting
- **Phase 3**: Real-time revenue updates
- **Phase 4**: Revenue forecasting models
- **Phase 5**: Revenue optimization recommendations
