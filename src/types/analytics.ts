/**
 * Analytics Types for Order Analytics API
 *
 * This file contains comprehensive TypeScript type definitions for all Order Analytics API endpoints.
 * Based on the documentation in src/app/dashboard/docs/frontend/
 */

// ============================================================================
// BASE TYPES
// ============================================================================

/**
 * Base response wrapper for all analytics endpoints
 */
export interface AnalyticsResponse<T> {
  data: T;
  error?: never;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
  };
}

/**
 * Common utility types
 */
export interface TrendAnalysis {
  trend: "increasing" | "decreasing" | "stable";
  growthRate: number;
}

export interface DistributionData {
  [key: string]: number;
}

export interface TimeSeriesData {
  [period: string]: number;
}

// ============================================================================
// GLOBAL ANALYTICS TYPES
// ============================================================================

/**
 * Global analytics response containing system-wide metrics
 */
export interface GlobalAnalytics {
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
    trend: "increasing" | "decreasing" | "stable";
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

export type GlobalAnalyticsResponse = AnalyticsResponse<GlobalAnalytics>;

// ============================================================================
// ACCOUNT ANALYTICS TYPES
// ============================================================================

/**
 * Order summary for account analytics
 */
export interface OrderSummary {
  id: number;
  date: string;
  amount: number;
  status: string;
  subscriptionTier: string;
  paymentMethod: string;
}

/**
 * Subscription information
 */
export interface SubscriptionInfo {
  tier: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
}

/**
 * Subscription event in timeline
 */
export interface SubscriptionEvent {
  date: string;
  action: "started" | "renewed" | "cancelled" | "upgraded" | "downgraded";
  tier: string;
  amount: number;
}

/**
 * Trial information
 */
export interface TrialInfo {
  startDate: string;
  endDate: string;
  isActive: boolean;
  subscriptionTier: string;
  daysRemaining: number;
}

/**
 * Trial event in history
 */
export interface TrialEvent {
  startDate: string;
  endDate: string;
  converted: boolean;
  subscriptionTier: string;
}

/**
 * Account analytics response containing detailed account insights
 */
export interface AccountAnalytics {
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

export type AccountAnalyticsResponse = AnalyticsResponse<AccountAnalytics>;

// ============================================================================
// SUBSCRIPTION TRENDS TYPES
// ============================================================================

/**
 * Migration trend between subscription tiers
 */
export interface MigrationTrend {
  fromTier: string;
  toTier: string;
  count: number;
  percentage: number;
  valueChange: number;
}

/**
 * Customer journey path
 */
export interface JourneyPath {
  path: string[];
  count: number;
  conversionRate: number;
  averageDuration: number;
}

/**
 * Cohort data for retention analysis
 */
export interface CohortData {
  cohort: string;
  totalSubscriptions: number;
  retentionRates: DistributionData;
  averageLifetimeValue: number;
}

/**
 * Retention trend over time
 */
export interface RetentionTrend {
  period: string;
  retentionRate: number;
  churnRate: number;
}

/**
 * Subscription trends response containing lifecycle analysis
 */
export interface SubscriptionTrends {
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
    trend: "growing" | "declining" | "stable";
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

export type SubscriptionTrendsResponse = AnalyticsResponse<SubscriptionTrends>;

// ============================================================================
// TRIAL ANALYTICS TYPES
// ============================================================================

/**
 * Trial trend over time
 */
export interface TrialTrend {
  period: string;
  count: number;
  trend: "increasing" | "decreasing" | "stable";
}

/**
 * Conversion timeline data
 */
export interface ConversionTimeline {
  period: string;
  trials: number;
  conversions: number;
  conversionRate: number;
}

/**
 * Duration vs conversion analysis
 */
export interface DurationConversion {
  durationRange: string;
  trials: number;
  conversions: number;
  conversionRate: number;
}

/**
 * Funnel stage in conversion process
 */
export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropOffRate: number;
}

/**
 * Drop-off point in conversion funnel
 */
export interface DropOffPoint {
  stage: string;
  dropOffCount: number;
  dropOffRate: number;
  reasons: string[];
}

/**
 * Conversion path analysis
 */
export interface ConversionPath {
  path: string[];
  count: number;
  conversionRate: number;
  averageDuration: number;
}

/**
 * Abandonment timeline data
 */
export interface AbandonmentTimeline {
  period: string;
  abandonments: number;
  abandonmentRate: number;
  reasons: DistributionData;
}

/**
 * Success factor analysis
 */
export interface SuccessFactor {
  factor: string;
  impact: number;
  description: string;
  recommendations: string[];
}

/**
 * Risk factor analysis
 */
export interface RiskFactor {
  factor: string;
  risk: number;
  description: string;
  mitigation: string[];
}

/**
 * Engagement trend over time
 */
export interface EngagementTrend {
  period: string;
  averageEngagement: number;
  trend: "increasing" | "decreasing" | "stable";
}

/**
 * Trial cohort data
 */
export interface TrialCohort {
  cohort: string;
  totalTrials: number;
  conversions: number;
  conversionRate: number;
  averageDuration: number;
}

/**
 * Cohort trend analysis
 */
export interface CohortTrend {
  period: string;
  conversionRate: number;
  trend: "improving" | "declining" | "stable";
}

/**
 * Tier performance comparison
 */
export interface TierComparison {
  tier: string;
  performance: number;
  ranking: number;
  strengths: string[];
  weaknesses: string[];
}

/**
 * Conversion pattern analysis
 */
export interface ConversionPattern {
  pattern: string;
  frequency: number;
  successRate: number;
  description: string;
}

/**
 * Trial analytics response containing conversion analysis
 */
export interface TrialAnalytics {
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

export type TrialAnalyticsResponse = AnalyticsResponse<TrialAnalytics>;

// ============================================================================
// REVENUE ANALYTICS TYPES
// ============================================================================

/**
 * Payment method data analysis
 */
export interface PaymentMethodData {
  orderCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  revenuePercentage: number;
}

/**
 * Billing cycle data analysis
 */
export interface BillingCycleData {
  orderCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  revenuePercentage: number;
}

/**
 * Customer lifetime value data
 */
export interface CLVData {
  averageCLV: number;
  medianCLV: number;
  customerCount: number;
  totalRevenue: number;
}

/**
 * CLV distribution analysis
 */
export interface CLVDistribution {
  lowValue: number;
  mediumValue: number;
  highValue: number;
  lowValuePercentage: number;
  mediumValuePercentage: number;
  highValuePercentage: number;
}

/**
 * Month-over-month growth data
 */
export interface MonthGrowth {
  month: string;
  growthRate: number;
}

/**
 * Account type metrics
 */
export interface AccountTypeMetrics {
  totalRevenue: number;
  totalOrders: number;
  customerCount: number;
  revenues: number[];
  averageRevenuePerCustomer: number;
  averageOrdersPerCustomer: number;
  averageOrderValue: number;
}

/**
 * Revenue analytics response containing financial insights
 */
export interface RevenueAnalytics {
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
  paymentMethodAnalysis: Record<string, PaymentMethodData>;

