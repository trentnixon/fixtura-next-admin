# Order Analytics API - TypeScript Definitions

## Overview

This file contains comprehensive TypeScript type definitions for all Order Analytics API endpoints. Use these types in your frontend applications for type safety and better development experience.

## Base Types

```typescript
// Base response wrapper
interface AnalyticsResponse<T> {
  data: T;
  error?: never;
}

interface ErrorResponse {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
  };
}

// Common utility types
interface TrendAnalysis {
  trend: 'increasing' | 'decreasing' | 'stable';
  growthRate: number;
}

interface DistributionData {
  [key: string]: number;
}

interface TimeSeriesData {
  [period: string]: number;
}
```

## Global Analytics Types

```typescript
interface GlobalAnalytics {
  // Account Overview
  totalAccounts: number;
  activeAccounts: number;
  inactiveAccounts: number;
  accountTypesDistribution: DistributionData;

  // Subscription Analysis
  subscriptionTierDistribution: {
    distribution: DistributionData;
    totalSubscriptions: number;
    averageSubscriptionValue: number;
  };

  // Trial Analysis
  trialConversionRates: {
    totalTrials: number;
    convertedTrials: number;
    conversionRate: number;
    conversionByAccountType: DistributionData;
  };

  // Revenue Analysis
  revenueTrends: {
    monthlyRevenue: TimeSeriesData;
    quarterlyRevenue: TimeSeriesData;
    totalRevenue: number;
    averageMonthlyRevenue: number;
    growthRate: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };

  // Churn Analysis
  churnRates: {
    totalChurned: number;
    churnRate: number;
    churnByAccountType: DistributionData;
    retentionRate: number;
  };

  // Customer Value
  averageCustomerLifetimeValue: number;
  medianCustomerLifetimeValue: number;

  // Sports Distribution
  sportsDistribution: DistributionData;

  // Metadata
  generatedAt: string;
  dataPoints: {
    totalAccounts: number;
    totalOrders: number;
    subscriptionTiers: number;
    trialInstances: number;
  };
}

type GlobalAnalyticsResponse = AnalyticsResponse<GlobalAnalytics>;
```

## Account Analytics Types

```typescript
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
    renewalConsistency: 'consistent' | 'irregular' | 'unknown';
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
    healthLevel: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
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
    orderFrequency: 'high' | 'medium' | 'low';
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
    riskLevel: 'low' | 'medium' | 'high';
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
  action: 'started' | 'renewed' | 'cancelled' | 'upgraded' | 'downgraded';
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

type AccountAnalyticsResponse = AnalyticsResponse<AccountAnalytics>;
```

## Subscription Trends Types

```typescript
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
    churnByAccountType: DistributionData;
    renewalByAccountType: DistributionData;
  };

  // Tier Migration Patterns
  tierMigrationPatterns: {
    upgrades: number;
    downgrades: number;
    upgradesByTier: DistributionData;
    downgradesByTier: DistributionData;
    netMigration: DistributionData;
    migrationTrends: MigrationTrend[];
  };

  // Subscription Duration Trends
  subscriptionDurationTrends: {
    averageDuration: number;
    medianDuration: number;
    durationDistribution: DistributionData;
    durationByTier: DistributionData;
    durationByAccountType: DistributionData;
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
    monthlySubscriptions: TimeSeriesData;
    monthlyCancellations: TimeSeriesData;
    monthlyRenewals: TimeSeriesData;
    netGrowth: TimeSeriesData;
    growthRate: number;
    trend: 'growing' | 'declining' | 'stable';
  };

  // Subscription Status Distribution
  subscriptionStatusDistribution: {
    active: number;
    cancelled: number;
    expired: number;
    pending: number;
    suspended: number;
    distribution: DistributionData;
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
  retentionRates: DistributionData;
  averageLifetimeValue: number;
}

interface RetentionTrend {
  period: string;
  retentionRate: number;
  churnRate: number;
}

type SubscriptionTrendsResponse = AnalyticsResponse<SubscriptionTrends>;
```

## Trial Analytics Types

