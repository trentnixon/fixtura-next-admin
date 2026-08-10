"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, BarChart3 } from "lucide-react";
import type { NotificationHealthData } from "@/types/notificationHealth";
import type { NotificationIssuesLinkQuery } from "@/types/notificationIssues";
import { buildNotificationIssuesHref } from "../notifications/issues/utils/notificationIssuesUrl";
import { formatDurationNoMillis } from "@/utils/chart-formatters";
import {
  DimensionTable,
  formatRate,
  MetricLine,
  sortRecordEntries,
  StatCard,
} from "./notificationHealthUi";

interface NotificationHealthDetailPanelsProps {
  data: NotificationHealthData;
  issuesLinkQuery?: NotificationIssuesLinkQuery;
}

export function NotificationHealthDetailPanels({
  data,
  issuesLinkQuery,
}: NotificationHealthDetailPanelsProps) {
  const byStepRows = sortRecordEntries(data.issues.byStep);
  const byServiceRows = sortRecordEntries(data.byDimension.byService);
  const byScopeRows = sortRecordEntries(data.byDimension.byScope);
  const sums = data.metricsSums;

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Avg error rate (per row)"
          value={formatRate(data.rates.avgErrorRate)}
          icon={<BarChart3 className="h-5 w-5" />}
          description="Mean of stored errorRate per notification"
        />
        <StatCard
          title="Issue rows (flattened)"
          value={data.issues.totalIssueRows}
          icon={<AlertTriangle className="h-5 w-5" />}
          description={`${data.issues.retryableCount} retryable · ${data.issues.selectorDriftCount} selector drift`}
        />
      </div>

      {sums && (
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Volume sums (failing runs in window)
          </h3>
          <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <MetricLine label="Fixtures total" value={sums.fixturesTotal ?? 0} />
            <MetricLine
              label="Fixtures succeeded"
              value={sums.fixturesSucceeded ?? 0}
            />
            <MetricLine
              label="Fixtures failed"
              value={sums.fixturesFailed ?? 0}
            />
            <MetricLine
              label="Duration"
              value={formatDurationNoMillis(sums.durationMs ?? 0)}
            />
            <MetricLine label="Ingest total" value={sums.ingest_total ?? 0} />
            <MetricLine
              label="Ingest success"
              value={sums.ingest_success ?? 0}
            />
            <MetricLine label="Ingest failed" value={sums.ingest_failed ?? 0} />
            <MetricLine
              label="Ingest retried"
              value={sums.ingest_retried ?? 0}
            />
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-800">
              Issues by step
            </h3>
            {issuesLinkQuery && data.issues.totalIssueRows > 0 ? (
              <Link
                href={buildNotificationIssuesHref(issuesLinkQuery)}
                className="text-xs text-blue-600 hover:underline"
              >
                View all issues
              </Link>
            ) : null}
          </div>
          <DimensionTable
            rows={byStepRows}
            emptyMessage="No issue step breakdown"
            getRowHref={
              issuesLinkQuery
                ? (step) =>
                    buildNotificationIssuesHref(issuesLinkQuery, { step })
                : undefined
            }
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-800">Top messages</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.issues.topMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-slate-500">
                    No messages
                  </TableCell>
                </TableRow>
              ) : (
                data.issues.topMessages.map((row, i) => (
                  <TableRow key={`${i}-${row.message.slice(0, 64)}`}>
                    <TableCell className="max-w-[280px] truncate text-sm">
                      {row.message}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.count}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-800">By service</h3>
          <DimensionTable
            rows={byServiceRows}
            emptyMessage="No service dimension data"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-800">By scope</h3>
          <DimensionTable
            rows={byScopeRows}
            emptyMessage="No scope dimension data"
          />
        </div>
      </div>
    </div>
  );
}
