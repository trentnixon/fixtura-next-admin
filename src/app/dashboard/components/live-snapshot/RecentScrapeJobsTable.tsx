"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

function formatDateTime(dateString: string | null): string {
  if (!dateString) return "-";

  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return "-";
  }
}

interface RecentScrapeJobsTableProps {
  jobs: JobSummary[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

/**
 * Last five scraper jobs for the dashboard live snapshot.
 */
export function RecentScrapeJobsTable({
  jobs,
  isLoading,
  error,
  onRetry,
}: RecentScrapeJobsTableProps) {
  return (
    <div className="flex h-full min-w-0 flex-col space-y-2">
      <h3 className="text-sm font-semibold text-slate-900">Recent scrape jobs</h3>

      <div className="min-h-0 flex-1">
      {isLoading ? (
        <LoadingState variant="skeleton">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </LoadingState>
      ) : null}

      {!isLoading && error ? (
        <ErrorState
          variant="default"
          title="Could not load scrape jobs"
          error={error}
          onRetry={onRetry}
        />
      ) : null}

      {!isLoading && !error && (!jobs || jobs.length === 0) ? (
        <EmptyState
          variant="minimal"
          title="No scrape jobs"
          description="Jobs will appear here once scraping activity is recorded."
        />
      ) : null}

      {!isLoading && !error && jobs && jobs.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100 hover:bg-slate-100">
              <TableHead>Scope</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Started</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.jobId}>
                <TableCell className="text-sm">
                  {job.jobId ? (
                    <Link
                      href={`/dashboard/data/${job.jobId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {formatScopeLabel(job.scope)}
                    </Link>
                  ) : (
                    formatScopeLabel(job.scope)
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadgeVariant(job.status)}
                    className={getStatusBadgeClassName(job.status)}
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {job.durationFormatted ?? "-"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDateTime(job.startedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
      </div>
    </div>
  );
}