```typescript
interface TrialAnalytics {
  // Trial Start/End Patterns
  trialStartEndPatterns: {
    totalTrials: number;
    activeTrials: number;
    completedTrials: number;
    trialsByMonth: TimeSeriesData;
    averageTrialDuration: number;
    trialStartTrends: TrialTrend[];
    trialEndTrends: TrialTrend[];
  };

  // Conversion Rates by Account Type
  conversionRatesByAccountType: {
    overallConversionRate: number;
    conversionByAccountType: DistributionData;
    conversionByTier: DistributionData;
    conversionBySport: DistributionData;
    conversionTimeline: ConversionTimeline[];
  };

  // Trial Duration Analysis
  trialDurationAnalysis: {
    averageDuration: number;
    medianDuration: number;
    durationDistribution: DistributionData;
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
    reasons: DistributionData;
    abandonmentByAccountType: DistributionData;
    abandonmentTimeline: AbandonmentTimeline[];
  };

  // Trial Success Predictors
  trialSuccessPredictors: {
    accountTypeImpact: DistributionData;
    trialDurationImpact: DistributionData;
    engagementImpact: DistributionData;
    timingImpact: DistributionData;
    successFactors: SuccessFactor[];
    riskFactors: RiskFactor[];
  };

  // Trial Engagement Metrics
  trialEngagementMetrics: {
    averageEngagement: number;
    engagementByAccountType: DistributionData;
    engagementByTier: DistributionData;
    engagementTrends: EngagementTrend[];
    highEngagementTrials: number;
    lowEngagementTrials: number;
  };

  // Trial Cohort Analysis
  trialCohortAnalysis: {
    cohorts: TrialCohort[];
    averageCohortConversion: number;
    cohortTrends: CohortTrend[];
    retentionByCohort: DistributionData;
  };

  // Trial Performance by Tier
  trialPerformanceByTier: {
    performanceByTier: DistributionData;
    bestPerformingTier: string;
    worstPerformingTier: string;
    tierComparison: TierComparison[];
  };

  // Trial Conversion Timeline
  trialConversionTimeline: {
    conversionsByDay: TimeSeriesData;
    conversionsByWeek: TimeSeriesData;
    conversionsByMonth: TimeSeriesData;
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
  trend: 'increasing' | 'decreasing' | 'stable';
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
  reasons: DistributionData;
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
  trend: 'increasing' | 'decreasing' | 'stable';
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
  trend: 'improving' | 'declining' | 'stable';
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

type TrialAnalyticsResponse = AnalyticsResponse<TrialAnalytics>;
```

## Revenue Analytics Types

```typescript
interface RevenueAnalytics {
  // Monthly and Quarterly Revenue Trends
  monthlyQuarterlyRevenueTrends: {
    monthlyRevenue: TimeSeriesData;
    quarterlyRevenue: TimeSeriesData;
    monthlyOrderCounts: TimeSeriesData;
    quarterlyOrderCounts: TimeSeriesData;
    monthlyTrends: TrendAnalysis;
    quarterlyTrends: TrendAnalysis;
    totalRevenue: number;
    averageMonthlyRevenue: number;
  };

  // Revenue by Subscription Tier
  revenueBySubscriptionTier: {
    revenueByTier: DistributionData;
    orderCountsByTier: DistributionData;
    averageOrderValueByTier: DistributionData;
    totalRevenue: number;
    revenueDistribution: DistributionData;
  };

  // Payment Method Analysis
  paymentMethodAnalysis: DistributionData;

  // Billing Cycle Patterns
  billingCyclePatterns: DistributionData;

  // Revenue Projections
  revenueProjections: {
    trend: 'increasing' | 'decreasing' | 'stable';
    growthRate: number;
    projections: TimeSeriesData;
    confidence: 'high' | 'medium' | 'low';
    basedOnMonths: number;
  };

  // Customer Lifetime Value Analysis
  customerLifetimeValueAnalysis: {
    averageCLV: number;
    medianCLV: number;
    totalCustomers: number;
    clvByAccountType: DistributionData;
    customerDistribution: CLVDistribution;
  };

  // Revenue by Account Type
  revenueByAccountType: {
    revenueByAccountType: DistributionData;
    orderCountsByAccountType: DistributionData;
    averageOrderValueByAccountType: DistributionData;
    revenueDistribution: DistributionData;
  };

  // Revenue Growth Metrics
  revenueGrowthMetrics: {
    monthOverMonthGrowth: MonthGrowth[];
    averageMoMGrowth: number;
    totalRevenue: number;
    revenueTrend: 'increasing' | 'decreasing' | 'stable';
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
    byMonth: DistributionData;
    byQuarter: DistributionData;
    byDayOfWeek: DistributionData;
    byHour: DistributionData;
  };

  // Revenue Per Customer Metrics
  revenuePerCustomerMetrics: {
    totalCustomers: number;
    totalRevenue: number;
    averageRevenuePerCustomer: number;
    accountTypeMetrics: DistributionData;
  };

  // Metadata
  generatedAt: string;
  dataPoints: {
    totalOrders: number;
    totalAccounts: number;
    subscriptionTiers: number;
  };
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

type RevenueAnalyticsResponse = AnalyticsResponse<RevenueAnalytics>;
```

## Cohort Analysis Types

