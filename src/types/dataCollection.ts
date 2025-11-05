/* eslint-disable @typescript-eslint/no-explicit-any */
import { Account } from "./account";

export interface DataCollectionAttributes {
  whenWasTheLastCollection: string;
  TimeTaken: number;
  MemoryUsage: number;
  hasError: boolean;
  processingTracker: any;
  account: { data: Account }; // Add the account field
}

export interface DataCollection {
  id: number;
  attributes: DataCollectionAttributes;
}

export interface DataCollectionState {
  dataCollections: DataCollection[];
  accountDataCollections: DataCollection[];
  dataCollectionDetails: DataCollection | null;
  loading: boolean;
  error: string | null;
}

// Update Account Only API Types
export interface UpdateAccountOnlyRequest {
  accountId: number;
  accountType: "CLUB" | "ASSOCIATION";
}

export interface UpdateAccountOnlyResponse {
  success: boolean;
  message: string;
  accountId: number;
  accountType: "CLUB" | "ASSOCIATION";
}

// Account Data Collection API Types

/**
 * Request parameters for fetching account data collection information
 * Since this is a GET endpoint, accountId will typically be passed as a URL parameter
 */
export interface FetchAccountDataCollectionParams {
  accountId: string; // Account ID as string (will be converted in service layer if needed)
}

/**
 * Main response interface for account data collection endpoint
 * Wraps all data in a `data` property
 */
export interface AccountStatsResponse {
  data: AccountStatsData;
}

/**
 * Core data structure for account statistics
 */
export interface AccountStatsData {
  accountInfo: AccountInfo;
  summary: Summary;
  entityStatistics: EntityStatistics;
  stageAnalysis: StageAnalysis;
  performanceMetrics: PerformanceMetrics;
  errorAnalysis: ErrorAnalysis;
  temporalAnalysis: TemporalAnalysis;
  dataVolume: DataVolume;
  accountInsights: AccountInsights;
  timeSeries: TimeSeries;
  collections: CollectionItem[];
  generatedAt: string;
}

/**
 * Account information
 */
export interface AccountInfo {
  accountId: number;
  accountName: string;
  accountType: string;
  sport: string;
  isActive: boolean;
}

/**
 * Summary statistics
 */
export interface Summary {
  totalCollections: number;
  collectionsWithErrors: number;
  errorRate: number;
  averageCompletionRate: number;
  averageTimeTaken: number;
  averageMemoryUsage: number;
  totalItemsProcessed: number;
  dateRange: DateRange;
}

/**
 * Date range for collections
 */
export interface DateRange {
  earliest: string; // ISO datetime
  latest: string; // ISO datetime
}

/**
 * Individual collection item
 */
export interface CollectionItem {
  id: number;
  whenWasTheLastCollection: string;
  daysSinceLastCollection: number;
}

/**
 * Entity statistics grouped by entity type (competitions, teams, games)
 */
export interface EntityStatistics {
  competitions: EntityStats;
  teams: EntityStats;
  games: EntityStats;
}

/**
 * Statistics for a specific entity type
 */
export interface EntityStats {
  totalItemsFound: number;
  totalItemsUpdated: number;
  totalItemsNew: number;
  totalErrors: number;
  averageItemsPerCollection: number;
  updateRate: number;
  newItemRate: number;
  errorRate: number;
  collectionsProcessed: number;
}

/**
 * Stage analysis for collection completion
 */
export interface StageAnalysis {
  overallCompletionRate: number;
  fullyCompletedCollections: number;
  inProgressCollections: number;
  currentStageDistribution: Record<string, number>;
  averageStagesCompleted: number;
  averagePendingStages: number;
  mostCommonPendingStages: string[];
}

/**
 * Performance metrics (time and memory)
 */
export interface PerformanceMetrics {
  timeTaken: MetricStats;
  memoryUsage: MetricStats;
}

/**
 * Statistical metrics (average, median, min, max)
 */
