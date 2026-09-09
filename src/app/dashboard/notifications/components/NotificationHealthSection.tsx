"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  DatabaseZap,
  Layers3,
  MessageSquareWarning,
  Network,
  Tags,
} from "lucide-react";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import type { NotificationHealthData } from "@/types/notificationHealth";
import type { NotificationIssuesLinkQuery } from "@/types/notificationIssues";
import { formatDurationNoMillis } from "@/utils/chart-formatters";
import { buildNotificationIssuesHref } from "../issues/utils/notificationIssuesUrl";
import { formatRate, sortRecordEntries } from "./notificationHealthUi";

interface NotificationHealthDetailPanelsProps {
  data: NotificationHealthData;
  issuesLinkQuery?: NotificationIssuesLinkQuery;
}

interface RankedPanelProps {
  title: string;
  description: string;
  rows: { key: string; count: number }[];
  emptyMessage: string;
  getRowHref?: (key: string) => string;
  barClassName?: string;
  countBadgeClassName?: string;
}

const diagnosticTabs = [
  { value: "pipeline", label: "Pipeline", icon: Network },
  { value: "data-area", label: "Data area", icon: Boxes },
  { value: "classification", label: "Classification", icon: Tags },
  { value: "messages", label: "Messages", icon: MessageSquareWarning },
] as const;

