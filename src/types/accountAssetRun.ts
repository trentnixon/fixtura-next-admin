/** Account asset run orchestration — see .comms/account-asset-run-on-demand-trigger-handoff.md */

export type AccountAssetRunStatus =
  | "pending"
  | "queued"
  | "running"
  | "scraping_results"
  | "checking_upcoming_fixtures"
  | "creating_assets"
  | "completed"
  | "failed"
  | "cancelled";

export type AccountAssetRunItemScope =
  | "eligibility_check"
  | "grades_comps_refresh"
  | "result_batch_scrape"
  | "remove_fixtures_scrape"
  | "asset_creation"
  | "asset_completion";

export type AccountAssetRunItemStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

export type AccountAssetRunItem = {
  id: number;
  scope: AccountAssetRunItemScope | string;
  status: AccountAssetRunItemStatus;
  targetType: string | null;
  targetId: number | null;
  runId: string | null;
  bullJobId: string | null;
  bullJobIds: unknown[] | null;
  startedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  /** Strapi entity timestamps — used for step timing when explicit fields are absent */
  createdAt?: string | null;
  updatedAt?: string | null;
  failureReason: string | null;
  resultSummary: Record<string, unknown> | null;
};

export type AccountAssetRunDetail = {
  id: number;
  accountId: number;
  schedulerId: number;
  renderId: number | null;
  runKey: string;
  status: AccountAssetRunStatus | string;
  scheduledDate: string;
  scheduledFor: string | null;
  startedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
  summary: Record<string, unknown> | null;
  items?: AccountAssetRunItem[];
};

export type AccountAssetRunDetailResponse = {
  data: AccountAssetRunDetail;
};

export type AccountAssetRunLatestResponse = {
  data: AccountAssetRunDetail | null;
};

/** Slim rows from GET /account-asset-runs/status — no items, narrower timestamps */
export type AccountAssetRunListRow = {
  id: number;
  accountId: number;
  schedulerId: number;
  renderId: number | null;
  runKey: string;
  status: AccountAssetRunStatus | string;
  scheduledDate: string;
  /** Optional — CMS follow-up; Admin falls back to runKey epoch when absent */
  startedAt?: string | null;
  /** Optional — CMS follow-up for richer global table links */
  accountName?: string | null;
  accountType?: string | null;
  completedAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
  summary: Record<string, unknown> | null;
};

export type AccountAssetRunGlobalStatusResponse = {
  data: AccountAssetRunListRow[];
};

export type AccountAssetRunTriggerMode = "asset_only" | "full";

export type AccountAssetRunTriggerPayload = {
  mode?: AccountAssetRunTriggerMode;
  force?: boolean;
};

export type AccountAssetRunTriggerNotReadyReason =
  | "invalid_account_id"
  | "account_not_found"
  | "scheduler_not_found"
  | "account_inactive"
  | "account_not_setup"
  | "account_updating"
  | "no_active_paid_order"
  | "render_processing"
  | "active_run_exists"
  | "run_key_exists";

export type AccountAssetRunAdvancedStatus =
  | { status: "waiting_result_scrape" }
  | { status: "waiting_remove_fixtures" }
  | { status: "waiting_asset_creation" }
  | { status: "completed" }
  | { status: "failed"; reason?: string }
  | { status: "noop" };

export type AccountAssetRunTriggerQueuedBody = {
  status: "queued";
  run: AccountAssetRunDetail;
  advanced: AccountAssetRunAdvancedStatus;
};

/** Minimal run envelope from blocking responses (e.g. active_run_exists) */
export type AccountAssetRunNotReadyPartialRun = {
  id: number;
  status?: AccountAssetRunStatus | string;
  runKey?: string;
};

export type AccountAssetRunTriggerBlockingBody =
  | {
      status: "not_ready";
      reason: AccountAssetRunTriggerNotReadyReason | string;
      run?: AccountAssetRunNotReadyPartialRun;
    }
  | {
      status: "skipped";
      reason: AccountAssetRunTriggerNotReadyReason | string;
      run?: AccountAssetRunNotReadyPartialRun;
    };

export type AccountAssetRunTriggerEnvelope =
  | { data: AccountAssetRunTriggerQueuedBody }
  | { data: AccountAssetRunTriggerBlockingBody };

/** GET /account-asset-runs/render-activity query params */
export type AccountAssetRunRenderActivityParams = {
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
  status?: string;
  accountId?: number;
  includeItems?: boolean;
};

export type AccountAssetRunRenderActivityRun = {
  id: number;
  runKey: string;
  status: AccountAssetRunStatus | string;
  mode: string;
  trigger: string;
  scheduledDate: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  durationMs: number | null;
  failureReason: string | null;
};

export type AccountAssetRunRenderActivityAccount = {
  id: number;
  name: string | null;
  type: string | null;
  sport: string | null;
};

export type AccountAssetRunRenderActivityScheduler = {
  id: number;
  name: string | null;
} | null;

export type AccountAssetRunRenderActivityRenderCounts = {
  downloads: number;
  aiArticles: number;
  gameResults: number;
  upcomingGames: number;
  grades: number;
  totalItems: number;
};

export type AccountAssetRunRenderActivityRender = {
  id: number;
  name: string | null;
  processing: boolean;
  complete: boolean;
  emailSent: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
  counts: AccountAssetRunRenderActivityRenderCounts;
};

export type AccountAssetRunRenderActivityItemScope = {
  scope: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  durationMs: number | null;
};

export type AccountAssetRunRenderActivityItems = {
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  running: number;
  queued: number;
  byScope: AccountAssetRunRenderActivityItemScope[];
};

export type AccountAssetRunRenderActivityRow = {
  run: AccountAssetRunRenderActivityRun;
  account: AccountAssetRunRenderActivityAccount;
  scheduler: AccountAssetRunRenderActivityScheduler;
  render: AccountAssetRunRenderActivityRender | null;
  items?: AccountAssetRunRenderActivityItems;
};

export type AccountAssetRunRenderActivityMeta = {
  from: string;
  to: string;
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  returned: number;
  totalIsEstimated?: boolean;
};

export type AccountAssetRunRenderActivityResponse = {
  data: AccountAssetRunRenderActivityRow[];
  meta: AccountAssetRunRenderActivityMeta;
};