export interface MetricStats {
  average: number;
  median: number;
  min: number;
  max: number;
}

/**
 * Error analysis
 */
export interface ErrorAnalysis {
  overallErrorRate: number;
  errorRateByEntityType: ErrorRateByEntityType;
  totalErrors: number;
  collectionsWithErrors: number;
}

/**
 * Error rates by entity type
 */
export interface ErrorRateByEntityType {
  competitions: number;
  teams: number;
  games: number;
}

/**
 * Temporal analysis (time-based patterns)
 */
export interface TemporalAnalysis {
  totalCollections: number;
  lastCollectionDate: string;
  daysSinceLastCollection: number;
  collectionFrequency: number;
}

/**
 * Data volume statistics
 */
export interface DataVolume {
  totalItemsProcessed: number;
  averageItemsPerCollection: number;
  updateRatio: number;
  newItemRatio: number;
}

/**
 * Account insights and health scoring
 */
export interface AccountInsights {
  accountId: number;
  totalCollections: number;
  lastCollectionDate: string;
  averageTimeTaken: number;
  errorRate: number;
  completionRate: number;
  healthScore: number;
  needsAttention: boolean;
}

/**
 * Time series data for various metrics over time
 */
export interface TimeSeries {
  collectionsOverTime: CollectionTimePoint[];
  performanceOverTime: PerformanceTimePoint[];
  itemsProcessedOverTime: ItemsProcessedTimePoint[];
  errorsOverTime: ErrorsTimePoint[];
  completionRateOverTime: CompletionRateTimePoint[];
  entityStatsOverTime: EntityStatsOverTime;
}

/**
 * Collection count over time
 */
export interface CollectionTimePoint {
  date: string;
  count: number;
  hasError: boolean;
  completionRate: number;
}

/**
 * Performance metrics over time
 */
export interface PerformanceTimePoint {
  date: string;
  timeTaken: number;
  memoryUsage: number;
}

/**
 * Items processed over time
 */
export interface ItemsProcessedTimePoint {
  date: string;
  itemsFound: number;
  itemsUpdated: number;
  itemsNew: number;
  cumulativeItems: number;
}

/**
 * Errors over time
 */
export interface ErrorsTimePoint {
  date: string;
  errors: number;
  cumulativeErrors: number;
  hasError: boolean;
}

/**
 * Completion rate over time
 */
export interface CompletionRateTimePoint {
  date: string;
  completionRate: number;
  currentStage: string;
  completedStages: number;
  pendingStages: number;
}

/**
 * Entity statistics over time for each entity type
 */
export interface EntityStatsOverTime {
  competitions: EntityStatsTimePoint[];
  teams: EntityStatsTimePoint[];
  games: EntityStatsTimePoint[];
}

/**
 * Entity statistics at a specific time point
 */
export interface EntityStatsTimePoint {
  date: string;
  itemsFound: number;
  itemsUpdated: number;
  itemsNew: number;
  errorsDetected: number;
}

/**
 * Error response interface for data collection endpoint
 */
export interface AccountDataCollectionErrorResponse {
  error: {
    status: number;
    name: string;
    message: string;
  };
}

// Global Data Collection Insights API Types

/**
 * Request options for fetching global data collection insights
 * All parameters are optional query parameters
 */
export interface UseGlobalInsightsOptions {
  /** Filter by sport (Cricket, AFL, Hockey, Netball, Basketball) */
  sport?: string;
  /** Filter by account type */
  accountType?: "CLUB" | "ASSOCIATION";
  /** Filter by error status */
  hasError?: boolean;
  /** Filter from date (ISO format) */
  dateFrom?: string;
  /** Filter to date (ISO format) */
  dateTo?: string;
  /** Sort field (whenWasTheLastCollection, TimeTaken, MemoryUsage) */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: "asc" | "desc";
  /** Limit results */
  limit?: number;
}

