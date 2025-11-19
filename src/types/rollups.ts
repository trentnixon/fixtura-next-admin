// TypeScript types for Rollup CMS endpoints
// Mirrors the structures defined in ROLLUP_CMS_DOCS.md and standardizes response envelopes

// ========== Response Envelopes ==========
export interface RollupResponse<T, M = Record<string, unknown>> {
  data: T;
  meta?: M;
}

export interface ErrorResponse {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
}

// ========== Shared/Utility Types ==========
export interface CostBreakdown {
  global?: Record<string, number>;
  assetBreakdown?: Record<string, number>;
  assetTypeBreakdown?: Record<string, number>;
  [key: string]: unknown;
}

export interface PerformanceMetrics {
  [key: string]: unknown;
}

export interface FileSizeMetrics {
  [key: string]: unknown;
}

export interface ModelBreakdown {
  [key: string]: unknown;
}

export interface Insights {
  [key: string]: unknown;
}

export interface AccountBreakdown {
  totalRenders: number;
  totalCost: number;
  schedulers: number[];
}

// ========== Category 1: Render Rollups ==========
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
  costBreakdown: CostBreakdown;
  performanceMetrics: PerformanceMetrics;
  fileSizeMetrics: FileSizeMetrics;
  modelBreakdown: ModelBreakdown;
  // Period Info
  renderYear: number;
  renderMonth: number;
  renderWeek: number;
  renderPeriod: string;
}

export interface SchedulerRollupMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ========== Category 3: Period Rollups ==========
export interface DailyRollup {
  id: number;
  date: string;
  periodStart: string;
  periodEnd: string;
  // Summary
  totalCost: number;
  totalRenders: number;
  totalSchedulers: number;
  // Breakdowns
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
  // Summary
  totalCost: number;
  totalRenders: number;
  averageDailyCost: number;
  // Breakdowns
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
  // Summary
  totalCost: number;
  totalRenders: number;
  totalWeeks: number;
  totalDays: number;
  // Breakdowns
  costBreakdown: CostBreakdown;
  insights: Insights;
}

// ========== Category 4: Global Analytics ==========
export interface SchedulerRollup {
  id?: number;
  schedulerId?: number;
  totalCost?: number;
  [key: string]: unknown;
}

export interface TopAccount {
  accountId: number;
  accountName?: string;
  accountType?: string;
  totalCost: number;
  totalLambdaCost: number;
  totalAiCost: number;
  totalRenders: number;
  averageCostPerRender: number;
  percentageOfTotal: number;
}

export interface GlobalCostSummary {
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
  percentageChange: number;
  // Top Accounts
  topAccounts: TopAccount[];
}

export interface GlobalTrendDataPoint {
  period: string; // date or week or month string
  totalCost: number;
  totalLambdaCost: number;
  totalAiCost: number;
  totalRenders: number;
}

export interface GlobalCostTrends {
  granularity: "daily" | "weekly" | "monthly" | string;
  period: {
    start: string;
    end: string;
  };
  dataPoints: GlobalTrendDataPoint[];
  summary: {
    totalCost: number;
    averageCost: number;
    peakCost: number;
    peakPeriod: string;
    trend: "up" | "down" | "stable";
  };
}

// ========== Category 2: Account Rollups (Summary) ==========
export interface AccountRollupsSummary {
  accountId: number;
  currentMonth: MonthlyRollup | null;
  recentRenders: RenderRollup[];
  recentSchedulers: SchedulerRollup[];
  totals: {
    totalCost: number;
    totalRenders: number;
    totalSchedulers: number;
    averageCostPerRender: number;
  };
  monthlyTrend: Array<{ month: string; cost: number }>;
}

// ========== Envelope Types for Specific Endpoints ==========
export type RenderRollupResponse = RollupResponse<RenderRollup>;
export type RenderRollupsResponse = RollupResponse<
  RenderRollup[],
  { total?: number; requested?: number; found?: number }
>;
export type SchedulerRenderRollupsResponse = RollupResponse<
  RenderRollup[],
  SchedulerRollupMeta
>;

export type DailyRollupResponse = RollupResponse<DailyRollup>;
export type DailyRollupsResponse = RollupResponse<
  DailyRollup[],
  { total: number; startDate: string; endDate: string; totalCost: number }
>;

export type WeeklyRollupResponse = RollupResponse<WeeklyRollup>;
export type WeeklyRollupsResponse = RollupResponse<
  WeeklyRollup[],
  {
    total: number;
    startPeriod: { year: number; week: number };
    endPeriod: { year: number; week: number };
    totalCost: number;
  }
>;

export type MonthlyRollupResponse = RollupResponse<MonthlyRollup>;
export type MonthlyRollupsResponse = RollupResponse<
  MonthlyRollup[],
  {
    total: number;
    startPeriod: { year: number; month: number };
    endPeriod: { year: number; month: number };
    totalCost?: number;
    isGlobal?: boolean;
  }
>;

export type GlobalCostSummaryResponse = RollupResponse<GlobalCostSummary>;
export type GlobalCostTrendsResponse = RollupResponse<GlobalCostTrends>;
export type TopAccountsResponse = RollupResponse<
  TopAccount[],
  { period: string; totalAccounts: number; limit: number }
>;
export type AccountRollupsSummaryResponse =
  RollupResponse<AccountRollupsSummary>;

// ========== Re-exports ==========
export type {
  CostBreakdown as RollupCostBreakdown,
  PerformanceMetrics as RollupPerformanceMetrics,
  FileSizeMetrics as RollupFileSizeMetrics,
  ModelBreakdown as RollupModelBreakdown,
  Insights as RollupInsights,
};
