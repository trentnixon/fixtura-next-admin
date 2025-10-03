export interface TestRun {
  id: number;
  timestamp: string; // ISO date string
  testDuration: number;
  scraperType: string;
  testEntity: string;
  testEntityId: number;
  testUrl: string;
  testPassed: boolean;
  environment: string;
  testInitiator: string;
  regressionDetected: boolean;
  validation: {
    totalValidations: number;
    passedValidations: number;
    failedValidations: number;
    successRate: number;
  };
  dataComparison: {
    scrapedItemCount: number;
    expectedItemCount: number;
    itemCountMatch: boolean;
  };
  performance: {
    testDuration: number;
    itemsPerSecond: number;
    dataCompleteness: number;
  };
  overview: {
    testName: string;
    status: string;
    duration: number;
    timestamp: string;
    summary: string;
  };
  metadata: {
    errorLogs: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Legacy interface for list items (get all endpoint)
export interface TestRunLegacy {
  id: number;
  timestamp: string;
  testDuration: number;
  scraperType: string;
  testEntity: string;
  testEntityId: number;
  testPassed: boolean;
  totalValidations: number;
  passedValidations: number;
  failedValidations: number;
  environment: string;
  testInitiator: string;
  scrapedItemCount: number;
  expectedItemCount: number;
  regressionDetected: boolean;
}

export interface TestSummary {
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  totalValidations: number;
  totalPassedValidations: number;
  totalFailedValidations: number;
  totalDuration: number;
  averageDuration: number;
  totalRuns: number;
  successRate: number;
  regressionCount: number;
  totalScrapedItems: number;
  totalExpectedItems: number;
}

export interface DailyRunsChart {
  date: string; // "YYYY-MM-DD"
  runs: number;
  passed: number;
  failed: number;
}

export interface SuccessRateOverTimeChart {
  date: string;
  successRate: number;
}

export interface ScraperTypeDistributionChart {
  scraperType: string;
  count: number;
  passed: number;
  successRate: number;
}

export interface EnvironmentDistributionChart {
  environment: string;
  count: number;
}

export interface DurationTrend {
  id: number;
  timestamp: string;
  duration: number;
  environment: string;
  scraperType: string;
}

export interface InitiatorBreakdown {
  initiator: string;
  count: number;
  passed: number;
  successRate: number;
}

export interface ValidationSuccessRate {
  date: string;
  validationSuccessRate: number;
}

export interface TestCharts {
  dailyRuns: DailyRunsChart[];
  successRateOverTime: SuccessRateOverTimeChart[];
  scraperTypeDistribution: ScraperTypeDistributionChart[];
  environmentDistribution: EnvironmentDistributionChart[];
  durationTrends: DurationTrend[];
  initiatorBreakdown: InitiatorBreakdown[];
  validationSuccessRate: ValidationSuccessRate[];
}

export interface TestData {
  list: TestRunLegacy[];
  summary: TestSummary;
  charts: TestCharts;
}

export interface TestResponse {
  success: boolean;
  data: TestData;
  message: string;
}

export interface IndividualTestResponse {
  success: boolean;
  data: TestRun;
  message: string;
}

export interface TestValidation {
  totalValidations: number;
  passedValidations: number;
  failedValidations: number;
  successRate: number;
}

export interface DataComparison {
  scrapedItemCount: number;
  expectedItemCount: number;
  itemCountMatch: boolean;
}

export interface TestPerformance {
  testDuration: number;
  itemsPerSecond: number;
  dataCompleteness: number;
}

export interface TestOverview {
  testName: string;
  status: string; // e.g. "PASSED", "FAILED"
  duration: number;
  timestamp: string; // ISO string
  summary: string;
}

export interface TestMetadata {
  errorLogs: string;
  notes: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface TestById {
  id: number;
  timestamp: string;
  testDuration: number;
  scraperType: string;
  testEntity: string;
  testEntityId: number;
  testUrl: string;
  testPassed: boolean;
  environment: string;
  testInitiator: string;
  regressionDetected: boolean;
  validation: TestValidation;
  dataComparison: DataComparison;
  performance: TestPerformance;
  overview: TestOverview;
  metadata: TestMetadata;
}

export interface TestByIdResponse {
  success: boolean;
  data: TestById;
  message: string;
}
