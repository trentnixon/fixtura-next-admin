# Cohort Analysis Endpoint

## Overview

Provides comprehensive customer cohort analysis including acquisition cohorts, retention analysis, lifecycle stages, revenue patterns, churn analysis, and customer segmentation.

## Endpoint Details

- **URL**: `GET /api/orders/analytics/cohort-analysis`
- **Purpose**: Customer retention and lifecycle analysis
- **Response Time**: <2 seconds
- **Data Volume**: High (all customer data)
- **Authentication**: Currently `auth: false` (Phase 2)

## TypeScript Types

```typescript
interface CohortAnalysisResponse {
  data: CohortAnalysis;
  error?: never;
}

interface CohortAnalysis {
  // Customer Acquisition Cohorts
  acquisitionCohorts: {
    monthlyCohorts: Record<string, CohortData>;
    quarterlyCohorts: Record<string, CohortData>;
    totalCohorts: number;
    totalAccounts: number;
  };

  // Retention Analysis by Cohort
  retentionAnalysis: {
    retentionRates: Record<string, RetentionData>;
    overallRetentionMetrics: OverallRetentionMetrics;
  };

  // Customer Lifecycle Stages
  lifecycleStages: {
    lifecycleStages: LifecycleStageData;
    stageMetrics: Record<string, StageMetrics>;
    totalAccounts: number;
  };

  // Cohort Revenue Patterns
  cohortRevenuePatterns: {
    cohortRevenue: Record<string, CohortRevenueData>;
    monthlyRevenue: Record<string, number>;
    totalRevenue: number;
    averageRevenuePerCohort: number;
  };

  // Churn Analysis by Cohort
  churnAnalysis: {
    churnAnalysis: Record<string, ChurnData>;
    overallChurnMetrics: OverallChurnMetrics;
  };

  // Cohort Performance Metrics
  cohortPerformanceMetrics: {
    performanceMetrics: Record<string, PerformanceMetrics>;
    overallPerformance: OverallPerformanceMetrics;
  };

  // Customer Lifetime Value by Cohort
  clvByCohort: {
    clvByCohort: Record<string, CohortCLVData>;
    overallCLVMetrics: OverallCLVMetrics;
  };

  // Cohort Conversion Funnels
  conversionFunnels: {
    conversionFunnels: Record<string, ConversionFunnelData>;
    overallConversionMetrics: OverallConversionMetrics;
  };

  // Cohort Engagement Patterns
  engagementPatterns: {
    engagementPatterns: Record<string, EngagementData>;
    overallEngagementMetrics: OverallEngagementMetrics;
  };

  // Cohort Segmentation
  cohortSegmentation: {
    segments: SegmentData;
    segmentMetrics: Record<string, SegmentMetrics>;
    totalAccounts: number;
  };

  // Metadata
  generatedAt: string;
  dataPoints: {
    totalAccounts: number;
    totalOrders: number;
    subscriptionTiers: number;
    trialInstances: number;
  };
}

interface CohortData {
  totalAccounts: number;
  accountTypes: Record<string, number>;
  accountTypeDistribution: Record<string, number>;
  averageAccountAge: number;
}

interface RetentionData {
  cohortSize: number;
  retention: Record<string, RetentionPeriod>;
  averageRetentionRate: number;
}

interface RetentionPeriod {
  activeAccounts: number;
  totalAccounts: number;
  retentionRate: number;
}

interface OverallRetentionMetrics {
  totalAccounts: number;
  averageRetentionRate: number;
  totalCohorts: number;
}

interface LifecycleStageData {
  new: any[];
  trial: any[];
  active: any[];
  churned: any[];
  dormant: any[];
}

interface StageMetrics {
  count: number;
  percentage: number;
  averageAge: number;
  accountTypes: Record<string, number>;
}

interface CohortRevenueData {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  averageRevenuePerAccount: number;
  revenuePerAccount: AccountRevenueData[];
}

interface AccountRevenueData {
  accountId: number;
  revenue: number;
  orderCount: number;
}

interface ChurnData {
  totalAccounts: number;
  activeAccounts: number;
  dormantAccounts: number;
  churnedAccounts: number;
  churnRate: number;
  retentionRate: number;
  averageAccountAge: number;
}

interface OverallChurnMetrics {
  totalAccounts: number;
  totalChurned: number;
  averageChurnRate: number;
  totalCohorts: number;
}

interface PerformanceMetrics {
  totalAccounts: number;
  convertedAccounts: number;
  conversionRate: number;
  totalRevenue: number;
  totalOrders: number;
  averageRevenuePerAccount: number;
  averageOrdersPerAccount: number;
  averageOrderValue: number;
  cohortAge: number;
}

interface OverallPerformanceMetrics {
  totalAccounts: number;
  totalConverted: number;
  averageConversionRate: number;
  totalCohorts: number;
}

interface CohortCLVData {
  totalAccounts: number;
  totalCLV: number;
  averageCLV: number;
  medianCLV: number;
  customerValues: number[];
  clvDistribution: CLVDistribution;
}

interface CLVDistribution {
  lowValue: number;
  mediumValue: number;
  highValue: number;
  lowValuePercentage: number;
  mediumValuePercentage: number;
  highValuePercentage: number;
}

interface OverallCLVMetrics {
  totalAccounts: number;
  totalCLV: number;
  averageCLV: number;
  totalCohorts: number;
}

interface ConversionFunnelData {
  totalAccounts: number;
  trialStarted: number;
  trialCompleted: number;
  trialConverted: number;
  directConversion: number;
  totalConverted: number;
  trialToConversionRate: number;
  overallConversionRate: number;
  directConversionRate: number;
}

interface OverallConversionMetrics {
  totalAccounts: number;
  totalConverted: number;
  averageConversionRate: number;
  totalCohorts: number;
}

interface EngagementData {
  totalAccounts: number;
  engagedAccounts: number;
  highlyEngagedAccounts: number;
  averageOrdersPerAccount: number;
  averageDaysToFirstOrder: number;
  averageDaysBetweenOrders: number;
}

interface OverallEngagementMetrics {
  totalAccounts: number;
  totalEngaged: number;
  averageEngagementRate: number;
  totalCohorts: number;
}

interface SegmentData {
  highValue: any[];
  mediumValue: any[];
  lowValue: any[];
  trialOnly: any[];
  neverConverted: any[];
}

interface SegmentMetrics {
  count: number;
  percentage: number;
  averageAge: number;
  accountTypes: Record<string, number>;
}
```

