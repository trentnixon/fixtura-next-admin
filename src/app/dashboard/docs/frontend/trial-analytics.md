# Trial Analytics Endpoint

## Overview

Provides detailed insights into trial usage patterns, conversion funnels, trial success predictors, engagement metrics, and trial performance analysis.

## Endpoint Details

- **URL**: `GET /api/orders/analytics/trial-analytics`
- **Purpose**: Trial conversion and usage analysis
- **Response Time**: <1 second
- **Data Volume**: Medium (trial data)
- **Authentication**: Currently `auth: false` (Phase 2)

## TypeScript Types

```typescript
interface TrialAnalyticsResponse {
  data: TrialAnalytics;
  error?: never;
}

interface TrialAnalytics {
  // Trial Start/End Patterns
  trialStartEndPatterns: {
    totalTrials: number;
    activeTrials: number;
    completedTrials: number;
    trialsByMonth: Record<string, number>;
    averageTrialDuration: number;
    trialStartTrends: TrialTrend[];
    trialEndTrends: TrialTrend[];
  };

  // Conversion Rates by Account Type
  conversionRatesByAccountType: {
    overallConversionRate: number;
    conversionByAccountType: Record<string, number>;
    conversionByTier: Record<string, number>;
    conversionBySport: Record<string, number>;
    conversionTimeline: ConversionTimeline[];
  };

  // Trial Duration Analysis
  trialDurationAnalysis: {
    averageDuration: number;
    medianDuration: number;
    durationDistribution: Record<string, number>;
    optimalDuration: number;
    durationVsConversion: DurationConversion[];
    shortTrials: number;
    longTrials: number;
  };

  // Trial to Paid Conversion Funnels
  trialToPaidConversionFunnels: {
    totalTrials: number;
    convertedTrials: number;
    conversionRate: number;
    funnelStages: FunnelStage[];
    dropOffPoints: DropOffPoint[];
    conversionPaths: ConversionPath[];
  };

  // Trial Abandonment Reasons
  trialAbandonmentReasons: {
    totalAbandoned: number;
    abandonmentRate: number;
    reasons: Record<string, number>;
    abandonmentByAccountType: Record<string, number>;
    abandonmentTimeline: AbandonmentTimeline[];
  };

  // Trial Success Predictors
  trialSuccessPredictors: {
    accountTypeImpact: Record<string, number>;
    trialDurationImpact: Record<string, number>;
    engagementImpact: Record<string, number>;
    timingImpact: Record<string, number>;
    successFactors: SuccessFactor[];
    riskFactors: RiskFactor[];
  };

  // Trial Engagement Metrics
  trialEngagementMetrics: {
    averageEngagement: number;
    engagementByAccountType: Record<string, number>;
    engagementByTier: Record<string, number>;
    engagementTrends: EngagementTrend[];
    highEngagementTrials: number;
    lowEngagementTrials: number;
  };

  // Trial Cohort Analysis
  trialCohortAnalysis: {
    cohorts: TrialCohort[];
    averageCohortConversion: number;
    cohortTrends: CohortTrend[];
    retentionByCohort: Record<string, number>;
  };

  // Trial Performance by Tier
  trialPerformanceByTier: {
    performanceByTier: Record<string, TrialTierPerformance>;
    bestPerformingTier: string;
    worstPerformingTier: string;
    tierComparison: TierComparison[];
  };

  // Trial Conversion Timeline
  trialConversionTimeline: {
    conversionsByDay: Record<string, number>;
    conversionsByWeek: Record<string, number>;
    conversionsByMonth: Record<string, number>;
    peakConversionTimes: string[];
    conversionPatterns: ConversionPattern[];
  };

  // Metadata
  generatedAt: string;
  dataPoints: {
    totalTrials: number;
    totalAccounts: number;
    subscriptionTiers: number;
  };
}

interface TrialTrend {
  period: string;
  count: number;
  trend: "increasing" | "decreasing" | "stable";
}

interface ConversionTimeline {
  period: string;
  trials: number;
  conversions: number;
  conversionRate: number;
}

interface DurationConversion {
  durationRange: string;
  trials: number;
  conversions: number;
  conversionRate: number;
}

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropOffRate: number;
}

interface DropOffPoint {
  stage: string;
  dropOffCount: number;
  dropOffRate: number;
  reasons: string[];
}

interface ConversionPath {
  path: string[];
  count: number;
  conversionRate: number;
  averageDuration: number;
}

interface AbandonmentTimeline {
  period: string;
  abandonments: number;
  abandonmentRate: number;
  reasons: Record<string, number>;
}

interface SuccessFactor {
  factor: string;
  impact: number;
  description: string;
  recommendations: string[];
}

interface RiskFactor {
  factor: string;
  risk: number;
  description: string;
  mitigation: string[];
}

interface EngagementTrend {
  period: string;
  averageEngagement: number;
  trend: "increasing" | "decreasing" | "stable";
}

interface TrialCohort {
  cohort: string;
  totalTrials: number;
  conversions: number;
  conversionRate: number;
  averageDuration: number;
}

interface CohortTrend {
  period: string;
  conversionRate: number;
  trend: "improving" | "declining" | "stable";
}

interface TrialTierPerformance {
  trials: number;
  conversions: number;
  conversionRate: number;
  averageDuration: number;
  engagement: number;
}

interface TierComparison {
  tier: string;
  performance: number;
  ranking: number;
  strengths: string[];
  weaknesses: string[];
}

interface ConversionPattern {
  pattern: string;
  frequency: number;
  successRate: number;
  description: string;
}
```