function RankedPanel({
  title,
  description,
  rows,
  emptyMessage,
  getRowHref,
  barClassName = "bg-slate-100/80",
  countBadgeClassName = "border-slate-200 bg-slate-50 text-slate-700",
}: RankedPanelProps) {
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  const max = rows[0]?.count ?? 0;

  return (
    <OverviewRecordPanel
      title={title}
      description={description}
      badge={
        total > 0 ? (
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${countBadgeClassName}`}
          >
            {total.toLocaleString()} total
          </span>
        ) : null
      }
    >
      {rows.length > 0 ? (
        <div className="space-y-1">
          {rows.slice(0, 8).map((row) => {
            const percent =
              total > 0 ? Math.round((row.count / total) * 100) : 0;
            const width = max > 0 ? Math.max((row.count / max) * 100, 3) : 0;
            const href = getRowHref?.(row.key);
            const content = (
              <div className="group relative overflow-hidden rounded-md border border-transparent px-3 py-2.5 transition hover:border-slate-200 hover:bg-slate-50">
                <div
                  className={`absolute inset-y-0 left-0 transition ${barClassName}`}
                  style={{ width: `${width}%` }}
                />
                <div className="relative flex items-center gap-3">
                  <div className="min-w-0 flex-1 truncate font-mono text-sm text-slate-800">
                    {row.key}
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-right">
                    <Badge variant="outline" className={countBadgeClassName}>
                      {row.count.toLocaleString()}
                    </Badge>
                    <span className="inline-block w-[72px] text-xs tabular-nums text-muted-foreground">
                      {percent}% of total
                    </span>
                  </div>
                  {href ? (
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : null}
                </div>
              </div>
            );

            return href ? (
              <Link key={row.key} href={href}>
                {content}
              </Link>
            ) : (
              <div key={row.key}>{content}</div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-slate-200 py-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      )}
    </OverviewRecordPanel>
  );
}

function ImpactPanel({
  title,
  description,
  total,
  succeeded,
  failed,
  retried,
  duration,
}: {
  title: string;
  description: string;
  total: number;
  succeeded: number;
  failed: number;
  retried?: number;
  duration?: string;
}) {
  const denominator = total > 0 ? total : succeeded + failed;
  const succeededPercent =
    denominator > 0 ? Math.min((succeeded / denominator) * 100, 100) : 0;
  const failedPercent =
    denominator > 0
      ? Math.min((failed / denominator) * 100, 100 - succeededPercent)
      : 0;
  const unreportedPercent = Math.max(0, 100 - succeededPercent - failedPercent);
  const successRate = denominator > 0 ? succeeded / denominator : null;
  const metrics = [
    { label: "Total", value: total, tone: "text-slate-900" },
    { label: "Succeeded", value: succeeded, tone: "text-success-700" },
    { label: "Failed", value: failed, tone: "text-error-700" },
    ...(retried != null
      ? [{ label: "Retried", value: retried, tone: "text-warning-700" }]
      : []),
    ...(duration
      ? [{ label: "Duration", value: duration, tone: "text-slate-900" }]
      : []),
  ];

  return (
    <OverviewRecordPanel
      title={title}
      description={description}
      badge={
        <Badge
          variant="outline"
          className="border-slate-200 bg-slate-50 text-slate-700"
        >
          {formatRate(successRate)} success
        </Badge>
      }
    >
      <div className="space-y-5">
        <div>
          <div
            className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100"
            role="img"
            aria-label={`${succeeded.toLocaleString()} succeeded, ${failed.toLocaleString()} failed${unreportedPercent > 0 ? ", with some outcomes unreported" : ""}`}
          >
            <div
              className="h-full bg-success-500"
              style={{ width: `${succeededPercent}%` }}
            />
            <div
              className="h-full bg-error-500"
              style={{ width: `${failedPercent}%` }}
            />
            {unreportedPercent > 0 ? (
              <div
                className="h-full bg-slate-300"
                style={{ width: `${unreportedPercent}%` }}
              />
            ) : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success-500" />
              Succeeded {Math.round(succeededPercent)}%
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-error-500" />
              Failed {Math.round(failedPercent)}%
            </span>
            {unreportedPercent > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                Other {Math.round(unreportedPercent)}%
              </span>
            ) : null}
            {retried != null && retried > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-warning-700">
                <span className="h-2 w-2 rounded-full bg-warning-500" />
                {retried.toLocaleString()} retried
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-md border border-slate-200 bg-slate-50/70 px-3 py-2.5"
            >
              <div className="text-xs text-muted-foreground">
                {metric.label}
              </div>
              <div
                className={`mt-0.5 text-lg font-semibold tabular-nums ${metric.tone}`}
              >
                {typeof metric.value === "number"
                  ? metric.value.toLocaleString()
                  : metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </OverviewRecordPanel>
  );
}

export function NotificationHealthDetailPanels({
  data,
  issuesLinkQuery,
}: NotificationHealthDetailPanelsProps) {
  const byStepRows = sortRecordEntries(data.issues.byStep);
  const byServiceRows = sortRecordEntries(data.byDimension.byService);
  const byScopeRows = sortRecordEntries(data.byDimension.byScope);
  const byQueueRows = sortRecordEntries(data.byDimension.byQueueName);
  const byKindRows = sortRecordEntries(data.byDimension.byKind);
  const bySeverityRows = sortRecordEntries(data.issues.bySeverity);
  const byIssueScopeRows = sortRecordEntries(data.issues.byIssueScope);
  const messageRows = data.issues.topMessages.map((row) => ({
    key: row.message,
    count: row.count,
  }));
  const sums = data.metricsSums;

  const hrefFor = (filter: string): ((key: string) => string) | undefined =>
    issuesLinkQuery
      ? (key) => buildNotificationIssuesHref(issuesLinkQuery, { [filter]: key })
      : undefined;

  return (
    <div className="flex flex-col gap-6">
      <SectionContainer
        title="Diagnostic breakdown"
        description="Ranked failure concentrations. Select a row to open the matching issue filter."
        icon={<Layers3 className="h-6 w-6 text-slate-600" />}
        variant="compact"
        action={
          <div className="hidden items-center gap-2 sm:flex">
            <Badge
              variant="outline"
              className="border-warning-200 bg-warning-50 text-warning-800"
            >
              {formatRate(data.rates.avgErrorRate)} average row error rate
            </Badge>
            <Badge
              variant="outline"
              className="border-info-200 bg-info-50 text-info-800"
            >
              {data.notifications.nonFatalCount.toLocaleString()} non-fatal
            </Badge>
          </div>
        }
      >
        <Tabs defaultValue="pipeline" className="w-full">
          <div className="pb-8">
            <TabsList variant="primary" className={sectionTabListClass}>
              {diagnosticTabs.map((tab) => {
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

          <TabsContent value="pipeline" className="mt-0">
            <div className="grid gap-4 lg:grid-cols-3">
              <RankedPanel
                title="Failure steps"
                description="Where issue handling stopped"
                rows={byStepRows}
                barClassName="bg-warning-100/80"
                countBadgeClassName="border-warning-200 bg-warning-50 text-warning-800"
                emptyMessage="No failure-step data"
                getRowHref={hrefFor("step")}
              />
              <RankedPanel
                title="Services"
                description="Services emitting notifications"
                rows={byServiceRows}
                barClassName="bg-info-100/80"
                countBadgeClassName="border-info-200 bg-info-50 text-info-800"
                emptyMessage="No service data"
                getRowHref={hrefFor("service")}
              />
              <RankedPanel
                title="Queues"
                description="Queues associated with failures"
                rows={byQueueRows}
                barClassName="bg-violet-100/80"
                countBadgeClassName="border-violet-200 bg-violet-50 text-violet-800"
                emptyMessage="No queue data"
                getRowHref={hrefFor("queueName")}
              />
            </div>
          </TabsContent>

          <TabsContent value="data-area" className="mt-0">
            <div className="grid gap-4 lg:grid-cols-2">
              <RankedPanel
                title="Notification scope"
                description="Broad scraper domains reporting failures"
                rows={byScopeRows}
                barClassName="bg-success-100/80"
                countBadgeClassName="border-success-200 bg-success-50 text-success-800"
                emptyMessage="No notification-scope data"
                getRowHref={hrefFor("scope")}
              />
              <RankedPanel
                title="Issue scope"
                description="Granular domains attached to issue rows"
                rows={byIssueScopeRows}
                barClassName="bg-cyan-100/80"
                countBadgeClassName="border-cyan-200 bg-cyan-50 text-cyan-800"
                emptyMessage="No issue-scope data"
                getRowHref={hrefFor("issueScope")}
              />
            </div>
          </TabsContent>

          <TabsContent value="classification" className="mt-0">
            <div className="grid gap-4 lg:grid-cols-2">
              <RankedPanel
                title="Notification kinds"
                description="Event types recorded by the notification feed"
                rows={byKindRows}
                barClassName="bg-indigo-100/80"
                countBadgeClassName="border-indigo-200 bg-indigo-50 text-indigo-800"
                emptyMessage="No notification-kind data"
                getRowHref={hrefFor("kind")}
              />
              <RankedPanel
                title="Issue severity"
                description="Severity assigned to flattened issue rows"
                rows={bySeverityRows}
                barClassName="bg-error-100/80"
                countBadgeClassName="border-error-200 bg-error-50 text-error-800"
                emptyMessage="No severity data"
              />
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-0">
            <RankedPanel
              title="Top messages"
              description="Repeated failure messages in the selected date range"
              rows={messageRows}
              barClassName="bg-rose-100/80"
              countBadgeClassName="border-rose-200 bg-rose-50 text-rose-800"
              emptyMessage="No failure messages"
              getRowHref={hrefFor("message")}
            />
          </TabsContent>
        </Tabs>
      </SectionContainer>

      <SectionContainer
        title="Failure impact"
        description="Volumes reported by failing runs. These totals do not include successful runs without notifications."
        icon={<DatabaseZap className="h-6 w-6 text-slate-600" />}
        variant="compact"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <ImpactPanel
            title="Fixture impact"
            description="Fixture processing reported by failing runs"
            total={sums.fixturesTotal}
            succeeded={sums.fixturesSucceeded}
            failed={sums.fixturesFailed}
            duration={formatDurationNoMillis(sums.durationMs)}
          />
          <ImpactPanel
            title="Ingest impact"
            description="Downstream ingest outcomes reported by failing runs"
            total={sums.ingest_total}
            succeeded={sums.ingest_success}
            failed={sums.ingest_failed}
            retried={sums.ingest_retried}
          />
        </div>
      </SectionContainer>
    </div>
  );
}
