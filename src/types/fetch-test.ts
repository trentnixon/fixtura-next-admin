/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TestRun {
  id: number;
  timestamp: string; // ISO date string e.g. "2025-09-30"
  testDuration: number;
  passedTests: number;
  failedTests: number;
}

export interface Summary {
  totalTests: number | null;
  totalPassed: number;
  totalFailed: number;
  totalFailures: number | null;
  totalDuration: number;
  averageDuration: number;
  totalRuns: number;
  successRate: number | null;
  emailNotificationsSent: number;
}

export interface DailyRun {
  date: string; // ISO date
  runs: number;
  passed: number;
  failed: number;
}

export interface SuccessRateOverTime {
  date: string; // ISO date
  successRate: number;
}

export interface EnvironmentDistribution {
  count: number;
}

export interface DurationTrend {
  id: number;
  timestamp: string; // ISO date
  duration: number;
}

export interface InitiatorBreakdown {
  count: number;
  totalTests: number | null;
}

export interface Charts {
  dailyRuns: DailyRun[];
  successRateOverTime: SuccessRateOverTime[];
  environmentDistribution: EnvironmentDistribution[];
  durationTrends: DurationTrend[];
  initiatorBreakdown: InitiatorBreakdown[];
}

export interface TestReport {
  list: TestRun[];
  summary: Summary;
  charts: Charts;
}

// BY ID

export interface DetailedResult {
  gameId: string;
  passed: boolean;
  discrepancies: any[]; // could refine if you know structure of discrepancies
}

export interface MemoryUsage {
  rss: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
}

export interface PerGameMetric {
  gameId: string;
  executionTime: number;
  memoryUsage: MemoryUsage;
  browserMetrics: any | null; // refine if structure known
}

export interface MemorySnapshot {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
  arrayBuffers: number;
}

export interface CpuUsage {
  user: number;
  system: number;
}

export interface SystemMetrics {
  memorySnapshots: MemorySnapshot[];
  cpuUsage: CpuUsage;
  browserMemory: any | null;
  memoryPeak: number;
}

export interface PerformanceMetrics {
  perGameMetrics: PerGameMetric[];
  systemMetrics: SystemMetrics;
  totalDuration: number;
}

export interface Dependencies {
  [key: string]: string;
}

export interface SystemEnvironment {
  [key: string]: string;
}

export interface SystemInfo {
  nodeVersion: string;
  platform: string;
  architecture: string;
  puppeteerVersion: string;
  dependencies: Dependencies;
  environment: SystemEnvironment;
}

export interface BrowserViewport {
  width: number;
  height: number;
}

export interface BrowserConfig {
  headless: boolean;
  viewport: BrowserViewport;
  userAgent: string | null;
}

export interface TestConfiguration {
  testType: string;
  testVersion: string;
  fixturesCount: number;
  expectedDataHash: string;
  optionalFields: string[];
  xpathVersion: string;
  browserConfig: BrowserConfig;
}

export interface BrowserStatus {
  initialized: boolean;
  pid: number;
  version: string | null;
}

export interface ErrorRecovery {
  retryAttempts: number;
  recoveredErrors: any[];
}

export interface NetworkStatus {
  apiResponseTime: number | null;
  apiStatusCode: number | null;
  connectionErrors: number;
}

export interface EnvironmentContext {
  strapiEndpoint: string;
  redisConnectionStatus: string;
  browserStatus: BrowserStatus;
  errorRecovery: ErrorRecovery;
  networkStatus: NetworkStatus;
}

export interface XPathValidation {
  validXpaths: number;
  invalidXpaths: number;
  fallbackUsed: number;
}

export interface DataQualityMetrics {
  fieldSuccessRates: Record<string, unknown>;
  optionalFieldHandling: Record<string, unknown>;
  xpathValidation: XPathValidation;
  extractionSuccessRate: number;
}

export interface ByIDResponse {
  id: number;
  timestamp: string; // ISO date e.g. "2025-09-30"
  environment: string;
  reportType: string;
  testInitiator: string;
  testDuration: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalFailures: number;
  emailStatus: boolean;
  errorLogs: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  publishedAt: string; // ISO datetime
  overview: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
  };
  categorySummary: {
    passed: number;
    failed: number;
  };
  detailedResults: DetailedResult[];
  performanceMetrics: PerformanceMetrics;
  systemInfo: SystemInfo;
  testConfiguration: TestConfiguration;
  environmentContext: EnvironmentContext;
  dataQualityMetrics: DataQualityMetrics;
}