```typescript
interface CohortAnalysis {
  // Customer Acquisition Cohorts
  acquisitionCohorts: {
    monthlyCohorts: DistributionData;
    quarterlyCohorts: DistributionData;
    totalCohorts: number;
    totalAccounts: number;
  };

  // Retention Analysis by Cohort
  retentionAnalysis: {
    retentionRates: DistributionData;
    overallRetentionMetrics: OverallRetentionMetrics;
  };

  // Customer Lifecycle Stages
  lifecycleStages: {
    lifecycleStages: LifecycleStageData;
    stageMetrics: DistributionData;
    totalAccounts: number;
  };

  // Cohort Revenue Patterns
  cohortRevenuePatterns: {
    cohortRevenue: DistributionData;
    monthlyRevenue: TimeSeriesData;
    totalRevenue: number;
    averageRevenuePerCohort: number;
  };

  // Churn Analysis by Cohort
  churnAnalysis: {
    churnAnalysis: DistributionData;
    overallChurnMetrics: OverallChurnMetrics;
  };

  // Cohort Performance Metrics
  cohortPerformanceMetrics: {
    performanceMetrics: DistributionData;
    overallPerformance: OverallPerformanceMetrics;
  };

  // Customer Lifetime Value by Cohort
  clvByCohort: {
    clvByCohort: DistributionData;
    overallCLVMetrics: OverallCLVMetrics;
  };

  // Cohort Conversion Funnels
  conversionFunnels: {
    conversionFunnels: DistributionData;
    overallConversionMetrics: OverallConversionMetrics;
  };

  // Cohort Engagement Patterns
  engagementPatterns: {
    engagementPatterns: DistributionData;
    overallEngagementMetrics: OverallEngagementMetrics;
  };

  // Cohort Segmentation
  cohortSegmentation: {
    segments: SegmentData;
    segmentMetrics: DistributionData;
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

interface LifecycleStageData {
  new: any[];
  trial: any[];
  active: any[];
  churned: any[];
  dormant: any[];
}

interface SegmentData {
  highValue: any[];
  mediumValue: any[];
  lowValue: any[];
  trialOnly: any[];
  neverConverted: any[];
}

interface OverallRetentionMetrics {
  totalAccounts: number;
  averageRetentionRate: number;
  totalCohorts: number;
}

interface OverallChurnMetrics {
  totalAccounts: number;
  totalChurned: number;
  averageChurnRate: number;
  totalCohorts: number;
}

interface OverallPerformanceMetrics {
  totalAccounts: number;
  totalConverted: number;
  averageConversionRate: number;
  totalCohorts: number;
}

interface OverallCLVMetrics {
  totalAccounts: number;
  totalCLV: number;
  averageCLV: number;
  totalCohorts: number;
}

interface OverallConversionMetrics {
  totalAccounts: number;
  totalConverted: number;
  averageConversionRate: number;
  totalCohorts: number;
}

interface OverallEngagementMetrics {
  totalAccounts: number;
  totalEngaged: number;
  averageEngagementRate: number;
  totalCohorts: number;
}

type CohortAnalysisResponse = AnalyticsResponse<CohortAnalysis>;
```

## Usage Examples

### React Hook with Types

```typescript
import { useQuery } from '@tanstack/react-query';

export const useGlobalAnalytics = () => {
  return useQuery<GlobalAnalytics, Error>({
    queryKey: ['analytics', 'global'],
    queryFn: async (): Promise<GlobalAnalytics> => {
      const response = await fetch('/api/orders/analytics/global-summary');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch global analytics`);
      }
      const data: GlobalAnalyticsResponse = await response.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
```

### Type Guards

```typescript
// Type guard for error responses
export function isErrorResponse(response: any): response is ErrorResponse {
  return response && response.error && !response.data;
}

// Type guard for successful responses
export function isAnalyticsResponse<T>(response: any): response is AnalyticsResponse<T> {
  return response && response.data && !response.error;
}
```

### Generic Analytics Hook

```typescript
export function useAnalytics<T>(
  endpoint: string,
  queryKey: string[]
) {
  return useQuery<T, Error>({
    queryKey,
    queryFn: async (): Promise<T> => {
      const response = await fetch(`/api/orders/analytics/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch ${endpoint}`);
      }
      const data = await response.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Usage
const globalAnalytics = useAnalytics<GlobalAnalytics>('global-summary', ['analytics', 'global']);
const accountAnalytics = useAnalytics<AccountAnalytics>('account/430', ['analytics', 'account', '430']);
```

## Export All Types

```typescript
export type {
  // Base types
  AnalyticsResponse,
  ErrorResponse,
  TrendAnalysis,
  DistributionData,
  TimeSeriesData,

  // Global Analytics
  GlobalAnalytics,
  GlobalAnalyticsResponse,

  // Account Analytics
  AccountAnalytics,
  AccountAnalyticsResponse,
  OrderSummary,
  SubscriptionInfo,
  SubscriptionEvent,
  TrialInfo,
  TrialEvent,

  // Subscription Trends
  SubscriptionTrends,
  SubscriptionTrendsResponse,
  MigrationTrend,
  JourneyPath,
  CohortData,
  RetentionTrend,

  // Trial Analytics
  TrialAnalytics,
  TrialAnalyticsResponse,
  TrialTrend,
  ConversionTimeline,
  DurationConversion,
  FunnelStage,
  DropOffPoint,
  ConversionPath,
  AbandonmentTimeline,
  SuccessFactor,
  RiskFactor,
  EngagementTrend,
  TrialCohort,
  CohortTrend,
  TierComparison,
  ConversionPattern,

  // Revenue Analytics
  RevenueAnalytics,
  RevenueAnalyticsResponse,
  CLVDistribution,
  MonthGrowth,

  // Cohort Analysis
  CohortAnalysis,
  CohortAnalysisResponse,
  LifecycleStageData,
  SegmentData,
  OverallRetentionMetrics,
  OverallChurnMetrics,
  OverallPerformanceMetrics,
  OverallCLVMetrics,
  OverallConversionMetrics,
  OverallEngagementMetrics,
};
```
