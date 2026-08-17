"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  DatabaseZap,
  Layers3,
  ListFilter,
  MessageSquareWarning,
  Network,
  Tags,
  Target,
} from "lucide-react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  icon: ReactNode;
  rows: { key: string; count: number }[];
  emptyMessage: string;
  getRowHref?: (key: string) => string;
  tone: RankedPanelTone;
}

type RankedPanelTone =
  "amber" | "blue" | "violet" | "emerald" | "cyan" | "indigo" | "red" | "rose";

const rankedPanelTones: Record<
  RankedPanelTone,
  { border: string; icon: string; bar: string; count: string }
> = {
  amber: {
    border: "border-t-warning-400",
    icon: "bg-warning-50 text-warning-700",
    bar: "bg-warning-100/80",
    count: "border-warning-200 bg-warning-50 text-warning-800",
  },
  blue: {
    border: "border-t-info-400",
    icon: "bg-info-50 text-info-700",
    bar: "bg-info-100/80",
    count: "border-info-200 bg-info-50 text-info-800",
  },
  violet: {
    border: "border-t-violet-400",
    icon: "bg-violet-50 text-violet-700",
    bar: "bg-violet-100/80",
    count: "border-violet-200 bg-violet-50 text-violet-800",
  },
  emerald: {
    border: "border-t-success-400",
    icon: "bg-success-50 text-success-700",
    bar: "bg-success-100/80",
    count: "border-success-200 bg-success-50 text-success-800",
  },
  cyan: {
    border: "border-t-cyan-400",
    icon: "bg-cyan-50 text-cyan-700",
    bar: "bg-cyan-100/80",
    count: "border-cyan-200 bg-cyan-50 text-cyan-800",
  },
  indigo: {
    border: "border-t-indigo-400",
    icon: "bg-indigo-50 text-indigo-700",
    bar: "bg-indigo-100/80",
    count: "border-indigo-200 bg-indigo-50 text-indigo-800",
  },
  red: {
    border: "border-t-error-400",
    icon: "bg-error-50 text-error-700",
    bar: "bg-error-100/80",
    count: "border-error-200 bg-error-50 text-error-800",
  },
  rose: {
    border: "border-t-rose-400",
    icon: "bg-rose-50 text-rose-700",
    bar: "bg-rose-100/80",
    count: "border-rose-200 bg-rose-50 text-rose-800",
  },
};

