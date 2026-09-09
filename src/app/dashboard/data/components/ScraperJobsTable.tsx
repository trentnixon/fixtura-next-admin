"use client";

import Link from "next/link";
import { EyeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EventCounts, JobSummary } from "@/types/scraperLogs";
import { formatScopeLabel } from "../utils/formatScrapeScope";
import {
  formatScraperJobDaysAgo,
  formatScraperJobTime,
  getJobIdentityDisplay,
} from "../utils/formatScraperJobDisplay";
import { cn } from "@/lib/utils";
import {
  getStatusBadgeClassName,
  getStatusBadgeVariant,
} from "../utils/scraperJobBadges";

type EventCountSegment = {
  key: string;
  label: string;
  tone?: "danger";
};

function getEventCountSegments(eventCounts: EventCounts): EventCountSegment[] {
  const segments: EventCountSegment[] = [];

  if (eventCounts.dequeued) {
    segments.push({ key: "dq", label: `${eventCounts.dequeued} dq` });
  }
  if (eventCounts.started) {
    segments.push({ key: "st", label: `${eventCounts.started} st` });
  }
  if (eventCounts.heartbeat) {
    segments.push({ key: "hb", label: `${eventCounts.heartbeat} hb` });
  }
  if (eventCounts.retry_later) {
    segments.push({
      key: "retry",
      label: `${eventCounts.retry_later} retry`,
    });
  }
  if (eventCounts.completed) {
    segments.push({ key: "done", label: `${eventCounts.completed} done` });
  }
  if (eventCounts.failed) {
    segments.push({
      key: "fail",
      label: `${eventCounts.failed} fail`,
      tone: "danger",
    });
  }

  return segments;
}

function formatEventCountsTitle(eventCounts: EventCounts): string {
  const segments = getEventCountSegments(eventCounts);
  return segments.length ? segments.map((s) => s.label).join(" · ") : "";
}

function ScraperJobEventCounts({ eventCounts }: { eventCounts: EventCounts }) {
  const segments = getEventCountSegments(eventCounts);
  if (!segments.length) return null;

  return (
    <span className="mt-0.5 block text-xs text-muted-foreground">
      {segments.map((segment, index) => (
        <span key={segment.key}>
          {index > 0 ? (
            <span className="text-muted-foreground/60"> · </span>
          ) : null}
          <span
            className={cn(
              segment.tone === "danger" &&
                "font-semibold text-red-600 dark:text-red-500",
            )}
          >
            {segment.label}
          </span>
        </span>
      ))}
    </span>
  );
}

interface ScraperJobsTableProps {
  jobs: JobSummary[];
}

export function ScraperJobsTable({ jobs }: ScraperJobsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
            <TableHead className="min-w-[200px] font-semibold">Job</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Duration</TableHead>
            <TableHead className="font-semibold">Days ago</TableHead>
            <TableHead className="font-semibold">Started</TableHead>
            <TableHead className="font-semibold">Log entries</TableHead>
            <TableHead className="w-[72px] text-right font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-8 text-center text-muted-foreground"
              >
                No jobs match the current filters.
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((job) => {
              const identity = getJobIdentityDisplay(job);
              const hasFailures = (job.eventCounts.failed ?? 0) > 0;
              const eventsTitle = formatEventCountsTitle(job.eventCounts);

              return (
                <TableRow
                  key={job.jobId}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <TableCell>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <Link
                        href={`/dashboard/data/${encodeURIComponent(job.jobId)}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {formatScopeLabel(job.scope)}
                      </Link>
                      <span
                        className="truncate font-mono text-xs text-muted-foreground"
                        title={identity.title}
                      >
                        {identity.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(job.status)}
                      className={getStatusBadgeClassName(job.status)}
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm tabular-nums text-muted-foreground">
                    {job.durationFormatted ?? "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatScraperJobDaysAgo(job.startedAt)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
                    {formatScraperJobTime(job.startedAt)}
                  </TableCell>
                  <TableCell
                    className="text-sm tabular-nums"
                    title={
                      eventsTitle
                        ? `${job.entryCount} entries — ${eventsTitle}`
                        : String(job.entryCount)
                    }
                  >
                    <span
                      className={cn(
                        "font-medium",
                        hasFailures
                          ? "text-red-600 dark:text-red-500"
                          : "text-slate-900",
                      )}
                    >
                      {job.entryCount}
                    </span>
                    <ScraperJobEventCounts eventCounts={job.eventCounts} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-slate-200 bg-slate-50 text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-900"
                      asChild
                    >
                      <Link
                        href={`/dashboard/data/${encodeURIComponent(job.jobId)}`}
                        title={`View details for ${formatScopeLabel(job.scope)}`}
                        aria-label={`View details for ${formatScopeLabel(job.scope)}`}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