/**
 * Main response interface for global data collection insights endpoint
 * Wraps all data in a `data` property
 */
export interface GlobalInsightsResponse {
  data: GlobalInsightsData;
}

/**
 * Core data structure for global insights
 */
export interface GlobalInsightsData {
  summary: GlobalSummary;
  performanceMetrics: GlobalPerformanceMetrics;
  errorAnalysis: GlobalErrorAnalysis;
  temporalAnalysis: GlobalTemporalAnalysis;
  incompleteCollections: IncompleteCollections;
  biggestAccountsByTime: AccountTimeSummary[];
  recentCollections: RecentCollection[];
  timeSeries: GlobalTimeSeries;
  generatedAt: string; // ISO 8601 timestamp
}

/**
 * Summary statistics for global insights
 */
export interface GlobalSummary {
  totalCollections: number;
  collectionsWithErrors: number;
  collectionsIncomplete: number;
  errorRate: number; // Percentage (0-100)
  averageTimeTaken: number; // Seconds
  averageMemoryUsage: number; // MB
  dateRange: {
    earliest: string | null; // ISO 8601 date
    latest: string | null; // ISO 8601 date
  };
}

/**
 * Performance metrics for global insights
 */
export interface GlobalPerformanceMetrics {
  timeTaken: {
    average: number; // Seconds
    median: number; // Seconds
    min: number; // Seconds
    max: number; // Seconds
  };
  memoryUsage: {
    average: number; // MB
    median: number; // MB
    min: number; // MB
    max: number; // MB
  };
}

/**
 * Error analysis for global insights
 */
export interface GlobalErrorAnalysis {
  totalErrors: number; // Count of collections with errors
  collectionsWithErrors: number;
  errorRate: number; // Percentage (0-100)
}

/**
 * Temporal analysis for global insights
 */
export interface GlobalTemporalAnalysis {
  totalCollections: number;
  lastCollectionDate: string | null; // ISO 8601 date
  daysSinceLastCollection: number | null;
  collectionFrequency: number; // Collections per day
}

/**
 * Incomplete collections statistics
 */
export interface IncompleteCollections {
  count: number;
  percentage: number; // Percentage (0-100)
}

/**
 * Account time summary for top accounts by time taken
 */
export interface AccountTimeSummary {
  accountId: number;
  accountName: string;
  totalTimeTaken: number; // Total seconds across all collections
  averageTimeTaken: number; // Average seconds per collection
  collectionCount: number; // Number of collections for this account
}

/**
 * Recent collection information
 */
export interface RecentCollection {
  id: number;
  accountId: number;
  accountName: string;
  whenWasTheLastCollection: string; // ISO 8601 date
  timeTaken: number; // Seconds
  memoryUsage: number; // MB
  hasError: boolean;
  isIncomplete: boolean;
}

/**
 * Time series data for global insights
 * Limited to last 12 months, grouped by day
 */
export interface GlobalTimeSeries {
  performanceOverTime: PerformanceDataPoint[]; // Last 12 months, grouped by day
  errorsOverTime: ErrorDataPoint[]; // Last 12 months, grouped by day
  collectionsFrequencyOverTime: FrequencyDataPoint[]; // Last 12 months, grouped by day
}

/**
 * Performance data point for time series
 */
export interface PerformanceDataPoint {
  date: string; // YYYY-MM-DD format
  averageTimeTaken: number; // Seconds
  averageMemoryUsage: number; // MB
  maxTimeTaken: number; // Seconds
  maxMemoryUsage: number; // MB
}

/**
 * Error data point for time series
 */
export interface ErrorDataPoint {
  date: string; // YYYY-MM-DD format
  errorCount: number;
  incompleteCount: number;
  totalCollections: number;
}

/**
 * Frequency data point for time series
 */
export interface FrequencyDataPoint {
  date: string; // YYYY-MM-DD format
  count: number; // Collections on this day
}
