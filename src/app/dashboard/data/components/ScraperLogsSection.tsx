"use client";

import { useCallback, useMemo, useState } from "react";
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
import { useScraperLogs } from "@/hooks/data-collection/useScraperLogs";
import { formatScopeLabel } from "../utils/formatScrapeScope";
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

export function ScraperLogsSection({ scope }: ScraperLogsSectionProps) {
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

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-slate-50/80 p-3">
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
                  className="pl-8 pr-8"
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
                onChange={(event) => {
                  setDateTo(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
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

      {isLoading && (
        <LoadingState variant="skeleton" message="Loading scraper logs..." />
      )}

      {error && (
        <ErrorState
          variant="card"
          error={error}
          title="Error Loading Scraper Logs"
          description="Failed to fetch scraper logs. Please try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !error && (
        <>
          {!data || data.length === 0 ? (
            <EmptyState
              variant="card"
              title="No Scraper Logs"
              description="No scraper logs found for this scope."
            />
          ) : (
            <>
              {meta?.summary && (
                <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label: "Total Jobs",
                      value: meta.summary.totalJobs.toLocaleString(),
                      meta: `Scope: ${scope ? formatScopeLabel(scope) : (meta.scope ?? "all")}`,
                      icon: ListTodo,
                      tone: "bg-blue-50 text-blue-700",
                    },
                    {
                      label: "Avg Duration",
                      value: formatDurationMs(meta.summary.avgDurationMs),
                      meta: "Per completed job",
                      icon: Clock,
                      tone: "bg-slate-100 text-slate-700",
                    },
                    {
                      label: "Completed",
                      value: (
                        meta.summary.byStatus.completed ?? 0
                      ).toLocaleString(),
                      meta: "Successful runs",
                      icon: CheckCircle2,
                      tone: "bg-emerald-50 text-emerald-700",
                    },
                    {
                      label: "Status Mix",
                      value: formatStatusSummary(meta.summary.byStatus),
                      meta: "Current breakdown",
                      icon: BarChart3,
                      tone: "bg-amber-50 text-amber-700",
                    },
                  ].map((metric) => {
                    const Icon = metric.icon;

                    return (
                      <div
                        key={metric.label}
                        className="flex min-h-[96px] items-center gap-3 border-b border-slate-200 p-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:last:border-r-0"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${metric.tone}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-semibold uppercase text-muted-foreground">
                            {metric.label}
                          </div>
                          <div
                            className="truncate text-xl font-semibold tabular-nums text-slate-900"
                            title={String(metric.value)}
                          >
                            {metric.value}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {metric.meta}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {meta?.timeline && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <ScraperLogsJobsOverTimeChart meta={meta} />
                  <ScraperLogsStatusDistributionChart meta={meta} />
                  <ScraperLogsDurationOverTimeChart meta={meta} />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span>
                    Showing {filteredJobs.length} of {data.length} loaded jobs
                    {total ? ` (${total.toLocaleString()} total)` : ""}
                  </span>
                  {searchQuery ? (
                    <Badge variant="outline">Filtered</Badge>
                  ) : null}
                </div>

                <ScraperJobsTable jobs={filteredJobs} />

                {totalPages > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Per page:
                      </span>
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
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
