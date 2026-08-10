"use client";

import { useEffect, useMemo } from "react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
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
      ? `Scraper job · ${humanizeJobStatus(data.job.status)} · Completion metrics, issues, and metadata`
      : isLoading
        ? "Loading job details…"
        : error != null
          ? "Could not load this job — check the job ID or scraper logs API."
          : "Completion metrics, issues, and metadata";

  useEffect(() => {
    const suffix = "Fixtura Admin";
    if (data?.job) {
      document.title = `${formatScopePageHeading(data.job.scope)} · ${jobId} | ${suffix}`;
    } else {
      document.title = `Scraper job · ${jobId} | ${suffix}`;
    }
  }, [data?.job, jobId]);

  return (
    <div className="space-y-8">
      <CreatePageTitle
        title={pageTitle}
        byLine={jobId}
        byLineBottom={pageByLineBottom}
      />

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
          <Tabs defaultValue="snapshot" className="w-full">
            <TabsList variant="primary" className="mb-4">
              <TabsTrigger value="snapshot">Job Snapshot</TabsTrigger>
              <TabsTrigger value="heartbeats">Heartbeats</TabsTrigger>
              <TabsTrigger value="completion">Completion</TabsTrigger>
              <TabsTrigger value="notification">Notification</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            </TabsList>

            <TabsContent value="snapshot" className="space-y-6">
              <JobDetailHeader
                job={data.job}
                onRefresh={() => refetch()}
                isRefreshing={isFetching}
              />
            </TabsContent>

            <TabsContent value="heartbeats">
              <JobRunOverview entries={data.entries} view="heartbeats" />
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

            <TabsContent value="screenshots">
              <ScraperArtifactDebugSection
                jobId={jobId}
                highlightRunId={notificationRun.runId ?? data.job.runId}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