function RankedPanel({
  title,
  description,
  icon,
  rows,
  emptyMessage,
  getRowHref,
  tone,
}: RankedPanelProps) {
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  const max = rows[0]?.count ?? 0;
  const palette = rankedPanelTones[tone];

  return (
    <Card
      className={`border-slate-200 border-t-2 shadow-none ${palette.border}`}
    >
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start gap-3">
          <div className={`rounded-md p-2 ${palette.icon}`}>{icon}</div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          {total > 0 ? (
            <Badge variant="outline" className={palette.count}>
              {total.toLocaleString()} total
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-1 px-4 pb-4 pt-0">
        {rows.length > 0 ? (
          rows.slice(0, 8).map((row) => {
            const percent =
              total > 0 ? Math.round((row.count / total) * 100) : 0;
            const width = max > 0 ? Math.max((row.count / max) * 100, 3) : 0;
            const href = getRowHref?.(row.key);
            const content = (
              <div className="group relative overflow-hidden rounded-md border border-transparent px-3 py-2.5 transition hover:border-slate-200 hover:bg-slate-50">
                <div
                  className={`absolute inset-y-0 left-0 transition ${palette.bar}`}
                  style={{ width: `${width}%` }}
                />
                <div className="relative flex items-center gap-3">
                  <div className="min-w-0 flex-1 truncate font-mono text-sm text-slate-800">
                    {row.key}
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-right">
                    <Badge variant="outline" className={palette.count}>
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
          })
        ) : (
          <div className="rounded-md border border-dashed border-slate-200 py-8 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ImpactCard({
  title,
  description,
  icon,
  total,
  succeeded,
  failed,
  retried,
  duration,
  accent,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  total: number;
  succeeded: number;
  failed: number;
  retried?: number;
  duration?: string;
  accent: "blue" | "indigo";
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
  const accentClasses =
    accent === "blue"
      ? {
          border: "border-t-info-400",
          icon: "bg-info-50 text-info-700",
          badge: "border-info-200 bg-info-50 text-info-800",
        }
      : {
          border: "border-t-indigo-400",
          icon: "bg-indigo-50 text-indigo-700",
          badge: "border-indigo-200 bg-indigo-50 text-indigo-800",
        };
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
    <Card
      className={`border-slate-200 border-t-2 shadow-none ${accentClasses.border}`}
    >
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start gap-3">
          <div className={`rounded-md p-2 ${accentClasses.icon}`}>{icon}</div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <Badge variant="outline" className={accentClasses.badge}>
            {formatRate(successRate)} success
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 px-4 pb-4 pt-0">
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
      </CardContent>
    </Card>
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
          <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="pipeline"
              className="gap-2 rounded-none border-b-2 border-transparent px-4 py-2.5 data-[state=active]:border-info-600 data-[state=active]:bg-info-50 data-[state=active]:text-info-800 data-[state=active]:shadow-none"
            >
              <Network className="h-4 w-4" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger
              value="data-area"
              className="gap-2 rounded-none border-b-2 border-transparent px-4 py-2.5 data-[state=active]:border-success-600 data-[state=active]:bg-success-50 data-[state=active]:text-success-800 data-[state=active]:shadow-none"
            >
              <Boxes className="h-4 w-4" />
              Data area
            </TabsTrigger>
            <TabsTrigger
              value="classification"
              className="gap-2 rounded-none border-b-2 border-transparent px-4 py-2.5 data-[state=active]:border-indigo-600 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-800 data-[state=active]:shadow-none"
            >
              <Tags className="h-4 w-4" />
              Classification
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="gap-2 rounded-none border-b-2 border-transparent px-4 py-2.5 data-[state=active]:border-rose-600 data-[state=active]:bg-rose-50 data-[state=active]:text-rose-800 data-[state=active]:shadow-none"
            >
              <MessageSquareWarning className="h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <RankedPanel
                title="Failure steps"
                description="Where issue handling stopped"
                icon={<ListFilter className="h-4 w-4" />}
                rows={byStepRows}
                tone="amber"
                emptyMessage="No failure-step data"
                getRowHref={hrefFor("step")}
              />
              <RankedPanel
                title="Services"
                description="Services emitting notifications"
                icon={<DatabaseZap className="h-4 w-4" />}
                rows={byServiceRows}
                tone="blue"
                emptyMessage="No service data"
                getRowHref={hrefFor("service")}
              />
              <RankedPanel
                title="Queues"
                description="Queues associated with failures"
                icon={<Network className="h-4 w-4" />}
                rows={byQueueRows}
                tone="violet"
                emptyMessage="No queue data"
                getRowHref={hrefFor("queueName")}
              />
            </div>
          </TabsContent>

          <TabsContent value="data-area" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <RankedPanel
                title="Notification scope"
                description="Broad scraper domains reporting failures"
                icon={<Boxes className="h-4 w-4" />}
                rows={byScopeRows}
                tone="emerald"
                emptyMessage="No notification-scope data"
                getRowHref={hrefFor("scope")}
              />
              <RankedPanel
                title="Issue scope"
                description="Granular domains attached to issue rows"
                icon={<Target className="h-4 w-4" />}
                rows={byIssueScopeRows}
                tone="cyan"
                emptyMessage="No issue-scope data"
                getRowHref={hrefFor("issueScope")}
              />
            </div>
          </TabsContent>

          <TabsContent value="classification" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <RankedPanel
                title="Notification kinds"
                description="Event types recorded by the notification feed"
                icon={<Tags className="h-4 w-4" />}
                rows={byKindRows}
                tone="indigo"
                emptyMessage="No notification-kind data"
                getRowHref={hrefFor("kind")}
              />
              <RankedPanel
                title="Issue severity"
                description="Severity assigned to flattened issue rows"
                icon={<AlertTriangle className="h-4 w-4" />}
                rows={bySeverityRows}
                tone="red"
                emptyMessage="No severity data"
              />
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-4">
            <RankedPanel
              title="Top messages"
              description="Repeated failure messages in the selected date range"
              icon={<MessageSquareWarning className="h-4 w-4" />}
              rows={messageRows}
              tone="rose"
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
          <ImpactCard
            title="Fixture impact"
            description="Fixture processing reported by failing runs"
            icon={<Boxes className="h-4 w-4" />}
            total={sums.fixturesTotal}
            succeeded={sums.fixturesSucceeded}
            failed={sums.fixturesFailed}
            duration={formatDurationNoMillis(sums.durationMs)}
            accent="blue"
          />
          <ImpactCard
            title="Ingest impact"
            description="Downstream ingest outcomes reported by failing runs"
            icon={<DatabaseZap className="h-4 w-4" />}
            total={sums.ingest_total}
            succeeded={sums.ingest_success}
            failed={sums.ingest_failed}
            retried={sums.ingest_retried}
            accent="indigo"
          />
        </div>
      </SectionContainer>
    </div>
  );
}
