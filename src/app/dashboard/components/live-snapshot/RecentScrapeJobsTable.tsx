"use client";

import Link from "next/link";
import { Clock3, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import type { JobSummary } from "@/types/scraperLogs";
import { formatScopeLabel } from "@/app/dashboard/data/utils/formatScrapeScope";
import {
  getStatusBadgeClassName,
  getStatusBadgeVariant,
} from "@/app/dashboard/data/utils/scraperJobBadges";
import { cn } from "@/lib/utils";

function formatDateTime(dateString: string | null): string {
  if (!dateString) return "-";

  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return "-";
  }
}

function statusTone(status: string): string {
  const normalized = status.toLowerCase();

  if (normalized.includes("fail") || normalized.includes("error")) {
    return "bg-red-50 text-red-700";
  }
  if (normalized.includes("run") || normalized.includes("process")) {
    return "bg-sky-50 text-sky-700";
  }
  if (normalized.includes("queue") || normalized.includes("pending")) {
    return "bg-amber-50 text-amber-700";
  }
  if (normalized.includes("complete") || normalized.includes("success")) {
    return "bg-emerald-50 text-emerald-700";
  }

  return "bg-slate-50 text-slate-600";
}

interface RecentScrapeJobsTableProps {
  jobs: JobSummary[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
  /** @deprecated Use `embedded` — parent panel provides the heading. */
  hideTitle?: boolean;
  embedded?: boolean;
}

/**
 * Recent scrape jobs as compact activity rows (labs `base.activity` / record panel).
 */
export function RecentScrapeJobsTable({
  jobs,
  isLoading,
  error,
  onRetry,
}: RecentScrapeJobsTableProps) {
  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        variant="default"
        title="Could not load scrape jobs"
        error={error}
        onRetry={onRetry}
      />
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <EmptyState
        variant="minimal"
        title="No scrape jobs"
        description="Jobs will appear here once scraping activity is recorded."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      {jobs.map((job) => (
        <div
          key={job.jobId}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-slate-200 px-3 py-2.5 text-sm last:border-b-0"
        >
          <div className={cn("rounded-md p-1.5", statusTone(job.status))}>
            <Database className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-0">
            {job.jobId ? (
              <Link
                href={`/dashboard/data/${job.jobId}`}
                className="truncate font-medium text-slate-800 hover:text-primary hover:underline"
              >
                {formatScopeLabel(job.scope)}
              </Link>
            ) : (
              <div className="truncate font-medium text-slate-800">
                {formatScopeLabel(job.scope)}
              </div>
            )}
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3 w-3" />
                {formatDateTime(job.startedAt)}
              </span>
              {job.durationFormatted ? (
                <>
                  <span className="text-muted-foreground/60">·</span>
                  <span>{job.durationFormatted}</span>
                </>
              ) : null}
            </div>
          </div>

          <Badge
            variant={getStatusBadgeVariant(job.status)}
            className={cn("shrink-0", getStatusBadgeClassName(job.status))}
          >
            {job.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}