  // Billing Cycle Patterns
  billingCyclePatterns: Record<string, BillingCycleData>;

  // Revenue Projections
  revenueProjections: {
    trend: "increasing" | "decreasing" | "stable";
    growthRate: number;
    projections: TimeSeriesData;
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

export type RevenueAnalyticsResponse = AnalyticsResponse<RevenueAnalytics>;

// ============================================================================
// COHORT ANALYSIS TYPES
// ============================================================================

/**
 * Cohort data for acquisition analysis
 */
export interface CohortData {
  totalAccounts: number;
  accountTypes: Record<string, number>;
  accountTypeDistribution: Record<string, number>;
  averageAccountAge: number;
}

/**
 * Retention data for specific period
 */
export interface RetentionData {
  cohortSize: number;
  retention: Record<string, RetentionPeriod>;
  averageRetentionRate: number;
}

/**
 * Retention period analysis
 */
export interface RetentionPeriod {
  activeAccounts: number;
  totalAccounts: number;
  retentionRate: number;
}

/**
 * Overall retention metrics
 */
export interface OverallRetentionMetrics {
  totalAccounts: number;
  averageRetentionRate: number;
  totalCohorts: number;
}

/**
 * Lifecycle stage data
 */
export interface LifecycleStageData {
  new: Record<string, number>;
  trial: Record<string, number>;
  active: Record<string, number>;
  churned: Record<string, number>;
  dormant: Record<string, number>;
}

/**
 * Stage metrics for lifecycle analysis
 */
export interface StageMetrics {
  count: number;
  percentage: number;
  averageAge: number;
  accountTypes: Record<string, number>;
}

/**
 * Cohort revenue data
 */
export interface CohortRevenueData {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  averageRevenuePerAccount: number;
  revenuePerAccount: AccountRevenueData[];
}

/**
 * Account revenue data
 */
export interface AccountRevenueData {
  accountId: number;
  revenue: number;
  orderCount: number;
}

/**
 * Churn data analysis
 */
export interface ChurnData {
  totalAccounts: number;
  activeAccounts: number;
  dormantAccounts: number;
  churnedAccounts: number;
  churnRate: number;
  retentionRate: number;
  averageAccountAge: number;
}

/**
 * Overall churn metrics
 */
export interface OverallChurnMetrics {
  totalAccounts: number;
  totalChurned: number;
  averageChurnRate: number;
  totalCohorts: number;
}

/**
 * Performance metrics for cohort
 */
export interface CohortPerformanceMetrics {
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

/**
 * Overall performance metrics
 */
export interface OverallPerformanceMetrics {
  totalAccounts: number;
  totalConverted: number;
  averageConversionRate: number;
  totalCohorts: number;
}

/**
 * Cohort CLV data
 */
export interface CohortCLVData {
  totalAccounts: number;
  totalCLV: number;
  averageCLV: number;
  medianCLV: number;
  customerValues: number[];
  clvDistribution: CLVDistribution;
}

/**
 * Overall CLV metrics
 */
export interface OverallCLVMetrics {
  totalAccounts: number;
  totalCLV: number;
  averageCLV: number;
  totalCohorts: number;
}

/**
 * Conversion funnel data
 */
export interface ConversionFunnelData {
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

/**
 * Overall conversion metrics
 */
export interface OverallConversionMetrics {
  totalAccounts: number;
  totalConverted: number;
  averageConversionRate: number;
  totalCohorts: number;
}

/**
 * Engagement data analysis
 */
export interface EngagementData {
  totalAccounts: number;
  engagedAccounts: number;
  highlyEngagedAccounts: number;
  averageOrdersPerAccount: number;
  averageDaysToFirstOrder: number;
  averageDaysBetweenOrders: number;
}

/**
 * Overall engagement metrics
 */
export interface OverallEngagementMetrics {
  totalAccounts: number;
  totalEngaged: number;
  averageEngagementRate: number;
  totalCohorts: number;
}

/**
 * Segment data for cohort segmentation
 */
export interface SegmentData {
  highValue: number[];
  mediumValue: number[];
  lowValue: number[];
  trialOnly: number[];
  neverConverted: number[];
}

/**
 * Segment metrics
 */
export interface SegmentMetrics {
  count: number;
  percentage: number;
  averageAge: number;
  accountTypes: Record<string, number>;
}

/**
 * Cohort analysis response containing customer retention analysis
 */
export interface CohortAnalysis {
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
    monthlyRevenue: TimeSeriesData;
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
    performanceMetrics: Record<string, CohortPerformanceMetrics>;
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

export type CohortAnalysisResponse = AnalyticsResponse<CohortAnalysis>;

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard for error responses
 */
export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    !("data" in response)
  );
}

/**
 * Type guard for successful analytics responses
 */
export function isAnalyticsResponse<T>(
  response: unknown
): response is AnalyticsResponse<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    "data" in response &&
    !("error" in response)
  );
}

// ============================================================================
// All types are already exported above with their definitions
// ============================================================================
