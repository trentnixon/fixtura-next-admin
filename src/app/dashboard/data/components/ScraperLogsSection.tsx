"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  ListTodo,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationInfo,
  PaginationNext,
  PaginationPages,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { CompactKpiCard } from "@/components/ui-library/cards";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { useScraperLogs } from "@/hooks/data-collection/useScraperLogs";
import {
  ScraperLogsDurationOverTimeChart,
  ScraperLogsJobsOverTimeChart,
  ScraperLogsStatusDistributionChart,
} from "./ScraperLogsCharts";
import { ScraperJobsTable } from "./ScraperJobsTable";

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

interface ScraperLogsSectionProps {
  scope?:
    | "clients_list"
    | "association_to_competition"
    | "club_to_competition"
    | "grades_comps"
    | "grades_lookup_teams"
    | "club_active_check";
  /** Overview in SectionContainer, job log as its own panel below */
  layout?: "default" | "split";
  splitOverviewTitle?: string;
  splitOverviewDescription?: string;
  splitOverviewIcon?: ReactNode;
  splitOverviewAction?: ReactNode;
  /** Rendered between overview section and job log (e.g. org link sync) */
  splitBeforeJobLog?: ReactNode;
}

function formatDurationMs(ms: number | null): string {
  if (ms == null || ms < 0) return "-";
  if (ms < 1000) return `${ms}ms`;

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
  if (seconds % 60 > 0 || parts.length === 0) parts.push(`${seconds % 60}s`);

  return parts.join(" ");
}

function formatStatusSummary(byStatus: Record<string, number>): string {
  return (
    Object.entries(byStatus)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => `${count} ${status.replace("_", " ")}`)
      .join(" | ") || "-"
  );
}

