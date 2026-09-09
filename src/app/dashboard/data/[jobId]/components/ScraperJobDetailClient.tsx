"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Gauge,
  RefreshCw,
} from "lucide-react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScraperLogByJobId } from "@/hooks/data-collection/useScraperLogByJobId";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
  siteNavigationGroupDividerClass,
  siteNavigationGroupItemClass,
  siteNavigationGroupShellClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import { formatScopePageHeading } from "../../utils/formatScopePageHeading";
import type { LogEntry } from "@/types/scraperLogs";
import {
  findLatestCompletedEntry,
  parseJobCompletedEntry,
} from "../utils/jobLogPayloadUtils";
import { JobDetailHeader } from "./JobDetailHeader";
import {
  completionIssueCount,
  JobCompletionMissingState,
  JobCompletionTabPanel,
  jobCompletionTabs,
  type JobCompletionDetailTab,
} from "./JobCompletedVisualBlock";
import { JobRunOverview, ScraperLogTruncationNotice } from "./JobRunOverview";
import {
  NotificationMetadataSection,
  NotificationMetricsSection,
  NotificationOverviewSection,
} from "./NotificationByRunSection";
import { ScraperArtifactDebugSection } from "./ScraperArtifactDebugSection";

const jobTabs = [
  { value: "overview", label: "Overview", icon: Gauge },
  ...jobCompletionTabs,
] as const;

function humanizeJobStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function groupedItemClass(withDivider: boolean) {
  return cn(
    siteNavigationGroupItemClass,
    withDivider && siteNavigationGroupDividerClass,
  );
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
): string | undefined {
  const q = runIdFromSearch?.trim();
  if (q) return q;
  const j = jobRunId?.trim();
  if (j) return j;
  const completed = findLatestCompletedEntry(entries);
  return completed?.runId?.trim() || undefined;
}

function JobCompletionTabContent({
  tab,
  completedEntry,
  entryCount,
  jobId,
  notificationRunId,
}: {
  tab: JobCompletionDetailTab;
  completedEntry: LogEntry | null;
  entryCount: number;
  jobId: string;
  notificationRunId: string | undefined;
}) {
  const hasCompletionMetrics =
    completedEntry != null &&
    parseJobCompletedEntry(completedEntry).metrics != null;

  if (!completedEntry) {
    return (
      <div className="space-y-6">
        <ScraperLogTruncationNotice entryCount={entryCount} />
        <JobCompletionMissingState />
        {tab === "metrics" ? (
          <NotificationMetricsSection
            jobId={jobId}
            runId={notificationRunId}
            hasCompletionMetrics={false}
          />
        ) : null}
        {tab === "metadata" ? (
          <>
            <NotificationMetadataSection
              jobId={jobId}
              runId={notificationRunId}
            />
            <ScraperArtifactDebugSection
              jobId={jobId}
              highlightRunId={notificationRunId}
            />
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScraperLogTruncationNotice entryCount={entryCount} />
      <JobCompletionTabPanel entry={completedEntry} tab={tab} />
      {tab === "metrics" ? (
        <NotificationMetricsSection
          jobId={jobId}
          runId={notificationRunId}
          hasCompletionMetrics={hasCompletionMetrics}
        />
      ) : null}
      {tab === "metadata" ? (
        <>
          <NotificationMetadataSection
            jobId={jobId}
            runId={notificationRunId}
          />
          <ScraperArtifactDebugSection
            jobId={jobId}
            highlightRunId={notificationRunId ?? completedEntry.runId}
          />
        </>
      ) : null}
    </div>
  );
}

export function ScraperJobDetailClient({
  jobId,
  runIdFromSearch,
}: ScraperJobDetailClientProps) {
  const { data, isLoading, error, refetch, isFetching } =
    useScraperLogByJobId(jobId);

  const notificationRunId = useMemo(
    () =>
      data
        ? resolveRunIdForNotification(
            runIdFromSearch,
            data.job.runId,
            data.entries,
          )
        : undefined,
    [data, runIdFromSearch],
  );

  const completedEntry = useMemo(
    () => (data ? findLatestCompletedEntry(data.entries) : null),
    [data],
  );

  const issueCount = completedEntry ? completionIssueCount(completedEntry) : 0;

  const pageTitle = data?.job
    ? formatScopePageHeading(data.job.scope)
    : "Scraper job";

  const pageByLine = data?.job
    ? `Job ID: ${jobId}`
    : isLoading
      ? `Job ID: ${jobId}`
      : `Job ID: ${jobId}`;

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

  const headerActions = (
    <div className={siteNavigationGroupShellClass}>
      <Button
        variant="ghost"
        size="sm"
        className={groupedItemClass(true)}
        asChild
      >
        <Link href="/dashboard/data">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Data
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={groupedItemClass(false)}
        type="button"
        onClick={() => refetch()}
        disabled={isFetching || isLoading}
      >
        <RefreshCw
          className={cn("h-4 w-4", isFetching && "animate-spin")}
          aria-hidden
        />
        Refresh
      </Button>
    </div>
  );

  if (isLoading && !data) {
    return (
      <>
        <CreatePageTitle
          title={pageTitle}
          byLine={pageByLine}
          byLineBottom="Loading job details…"
        >
          {headerActions}
        </CreatePageTitle>
        <PageContainer padding="xs" spacing="lg">
          <LoadingState variant="skeleton" message="Loading job details..." />
        </PageContainer>
      </>
    );
  }

  if (error != null && !data) {
    return (
      <>
        <CreatePageTitle
          title={pageTitle}
          byLine={pageByLine}
          byLineBottom="Could not load this job"
        >
          {headerActions}
        </CreatePageTitle>
        <PageContainer padding="xs" spacing="lg">
          <ErrorState
            variant="default"
            error={error}
            title="Could not load job"
            description="The job may not exist or the scraper logs API may be unavailable."
            onRetry={() => refetch()}
          />
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <CreatePageTitle
        title={pageTitle}
        byLine={pageByLine}
        byLineBottom={pageByLineBottom}
      >
        {headerActions}
      </CreatePageTitle>

      <PageContainer padding="xs" spacing="lg">
        {data != null ? (
          <Tabs defaultValue="overview" className="w-full">
            <div className="pb-8">
              <TabsList variant="primary" className={sectionTabListClass}>
                {jobTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      variant="section"
                      className={sectionTabTriggerClass}
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 text-current"
                        aria-hidden
                      />
                      {tab.label}
                      {tab.value === "issues" && issueCount > 0 ? (
                        <Badge
                          variant="outline"
                          className="ml-0.5 h-5 px-1.5 text-[10px] tabular-nums"
                        >
                          {issueCount.toLocaleString()}
                        </Badge>
                      ) : null}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <TabsContent value="overview" className="mt-0 space-y-6">
              <ScraperLogTruncationNotice entryCount={data.entries.length} />
              <JobDetailHeader job={data.job} />
              {completedEntry ? (
                <JobCompletionTabPanel
                  entry={completedEntry}
                  tab="summary"
                />
              ) : (
                <JobCompletionMissingState />
              )}
              <JobRunOverview
                entries={data.entries}
                showTruncationNotice={false}
              />
              <NotificationOverviewSection
                jobId={jobId}
                runId={notificationRunId}
              />
            </TabsContent>

            {jobCompletionTabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="mt-0"
              >
                <JobCompletionTabContent
                  tab={tab.value}
                  completedEntry={completedEntry}
                  entryCount={data.entries.length}
                  jobId={jobId}
                  notificationRunId={notificationRunId}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : null}
      </PageContainer>
    </>
  );
}