## Usage Examples

### React Hook

```typescript
import { useQuery } from "@tanstack/react-query";

export const useCohortAnalysis = () => {
  return useQuery({
    queryKey: ["analytics", "cohort"],
    queryFn: async (): Promise<CohortAnalysis> => {
      const response = await fetch("/api/orders/analytics/cohort-analysis");
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Failed to fetch cohort analysis`
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

export const useCohortAnalysis = () => {
  const { data, error, isFetching, execute } = useFetch(
    "/api/orders/analytics/cohort-analysis"
  ).json<CohortAnalysisResponse>();

  return {
    analysis: computed(() => data.value?.data),
    loading: isFetching,
    error: computed(() => error.value),
    refetch: execute,
  };
};
```

### Vanilla JavaScript

```typescript
async function fetchCohortAnalysis(): Promise<CohortAnalysis> {
  try {
    const response = await fetch("/api/orders/analytics/cohort-analysis");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result: CohortAnalysisResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch cohort analysis:", error);
    throw error;
  }
}
```

## Response Example

```json
{
  "data": {
    "acquisitionCohorts": {
      "monthlyCohorts": {
        "2025-08": {
          "totalAccounts": 2,
          "accountTypes": {
            "Club": 2
          },
          "accountTypeDistribution": {
            "Club": 100
          },
          "averageAccountAge": 85
        },
        "2025-09": {
          "totalAccounts": 8,
          "accountTypes": {
            "Association": 8
          },
          "accountTypeDistribution": {
            "Association": 100
          },
          "averageAccountAge": 45
        },
        "2025-10": {
          "totalAccounts": 4,
          "accountTypes": {
            "Club": 4
          },
          "accountTypeDistribution": {
            "Club": 100
          },
          "averageAccountAge": 4
        }
      },
      "quarterlyCohorts": {
        "2025-Q3": {
          "totalAccounts": 10,
          "accountTypes": {
            "Club": 2,
            "Association": 8
          },
          "accountTypeDistribution": {
            "Club": 20,
            "Association": 80
          },
          "averageAccountAge": 65
        },
        "2025-Q4": {
          "totalAccounts": 4,
          "accountTypes": {
            "Club": 4
          },
          "accountTypeDistribution": {
            "Club": 100
          },
          "averageAccountAge": 4
        }
      },
      "totalCohorts": 3,
      "totalAccounts": 14
    },
    "retentionAnalysis": {
      "retentionRates": {
        "2025-08": {
          "cohortSize": 2,
          "retention": {
            "1Month": {
              "activeAccounts": 2,
              "totalAccounts": 2,
              "retentionRate": 100
            },
            "3Month": {
              "activeAccounts": 2,
              "totalAccounts": 2,
              "retentionRate": 100
            }
          },
          "averageRetentionRate": 100
        },
        "2025-09": {
          "cohortSize": 8,
          "retention": {
            "1Month": {
              "activeAccounts": 8,
              "totalAccounts": 8,
              "retentionRate": 100
            },
            "3Month": {
              "activeAccounts": 8,
              "totalAccounts": 8,
              "retentionRate": 100
            }
          },
          "averageRetentionRate": 100
        },
        "2025-10": {
          "cohortSize": 4,
          "retention": {
            "1Month": {
              "activeAccounts": 4,
              "totalAccounts": 4,
              "retentionRate": 100
            },
            "3Month": {
              "activeAccounts": 4,
              "totalAccounts": 4,
              "retentionRate": 100
            }
          },
          "averageRetentionRate": 100
        }
      },
      "overallRetentionMetrics": {
        "totalAccounts": 14,
        "averageRetentionRate": 100,
        "totalCohorts": 3
      }
    },
    "lifecycleStages": {
      "lifecycleStages": {
        "new": [],
        "trial": [1],
        "active": [8],
        "churned": [5],
        "dormant": [0]
      },
      "stageMetrics": {
        "trial": {
          "count": 1,
          "percentage": 7.14,
          "averageAge": 4,
          "accountTypes": {
            "Club": 1
          }
        },
        "active": {
          "count": 8,
          "percentage": 57.14,
          "averageAge": 45,
          "accountTypes": {
            "Association": 8
          }
        },
        "churned": {
          "count": 5,
          "percentage": 35.71,
          "averageAge": 85,
          "accountTypes": {
            "Club": 5
          }
        }
      },
      "totalAccounts": 14
    },
    "cohortRevenuePatterns": {
      "cohortRevenue": {
        "2025-08": {
          "totalRevenue": 0,
          "orderCount": 0,
          "averageOrderValue": 0,
          "averageRevenuePerAccount": 0,
          "revenuePerAccount": []
        },
        "2025-09": {
          "totalRevenue": 65000,
          "orderCount": 10,
          "averageOrderValue": 6500,
          "averageRevenuePerAccount": 8125,
          "revenuePerAccount": [
            {
              "accountId": 430,
              "revenue": 65000,
              "orderCount": 10
            }
          ]
        },
        "2025-10": {
          "totalRevenue": 0,
          "orderCount": 0,
          "averageOrderValue": 0,
          "averageRevenuePerAccount": 0,
          "revenuePerAccount": []
        }
      },
      "monthlyRevenue": {
        "2025-08": 0,
        "2025-09": 65000,
        "2025-10": 0
      },
      "totalRevenue": 65000,
      "averageRevenuePerCohort": 21666.67
    },
    "churnAnalysis": {
      "churnAnalysis": {
        "2025-08": {
          "totalAccounts": 2,
          "churnedAccounts": 2,
          "churnRate": 100,
          "retentionRate": 0,
          "averageAccountAge": 85
        },
        "2025-09": {
          "totalAccounts": 8,
          "churnedAccounts": 0,
          "churnRate": 0,
          "retentionRate": 100,
          "averageAccountAge": 45
        },
        "2025-10": {
          "totalAccounts": 4,
          "churnedAccounts": 3,
          "churnRate": 75,
          "retentionRate": 25,
          "averageAccountAge": 4
        }
      },
      "overallChurnMetrics": {
        "totalAccounts": 14,
        "totalChurned": 5,
        "averageChurnRate": 58.33,
        "totalCohorts": 3
      }
    },
    "cohortPerformanceMetrics": {
      "performanceMetrics": {
        "2025-08": {
          "totalAccounts": 2,
          "convertedAccounts": 0,
          "conversionRate": 0,
          "totalRevenue": 0,
          "totalOrders": 0,
          "averageRevenuePerAccount": 0,
          "averageOrdersPerAccount": 0,
          "averageOrderValue": 0,
          "cohortAge": 85
        },
        "2025-09": {
          "totalAccounts": 8,
          "convertedAccounts": 8,
          "conversionRate": 100,
          "totalRevenue": 65000,
          "totalOrders": 10,
          "averageRevenuePerAccount": 8125,
          "averageOrdersPerAccount": 1.25,
          "averageOrderValue": 6500,
          "cohortAge": 45
        },
        "2025-10": {
          "totalAccounts": 4,
          "convertedAccounts": 0,
          "conversionRate": 0,
          "totalRevenue": 0,
          "totalOrders": 0,
          "averageRevenuePerAccount": 0,
          "averageOrdersPerAccount": 0,
          "averageOrderValue": 0,
          "cohortAge": 4
        }
      },
      "overallPerformance": {
        "totalAccounts": 14,
        "totalConverted": 8,
        "averageConversionRate": 57.14,
        "totalCohorts": 3
      }
    },
    "clvByCohort": {
      "clvByCohort": {
        "2025-08": {
          "totalAccounts": 2,
          "totalCLV": 0,
          "averageCLV": 0,
          "medianCLV": 0,
          "customerValues": [0, 0],
          "clvDistribution": {
            "lowValue": 0,
            "mediumValue": 0,
            "highValue": 0,
            "lowValuePercentage": 0,
            "mediumValuePercentage": 0,
            "highValuePercentage": 0
          }
        },
        "2025-09": {
          "totalAccounts": 8,
          "totalCLV": 65000,
          "averageCLV": 8125,
          "medianCLV": 0,
          "customerValues": [0, 0, 0, 0, 0, 65000, 0, 0],
          "clvDistribution": {
            "lowValue": 0,
            "mediumValue": 0,
            "highValue": 65000,
            "lowValuePercentage": 0,
            "mediumValuePercentage": 0,
            "highValuePercentage": 100
          }
        },
        "2025-10": {
          "totalAccounts": 4,
          "totalCLV": 0,
          "averageCLV": 0,
          "medianCLV": 0,
          "customerValues": [0, 0, 0, 0],
          "clvDistribution": {
            "lowValue": 0,
            "mediumValue": 0,
            "highValue": 0,
            "lowValuePercentage": 0,
            "mediumValuePercentage": 0,
            "highValuePercentage": 0
          }
        }
      },
      "overallCLVMetrics": {
        "totalAccounts": 14,
        "totalCLV": 65000,
        "averageCLV": 4642.86,
        "totalCohorts": 3
      }
    },
    "conversionFunnels": {
      "conversionFunnels": {
        "2025-08": {
          "totalAccounts": 2,
          "trialStarted": 0,
          "trialCompleted": 0,
          "trialConverted": 0,
          "directConversion": 0,
          "totalConverted": 0,
          "trialToConversionRate": 0,
          "overallConversionRate": 0,
          "directConversionRate": 0
        },
        "2025-09": {
          "totalAccounts": 8,
          "trialStarted": 8,
          "trialCompleted": 7,
          "trialConverted": 1,
          "directConversion": 7,
          "totalConverted": 8,
          "trialToConversionRate": 14.29,
          "overallConversionRate": 100,
          "directConversionRate": 87.5
        },
        "2025-10": {
          "totalAccounts": 4,
          "trialStarted": 1,
          "trialCompleted": 0,
          "trialConverted": 0,
          "directConversion": 0,
          "totalConverted": 0,
          "trialToConversionRate": 0,
          "overallConversionRate": 0,
          "directConversionRate": 0
        }
      },
      "overallConversionMetrics": {
        "totalAccounts": 14,
        "totalConverted": 8,
        "averageConversionRate": 57.14,
        "totalCohorts": 3
      }
    },
    "engagementPatterns": {
      "engagementPatterns": {
        "2025-08": {
          "totalAccounts": 2,
          "engagedAccounts": 0,
          "highlyEngagedAccounts": 0,
          "averageOrdersPerAccount": 0,
          "averageDaysToFirstOrder": 0,
          "averageDaysBetweenOrders": 0
        },
        "2025-09": {
          "totalAccounts": 8,
          "engagedAccounts": 8,
          "highlyEngagedAccounts": 1,
          "averageOrdersPerAccount": 1.25,
          "averageDaysToFirstOrder": 0,
          "averageDaysBetweenOrders": 0
        },
        "2025-10": {
          "totalAccounts": 4,
          "engagedAccounts": 0,
          "highlyEngagedAccounts": 0,
          "averageOrdersPerAccount": 0,
          "averageDaysToFirstOrder": 0,
          "averageDaysBetweenOrders": 0
        }
      },
      "overallEngagementMetrics": {
        "totalAccounts": 14,
        "totalEngaged": 8,
        "averageEngagementRate": 0.57,
        "totalCohorts": 3
      }
    },
    "cohortSegmentation": {
      "segments": {
        "highValue": [],
        "mediumValue": [1],
        "lowValue": [],
        "trialOnly": [1],
        "neverConverted": [12]
      },
      "segmentMetrics": {
        "mediumValue": {
          "count": 1,
          "percentage": 7.14,
          "averageAge": 45,
          "accountTypes": {
            "Association": 1
          }
        },
        "trialOnly": {
          "count": 1,
          "percentage": 7.14,
          "averageAge": 4,
          "accountTypes": {
            "Club": 1
          }
        },
        "neverConverted": {
          "count": 12,
          "percentage": 85.71,
          "averageAge": 45,
          "accountTypes": {
            "Club": 5,
            "Association": 7
          }
        }
      },
      "totalAccounts": 14
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
  const analysis = await fetchCohortAnalysis();
  console.log("Total cohorts:", analysis.acquisitionCohorts.totalCohorts);
} catch (error) {
  if (error instanceof Error) {
    console.error("Cohort analysis error:", error.message);
  }
}
```

## Use Cases

### Cohort Retention Dashboard

```typescript
const CohortRetentionWidget = () => {
  const { data: analysis, isLoading, error } = useCohortAnalysis();

  if (isLoading) return <div>Loading cohort analysis...</div>;
  if (error) return <div>Error loading cohort data</div>;

  const { retentionAnalysis, acquisitionCohorts } = analysis;

  return (
    <div className="cohort-retention-dashboard">
      <div className="retention-overview">
        <h3>Cohort Retention Analysis</h3>
        <div className="metrics">
          <MetricCard
            title="Average Retention Rate"
            value={`${retentionAnalysis.overallRetentionMetrics.averageRetentionRate.toFixed(
              1
            )}%`}
            trend="up"
          />
          <MetricCard
            title="Total Cohorts"
            value={retentionAnalysis.overallRetentionMetrics.totalCohorts}
          />
          <MetricCard
            title="Total Accounts"
            value={retentionAnalysis.overallRetentionMetrics.totalAccounts}
          />
        </div>
      </div>

      <div className="cohort-breakdown">
        <h3>Cohort Breakdown</h3>
        {Object.entries(retentionAnalysis.retentionRates).map(
          ([cohort, data]) => (
            <div key={cohort} className="cohort-item">
              <div className="cohort-header">
                <span className="cohort-name">{cohort}</span>
                <span className="cohort-size">{data.cohortSize} accounts</span>
              </div>
              <div className="retention-stages">
                {Object.entries(data.retention).map(([period, retention]) => (
                  <div key={period} className="retention-stage">
                    <span className="period">{period}</span>
                    <div className="retention-bar">
                      <div
                        className="bar-fill"
                        style={{ width: `${retention.retentionRate}%` }}
                      />
                      <span className="rate">
                        {retention.retentionRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
```

### Lifecycle Stages Widget

```typescript
const LifecycleStagesWidget = () => {
  const { data: analysis } = useCohortAnalysis();

  const { lifecycleStages } = analysis;

  return (
    <div className="lifecycle-stages-widget">
      <h3>Customer Lifecycle Stages</h3>
      <div className="stages-overview">
        {Object.entries(lifecycleStages.stageMetrics).map(
          ([stage, metrics]) => (
            <div key={stage} className={`stage-card ${stage}`}>
              <div className="stage-header">
                <h4>{stage.charAt(0).toUpperCase() + stage.slice(1)}</h4>
                <span className="count">{metrics.count}</span>
              </div>
              <div className="stage-metrics">
                <div className="metric">
                  <span className="label">Percentage:</span>
                  <span className="value">
                    {metrics.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="metric">
                  <span className="label">Avg Age:</span>
                  <span className="value">{metrics.averageAge} days</span>
                </div>
              </div>
              <div className="account-types">
                {Object.entries(metrics.accountTypes).map(([type, count]) => (
                  <div key={type} className="account-type">
                    <span className="type">{type}</span>
                    <span className="count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
```

### Cohort Performance Chart

```typescript
const CohortPerformanceChart = () => {
  const { data: analysis } = useCohortAnalysis();

  const chartData = Object.entries(
    analysis.cohortPerformanceMetrics.performanceMetrics
  ).map(([cohort, metrics]) => ({
    cohort,
    conversionRate: metrics.conversionRate,
    averageRevenue: metrics.averageRevenuePerAccount,
    totalAccounts: metrics.totalAccounts,
  }));

  return (
    <MultiBarChart
      data={chartData}
      xKey="cohort"
      yKeys={["conversionRate", "averageRevenue"]}
      title="Cohort Performance Comparison"
      colors={["#10B981", "#3B82F6"]}
      yLabels={["Conversion Rate (%)", "Avg Revenue ($)"]}
    />
  );
};
```

### Customer Segmentation Widget

```typescript
const CustomerSegmentationWidget = () => {
  const { data: analysis } = useCohortAnalysis();

  const { cohortSegmentation } = analysis;

  return (
    <div className="customer-segmentation">
      <h3>Customer Segmentation</h3>
      <div className="segments">
        {Object.entries(cohortSegmentation.segmentMetrics).map(
          ([segment, metrics]) => (
            <div key={segment} className={`segment-card ${segment}`}>
              <div className="segment-header">
                <h4>{segment.charAt(0).toUpperCase() + segment.slice(1)}</h4>
                <span className="count">{metrics.count} customers</span>
              </div>
              <div className="segment-metrics">
                <div className="metric">
                  <span className="label">Percentage:</span>
                  <span className="value">
                    {metrics.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="metric">
                  <span className="label">Avg Age:</span>
                  <span className="value">{metrics.averageAge} days</span>
                </div>
              </div>
              <div className="account-types">
                <h5>Account Types:</h5>
                {Object.entries(metrics.accountTypes).map(([type, count]) => (
                  <div key={type} className="account-type">
                    <span className="type">{type}</span>
                    <span className="count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
```

## Performance Notes

- **Caching**: Recommended 10-minute cache for cohort widgets
- **Real-time**: Not real-time, suitable for periodic updates
- **Data Volume**: High - consider loading states for large datasets
- **Error Recovery**: Implement retry logic for network failures

## Future Enhancements

- **Phase 2**: Authentication and rate limiting
- **Phase 3**: Real-time cohort updates
- **Phase 4**: Predictive retention modeling
- **Phase 5**: Cohort comparison tools
