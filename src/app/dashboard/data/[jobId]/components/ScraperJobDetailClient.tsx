"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { Button } from "@/components/ui/button";
import { useScraperLogByJobId } from "@/hooks/data-collection/useScraperLogByJobId";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatScopePageHeading } from "../../utils/formatScopePageHeading";
import type { LogEntry } from "@/types/scraperLogs";
import { findLatestCompletedEntry } from "../utils/jobLogPayloadUtils";
import { JobDetailHeader } from "./JobDetailHeader";
import { JobRunOverview } from "./JobRunOverview";
import {
  NotificationByRunSection,
  type NotificationByRunIdSource,
} from "./NotificationByRunSection";
import { ScraperArtifactDebugSection } from "./ScraperArtifactDebugSection";

function humanizeJobStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface ScraperJobDetailClientProps {
  jobId: string;
  /** `?runId=` from the job detail page (takes precedence over job summary / latest completed). */
  runIdFromSearch?: string | null;
}

function resolveRunIdForNotification(
  runIdFromSearch: string | null | undefined,
  jobRunId: string | null | undefined,
  entries: LogEntry[],
): {
  runId: string | undefined;
  source: NotificationByRunIdSource | undefined;
} {
  const q = runIdFromSearch?.trim();
  if (q) return { runId: q, source: "query" };
  const j = jobRunId?.trim();
  if (j) return { runId: j, source: "job" };
  const completed = findLatestCompletedEntry(entries);
  const c = completed?.runId?.trim();
  if (c) return { runId: c, source: "completed" };
  return { runId: undefined, source: undefined };
}

export function ScraperJobDetailClient({
  jobId,
  runIdFromSearch,
}: ScraperJobDetailClientProps) {
  const { data, isLoading, error, refetch, isFetching } =
    useScraperLogByJobId(jobId);

  const notificationRun = useMemo(
    () =>
      data
        ? resolveRunIdForNotification(
            runIdFromSearch,
            data.job.runId,
            data.entries,
          )
        : { runId: undefined, source: undefined },
    [data, runIdFromSearch],
  );

  const pageTitle = data?.job
    ? formatScopePageHeading(data.job.scope)
    : "Scraper job";

  const pageByLineBottom =
    data?.job != null
      ? `${humanizeJobStatus(data.job.status)} · ${data.job.entryCount.toLocaleString()} events · ${data.job.durationFormatted ?? "Duration unavailable"}`
      : isLoading
        ? "Loading…"
        : error != null
          ? "Could not load this job"
          : "Run details";

  useEffect(() => {
    const suffix = "Fixtura Admin";
    if (data?.job) {
      document.title = `${formatScopePageHeading(data.job.scope)} · ${jobId} | ${suffix}`;
    } else {
      document.title = `Scraper job · ${jobId} | ${suffix}`;
    }
  }, [data?.job, jobId]);

  return (
    <div className="space-y-5">
      <Link
        href="/dashboard/data"
        className="inline-flex w-fit items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to data
      </Link>

      <CreatePageTitle
        title={pageTitle}
        byLine="Scraper job"
        byLineBottom={pageByLineBottom}
      >
        {data != null ? (
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw
              className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            />
            Refresh
          </Button>
        ) : null}
      </CreatePageTitle>

      {isLoading && (
        <LoadingState variant="skeleton" message="Loading job details..." />
      )}

      {error != null && !isLoading && (
        <ErrorState
          variant="card"
          error={error}
          title="Could not load job"
          description="The job may not exist or the scraper logs API may be unavailable."
          onRetry={() => refetch()}
        />
      )}

      {data != null && !isLoading && (
        <>
          <Tabs
            defaultValue={runIdFromSearch?.trim() ? "notification" : "overview"}
            className="w-full"
          >
            <TabsList variant="primary" className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="completion">Completion</TabsTrigger>
              <TabsTrigger value="notification">Notification</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <JobDetailHeader job={data.job} />
              <JobRunOverview entries={data.entries} view="heartbeats" />
              <ScraperArtifactDebugSection
                jobId={jobId}
                highlightRunId={notificationRun.runId ?? data.job.runId}
              />
            </TabsContent>

            <TabsContent value="completion">
              <JobRunOverview entries={data.entries} view="completion" />
            </TabsContent>

            <TabsContent value="notification">
              <NotificationByRunSection
                jobId={jobId}
                runId={notificationRun.runId}
                runIdSource={notificationRun.source}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