## Usage Examples

### React Hook

```typescript
import { useQuery } from "@tanstack/react-query";

export const useTrialAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "trial"],
    queryFn: async (): Promise<TrialAnalytics> => {
      const response = await fetch("/api/orders/analytics/trial-analytics");
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Failed to fetch trial analytics`
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

export const useTrialAnalytics = () => {
  const { data, error, isFetching, execute } = useFetch(
    "/api/orders/analytics/trial-analytics"
  ).json<TrialAnalyticsResponse>();

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
async function fetchTrialAnalytics(): Promise<TrialAnalytics> {
  try {
    const response = await fetch("/api/orders/analytics/trial-analytics");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result: TrialAnalyticsResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch trial analytics:", error);
    throw error;
  }
}
```

## Response Example

```json
{
  "data": {
    "trialStartEndPatterns": {
      "totalTrials": 13,
      "activeTrials": 1,
      "completedTrials": 12,
      "trialsByMonth": {
        "2025-10": 1,
        "2025-09": 12
      },
      "averageTrialDuration": 14,
      "trialStartTrends": [
        {
          "period": "2025-09",
          "count": 12,
          "trend": "stable"
        },
        {
          "period": "2025-10",
          "count": 1,
          "trend": "decreasing"
        }
      ],
      "trialEndTrends": [
        {
          "period": "2025-09",
          "count": 12,
          "trend": "stable"
        }
      ]
    },
    "conversionRatesByAccountType": {
      "overallConversionRate": 7.69,
      "conversionByAccountType": {
        "Club": 0,
        "Association": 12.5
      },
      "conversionByTier": {
        "Free Trial": 7.69
      },
      "conversionBySport": {
        "Cricket": 7.69
      },
      "conversionTimeline": [
        {
          "period": "2025-09",
          "trials": 12,
          "conversions": 1,
          "conversionRate": 8.33
        },
        {
          "period": "2025-10",
          "trials": 1,
          "conversions": 0,
          "conversionRate": 0
        }
      ]
    },
    "trialDurationAnalysis": {
      "averageDuration": 14,
      "medianDuration": 14,
      "durationDistribution": {
        "14": 100
      },
      "optimalDuration": 14,
      "durationVsConversion": [
        {
          "durationRange": "14 days",
          "trials": 13,
          "conversions": 1,
          "conversionRate": 7.69
        }
      ],
      "shortTrials": 0,
      "longTrials": 0
    },
    "trialToPaidConversionFunnels": {
      "totalTrials": 13,
      "convertedTrials": 1,
      "conversionRate": 7.69,
      "funnelStages": [
        {
          "stage": "Trial Started",
          "count": 13,
          "percentage": 100,
          "dropOffRate": 0
        },
        {
          "stage": "Trial Completed",
          "count": 12,
          "percentage": 92.31,
          "dropOffRate": 7.69
        },
        {
          "stage": "Conversion",
          "count": 1,
          "percentage": 7.69,
          "dropOffRate": 84.62
        }
      ],
      "dropOffPoints": [
        {
          "stage": "Trial Completion",
          "dropOffCount": 1,
          "dropOffRate": 7.69,
          "reasons": ["Trial expired without conversion"]
        },
        {
          "stage": "Conversion",
          "dropOffCount": 11,
          "dropOffRate": 84.62,
          "reasons": ["No paid subscription created"]
        }
      ],
      "conversionPaths": [
        {
          "path": ["Free Trial", "Season Pass"],
          "count": 1,
          "conversionRate": 100,
          "averageDuration": 14
        }
      ]
    },
    "trialAbandonmentReasons": {
      "totalAbandoned": 12,
      "abandonmentRate": 92.31,
      "reasons": {
        "Trial expired without conversion": 12
      },
      "abandonmentByAccountType": {
        "Club": 100,
        "Association": 87.5
      },
      "abandonmentTimeline": [
        {
          "period": "2025-09",
          "abandonments": 12,
          "abandonmentRate": 100,
          "reasons": {
            "Trial expired without conversion": 12
          }
        }
      ]
    },
    "trialSuccessPredictors": {
      "accountTypeImpact": {
        "Association": 12.5,
        "Club": 0
      },
      "trialDurationImpact": {
        "14 days": 7.69
      },
      "engagementImpact": {},
      "timingImpact": {},
      "successFactors": [
        {
          "factor": "Account Type",
          "impact": 12.5,
          "description": "Association accounts have higher conversion rates",
          "recommendations": [
            "Focus marketing on Association accounts",
            "Develop Club-specific trial strategies"
          ]
        }
      ],
      "riskFactors": [
        {
          "factor": "Club Account Type",
          "risk": 100,
          "description": "Club accounts show 0% conversion rate",
          "mitigation": [
            "Investigate Club account needs",
            "Develop Club-specific trial experience"
          ]
        }
      ]
    },
    "trialEngagementMetrics": {
      "averageEngagement": 0,
      "engagementByAccountType": {},
      "engagementByTier": {},
      "engagementTrends": [],
      "highEngagementTrials": 0,
      "lowEngagementTrials": 13
    },
    "trialCohortAnalysis": {
      "cohorts": [
        {
          "cohort": "2025-09",
          "totalTrials": 12,
          "conversions": 1,
          "conversionRate": 8.33,
          "averageDuration": 14
        },
        {
          "cohort": "2025-10",
          "totalTrials": 1,
          "conversions": 0,
          "conversionRate": 0,
          "averageDuration": 14
        }
      ],
      "averageCohortConversion": 4.17,
      "cohortTrends": [
        {
          "period": "2025-09",
          "conversionRate": 8.33,
          "trend": "stable"
        },
        {
          "period": "2025-10",
          "conversionRate": 0,
          "trend": "declining"
        }
      ],
      "retentionByCohort": {
        "2025-09": 8.33,
        "2025-10": 0
      }
    },
    "trialPerformanceByTier": {
      "performanceByTier": {
        "Free Trial": {
          "trials": 13,
          "conversions": 1,
          "conversionRate": 7.69,
          "averageDuration": 14,
          "engagement": 0
        }
      },
      "bestPerformingTier": "Free Trial",
      "worstPerformingTier": "Free Trial",
      "tierComparison": [
        {
          "tier": "Free Trial",
          "performance": 7.69,
          "ranking": 1,
          "strengths": ["Consistent duration", "Clear trial structure"],
          "weaknesses": ["Low conversion rate", "High abandonment rate"]
        }
      ]
    },
    "trialConversionTimeline": {
      "conversionsByDay": {},
      "conversionsByWeek": {},
      "conversionsByMonth": {
        "2025-09": 1
      },
      "peakConversionTimes": [],
      "conversionPatterns": [
        {
          "pattern": "End of trial period",
          "frequency": 1,
          "successRate": 100,
          "description": "Conversions happen at the end of the trial period"
        }
      ]
    },
    "generatedAt": "2025-10-25T11:45:32.630Z",
    "dataPoints": {
      "totalTrials": 13,
      "totalAccounts": 14,
      "subscriptionTiers": 10
    }
  }
}
```

## Error Handling

```typescript
try {
  const analytics = await fetchTrialAnalytics();
  console.log(
    "Conversion rate:",
    analytics.conversionRatesByAccountType.overallConversionRate
  );
} catch (error) {
  if (error instanceof Error) {
    console.error("Trial analytics error:", error.message);
  }
}
```

## Use Cases

### Trial Conversion Dashboard

```typescript
const TrialConversionWidget = () => {
  const { data: analytics, isLoading, error } = useTrialAnalytics();

  if (isLoading) return <div>Loading trial analytics...</div>;
  if (error) return <div>Error loading trial data</div>;

  const { conversionRatesByAccountType, trialToPaidConversionFunnels } =
    analytics;

  return (
    <div className="trial-conversion-dashboard">
      <div className="conversion-overview">
        <h3>Trial Conversion Overview</h3>
        <div className="metrics">
          <MetricCard
            title="Overall Conversion Rate"
            value={`${conversionRatesByAccountType.overallConversionRate.toFixed(
              1
            )}%`}
            trend="up"
          />
          <MetricCard
            title="Total Trials"
            value={trialToPaidConversionFunnels.totalTrials}
          />
          <MetricCard
            title="Converted Trials"
            value={trialToPaidConversionFunnels.convertedTrials}
          />
        </div>
      </div>

      <div className="conversion-by-type">
        <h3>Conversion by Account Type</h3>
        <div className="conversion-bars">
          {Object.entries(
            conversionRatesByAccountType.conversionByAccountType
          ).map(([type, rate]) => (
            <div key={type} className="conversion-bar">
              <span className="type">{type}</span>
              <div className="bar">
                <div className="fill" style={{ width: `${rate}%` }} />
                <span className="rate">{rate.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### Conversion Funnel Visualization

```typescript
const ConversionFunnelWidget = () => {
  const { data: analytics } = useTrialAnalytics();

  const { funnelStages } = analytics.trialToPaidConversionFunnels;

  return (
    <div className="conversion-funnel">
      <h3>Trial Conversion Funnel</h3>
      <div className="funnel-stages">
        {funnelStages.map((stage, index) => (
          <div key={stage.stage} className="funnel-stage">
            <div className="stage-info">
              <h4>{stage.stage}</h4>
              <div className="stage-metrics">
                <span className="count">{stage.count}</span>
                <span className="percentage">
                  {stage.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="stage-bar">
              <div
                className="bar-fill"
                style={{ width: `${stage.percentage}%` }}
              />
            </div>
            {index < funnelStages.length - 1 && (
              <div className="drop-off">
                <span className="drop-off-rate">
                  {stage.dropOffRate.toFixed(1)}% drop-off
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Success Predictors Widget

```typescript
const SuccessPredictorsWidget = () => {
  const { data: analytics } = useTrialAnalytics();

  const { successFactors, riskFactors } = analytics.trialSuccessPredictors;

  return (
    <div className="success-predictors">
      <div className="success-factors">
        <h3>Success Factors</h3>
        {successFactors.map((factor, index) => (
          <div key={index} className="factor-card success">
            <h4>{factor.factor}</h4>
            <p>{factor.description}</p>
            <div className="impact">Impact: {factor.impact.toFixed(1)}%</div>
            <div className="recommendations">
              <h5>Recommendations:</h5>
              <ul>
                {factor.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="risk-factors">
        <h3>Risk Factors</h3>
        {riskFactors.map((factor, index) => (
          <div key={index} className="factor-card risk">
            <h4>{factor.factor}</h4>
            <p>{factor.description}</p>
            <div className="risk-level">Risk: {factor.risk.toFixed(1)}%</div>
            <div className="mitigation">
              <h5>Mitigation:</h5>
              <ul>
                {factor.mitigation.map((mit, i) => (
                  <li key={i}>{mit}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Performance Notes

- **Caching**: Recommended 5-minute cache for trial widgets
- **Real-time**: Not real-time, suitable for periodic updates
- **Data Volume**: Medium - trial-specific data
- **Error Recovery**: Implement retry logic for network failures

## Future Enhancements

- **Phase 2**: Authentication and rate limiting
- **Phase 3**: Real-time trial updates
- **Phase 4**: A/B testing integration
- **Phase 5**: Trial optimization recommendations
