"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Gauge,
  RefreshCw,
} from "lucide-react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { Button } from "@/components/ui/button";
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
import { findLatestCompletedEntry } from "../utils/jobLogPayloadUtils";
import { JobDetailHeader } from "./JobDetailHeader";
import { JobRunOverview } from "./JobRunOverview";
import {
  NotificationByRunSection,
  type NotificationByRunIdSource,
} from "./NotificationByRunSection";
import { ScraperArtifactDebugSection } from "./ScraperArtifactDebugSection";

const jobTabs = [
  { value: "overview", label: "Overview", icon: Gauge },
  { value: "completion", label: "Completion", icon: CheckCircle2 },
  { value: "notification", label: "Notification", icon: Bell },
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
          <Tabs
            defaultValue={
              runIdFromSearch?.trim() ? "notification" : "overview"
            }
            className="w-full"
          >
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
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <TabsContent value="overview" className="mt-0 space-y-6">
              <JobDetailHeader job={data.job} />
              <JobRunOverview entries={data.entries} view="heartbeats" />
              <ScraperArtifactDebugSection
                jobId={jobId}
                highlightRunId={notificationRun.runId ?? data.job.runId}
              />
            </TabsContent>

            <TabsContent value="completion" className="mt-0">
              <JobRunOverview entries={data.entries} view="completion" />
            </TabsContent>

            <TabsContent value="notification" className="mt-0">
              <NotificationByRunSection
                jobId={jobId}
                runId={notificationRun.runId}
                runIdSource={notificationRun.source}
              />
            </TabsContent>
          </Tabs>
        ) : null}
      </PageContainer>
    </>
  );
}