export function ScraperLogsSection({
  scope,
  layout = "default",
  splitOverviewTitle = "All scraper jobs",
  splitOverviewDescription = "Cross-scope scraper activity and charts",
  splitOverviewIcon,
  splitOverviewAction,
  splitBeforeJobLog,
}: ScraperLogsSectionProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const timestamp_gte = dateFrom ? `${dateFrom}T00:00:00.000Z` : undefined;
  const timestamp_lte = dateTo ? `${dateTo}T23:59:59.999Z` : undefined;

  const { data, meta, isLoading, error, refetch, isFetching } = useScraperLogs({
    scope,
    page,
    pageSize,
    timestamp_gte,
    timestamp_lte,
  });

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = Number(
        event.target.value,
      ) as (typeof PAGE_SIZE_OPTIONS)[number];

      if (PAGE_SIZE_OPTIONS.includes(value)) {
        setPageSize(value);
        setPage(1);
      }
    },
    [],
  );

  const filteredJobs = useMemo(() => {
    if (!data) return [];

    const query = searchQuery.trim().toLowerCase();
    if (!query) return data;

    return data.filter((job) => {
      const searchable = [
        job.jobId,
        job.runId,
        job.scope,
        job.kind,
        job.service,
        job.status,
        job.bullJobId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [data, searchQuery]);

  const totalPages = meta?.pagination?.pageCount ?? 0;
  const total = meta?.pagination?.total ?? 0;
  const hasActiveFilters = Boolean(dateFrom || dateTo || searchQuery);

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
    setPage(1);
  };

  const jobLogFilters = (
    <div className="-mx-4 -mt-4 mb-4 border-b border-slate-200 bg-slate-50/60 px-4 py-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-[minmax(220px,1fr)_160px_160px]">
          <div className="space-y-1.5">
            <label
              htmlFor="job-search"
              className="text-xs font-medium text-slate-600"
            >
              Search current page
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="job-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Job, run, service, status"
                className="border-slate-200 bg-white pl-8 pr-8"
              />
              {searchQuery ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1.5 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="date-from"
              className="text-xs font-medium text-slate-600"
            >
              From
            </label>
            <Input
              id="date-from"
              type="date"
              value={dateFrom}
              className="border-slate-200 bg-white"
              onChange={(event) => {
                setDateFrom(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="date-to"
              className="text-xs font-medium text-slate-600"
            >
              To
            </label>
            <Input
              id="date-to"
              type="date"
              value={dateTo}
              className="border-slate-200 bg-white"
              onChange={(event) => {
                setDateTo(event.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasActiveFilters ? (
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 bg-white shadow-none"
              onClick={clearFilters}
            >
              Clear
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-slate-200 bg-white shadow-none"
            aria-label="Refresh logs"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );

  const summaryCards =
    !isLoading && !error && meta?.summary ? (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CompactKpiCard
          label="Total jobs"
          value={meta.summary.totalJobs.toLocaleString()}
          icon={<ListTodo className="h-4 w-4" />}
          iconClassName="bg-blue-50 text-blue-700"
          progressClassName="bg-blue-500"
        />
        <CompactKpiCard
          label="Avg duration"
          value={formatDurationMs(meta.summary.avgDurationMs)}
          icon={<Clock className="h-4 w-4" />}
          iconClassName="bg-slate-100 text-slate-700"
          progressClassName="bg-slate-500"
        />
        <CompactKpiCard
          label="Completed"
          value={(meta.summary.byStatus.completed ?? 0).toLocaleString()}
          icon={<CheckCircle2 className="h-4 w-4" />}
          iconClassName="bg-emerald-50 text-emerald-700"
          progressClassName="bg-emerald-500"
        />
        <CompactKpiCard
          label="Status mix"
          value={formatStatusSummary(meta.summary.byStatus)}
          icon={<BarChart3 className="h-4 w-4" />}
          iconClassName="bg-amber-50 text-amber-700"
          progressClassName="bg-amber-500"
        />
      </div>
    ) : null;

  const activityCharts =
    !isLoading && !error && meta?.timeline ? (
      <OverviewRecordPanel
        title="Activity charts"
        description="Job volume, status mix, and duration over the selected window"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ScraperLogsJobsOverTimeChart meta={meta} />
          <ScraperLogsStatusDistributionChart meta={meta} />
          <ScraperLogsDurationOverTimeChart meta={meta} />
        </div>
      </OverviewRecordPanel>
    ) : null;

  const overviewContent = (
    <div className="space-y-4">
      {isLoading ? (
        <LoadingState variant="skeleton" message="Loading scraper summary…" />
      ) : null}
      {error ? (
        <ErrorState
          variant="card"
          error={error}
          title="Error loading scraper summary"
          description="Failed to fetch scraper logs. Please try again."
          onRetry={refetch}
        />
      ) : null}
      {summaryCards}
      {activityCharts}
    </div>
  );

  const jobLogPanel = (
    <OverviewRecordPanel
      title="Job log"
      description="Paginated scraper jobs for this scope"
      badge={
        searchQuery ? (
          <Badge variant="outline">Filtered</Badge>
        ) : total > 0 ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
            {total.toLocaleString()} total
          </span>
        ) : null
      }
      footer={
        totalPages > 0 && !isLoading && !error && data && data.length > 0 ? (
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Per page:</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                aria-label="Items per page"
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              variant="primary"
            >
              <PaginationInfo
                format="long"
                totalItems={total}
                itemsPerPage={pageSize}
                className="mr-2"
              />
              <div className="flex items-center gap-1">
                <PaginationPrevious />
                <PaginationPages />
                <PaginationNext />
              </div>
            </Pagination>
          </div>
        ) : null
      }
    >
      {jobLogFilters}

      {isLoading ? (
        <LoadingState variant="skeleton" message="Loading scraper logs..." />
      ) : null}

      {error ? (
        <ErrorState
          variant="card"
          error={error}
          title="Error Loading Scraper Logs"
          description="Failed to fetch scraper logs. Please try again."
          onRetry={refetch}
        />
      ) : null}

      {!isLoading && !error && (!data || data.length === 0) ? (
        <EmptyState
          variant="card"
          title="No Scraper Logs"
          description="No scraper logs found for this scope."
        />
      ) : null}

      {!isLoading && !error && data && data.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Showing {filteredJobs.length} of {data.length} loaded jobs
            {total ? ` (${total.toLocaleString()} total)` : ""}
          </p>
          <ScraperJobsTable jobs={filteredJobs} />
        </div>
      ) : null}
    </OverviewRecordPanel>
  );

  if (layout === "split") {
    return (
      <div className="space-y-4">
        <SectionContainer
          title={splitOverviewTitle ?? "Scraper activity"}
          description={splitOverviewDescription}
          icon={splitOverviewIcon}
          variant="compact"
          action={splitOverviewAction}
        >
          {overviewContent}
        </SectionContainer>
        {splitBeforeJobLog}
        {jobLogPanel}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {summaryCards}
      {activityCharts}
      {jobLogPanel}
    </div>
  );
}
