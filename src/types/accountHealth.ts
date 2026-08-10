/** Account-health workflow (season data refresh runs) — see .comms/account-health-status-admin-handoff.md; on-demand trigger: .comms/account-health-on-demand-trigger-handoff.md */

export type AccountHealthRunStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "finalized";

export type AccountHealthItemStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

export type AccountHealthAccountStatus =
  | "not_started"
  | "queued"
  | "running"
  | "completed"
  | "failed";

export type AccountHealthScope =
  | "scrape:association-single"
  | "scrape:club-single"
  | "scrape:grades-batch"
  | "internal:club-to-association-sync"
  | "internal:association-to-club-sync"
  | "scrape:grades-lookup-teams-batch"
  | "scrape:fixture-discovery-batch";

export type StatusCounts = Record<string, number>;

export type FixtureDiscoveryRowStatus = {
  id: number;
  processingStatus: "pending" | "processing" | "processed" | "failed";
  gradeId: number | null;
  updatedAt: string | null;
  processingStartedAt: string | null;
};

export type FixtureDiscoverySummary = {
  expectedTerminalCount: number;
  total: number;
  terminal: number;
  nonTerminal: number;
  failed: number;
  nonTerminalRows: FixtureDiscoveryRowStatus[];
};

export type AccountHealthItem = {
  id: number;
  stepIndex: number;
  scope: AccountHealthScope | string;
  targetType: string;
  targetId: number;
  status: AccountHealthItemStatus;
  runId: string | null;
  bullJobId: string | null;
  startedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
  resultSummary: Record<string, unknown> | null;
  fixtureDiscovery: FixtureDiscoverySummary | null;
};

export type AccountHealthRunSummary = {
  emptyResult?: boolean;
  reason?: string;
  scope?: string;
  [key: string]: unknown;
};

export type AccountHealthRun = {
  id: number;
  accountId: number;
  status: AccountHealthRunStatus;
  accountType: "association" | "club";
  currentStepIndex: number;
  startedAt: string | null;
  queuedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  finalizedAt: string | null;
  failureReason: string | null;
  summary: AccountHealthRunSummary | null;
  itemCounts: StatusCounts;
  blockingItem: AccountHealthItem | null;
  items: AccountHealthItem[];
};

export type AccountHealthGlobalLatestRunRow = {
  id: number;
  accountId: number;
  accountName: string | null;
  primaryOrgLabel: string | null;
  status: AccountHealthRunStatus;
  accountType: "association" | "club";
  startedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  finalizedAt: string | null;
  failureReason: string | null;
  summary: AccountHealthRunSummary | null;
};

export type AccountHealthGlobalStatusResponse = {
  data: {
    runCounts: StatusCounts;
    activeCount: number;
    failedCount: number;
    completedEmptyCount: number;
    latestRuns: AccountHealthGlobalLatestRunRow[];
  };
};

export type AccountHealthAccountStatusResponse = {
  data: {
    account: {
      id: number;
      accountHealthStatus: AccountHealthAccountStatus;
      accountHealthLastQueuedAt: string | null;
      accountHealthLastStartedAt: string | null;
      accountHealthLastCompletedAt: string | null;
      accountHealthLastFailedAt: string | null;
      accountHealthFailureReason: string | null;
    };
    runCounts: StatusCounts;
    latestRun: AccountHealthRun | null;
    recentRuns: Array<{
      id: number;
      status: AccountHealthRunStatus;
      startedAt: string | null;
      completedAt: string | null;
      failedAt: string | null;
      finalizedAt: string | null;
      summary: AccountHealthRunSummary | null;
    }>;
  };
};

export type AccountHealthRunStatusResponse = {
  data: AccountHealthRun;
};

/** POST /api/account/:accountId/health/run-on-demand */

export type AccountHealthTriggerErrorReason =
  | "invalid_account_id"
  | "not_found"
  | "inactive"
  | "not_setup"
  | "account_updating"
  | "not_billable"
  | "invalid_health_plan";

export type AccountHealthFetchPlan = {
  accountId: number;
  accountType: "association" | "club";
  associationIds: number[];
  clubId: number | null;
  primaryOrganisation: {
    type: "association" | "club";
    id: number;
    name: string | null;
    href: string | null;
  };
  scopeSequence: Array<{
    order: number;
    scope: AccountHealthScope;
    targetType: "association" | "club";
    targetId: number | null;
  }>;
};

export type AccountHealthTriggerQueuedBody = {
  status: "queued";
  runId: number;
  itemId: number;
  jobId: string;
  fetchPlan: AccountHealthFetchPlan;
};

export type AccountHealthTriggerExistingActiveBody = {
  status: "existing_active";
  runId: number;
  reason: "active_run_exists";
};

export type AccountHealthTriggerSuccessResponse =
  | {
      data: AccountHealthTriggerQueuedBody;
    }
  | {
      data: AccountHealthTriggerExistingActiveBody;
    };

/** Union of typed success responses plus Strapi 400 envelope for callers that need it */
export type AccountHealthTriggerResponse = AccountHealthTriggerSuccessResponse;

export type AccountHealthTriggerErrorResponse = {
  data: null;
  error: {
    status: number;
    name: string;
    message: AccountHealthTriggerErrorReason | string;
    details: Record<string, unknown>;
  };
};
