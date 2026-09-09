"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  OverviewDataWorkspace,
  type WorkspaceMetricTile,
} from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import type { JobSummary } from "@/types/scraperLogs";
import {
  getStatusBadgeClassName,
  getStatusBadgeVariant,
} from "../../utils/scraperJobBadges";

function formatDateTime(dateString: string | null): string {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return "—";
  }
}

function formatScopeLabel(scope: string | null | undefined): string {
  if (!scope) return "—";
  return scope.replace(/_/g, " ");
}

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

function buildEventMixChips(job: JobSummary): { key: string; text: string }[] {
  const c = job.eventCounts;
  const out: { key: string; text: string }[] = [];
  if (c.dequeued != null && c.dequeued > 0) {
    out.push({
      key: "dequeued",
      text: `${c.dequeued} ${plural(c.dequeued, "dequeued", "dequeued")}`,
    });
  }
  if (c.started > 0) {
    out.push({
      key: "started",
      text: `${c.started} ${plural(c.started, "started", "started")}`,
    });
  }
  if (c.heartbeat > 0) {
    out.push({
      key: "heartbeat",
      text: `${c.heartbeat} ${plural(c.heartbeat, "heartbeat", "heartbeats")}`,
    });
  }
  if (c.retry_later > 0) {
    out.push({
      key: "retry",
      text: `${c.retry_later} ${plural(c.retry_later, "retry", "retries")}`,
    });
  }
  if (c.completed > 0) {
    out.push({
      key: "completed",
      text: `${c.completed} ${plural(c.completed, "completed", "completed")}`,
    });
  }
  if (c.failed != null && c.failed > 0) {
    out.push({
      key: "failed",
      text: `${c.failed} ${plural(c.failed, "failed", "failed")}`,
    });
  }
  return out;
}

function displayText(value: string | null | undefined): string {
  const t = value?.trim();
  return t && t.length > 0 ? t : "—";
}

function Field({
  label,
  children,
  mono,
}: {
  label: string;
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 border-b border-slate-100 py-2 last:border-b-0">
      <p className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div
        className={`min-w-0 text-right text-sm text-foreground break-words ${mono ? "font-mono text-xs" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

function Identifier({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-all font-mono text-xs text-slate-800">{value}</p>
    </div>
  );
}

interface JobDetailHeaderProps {
  job: JobSummary;
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const mixChips = buildEventMixChips(job);
  const kindDisplay = displayText(job.kind);
  const humanStatus = job.status.replace(/_/g, " ");

  const metrics = useMemo((): WorkspaceMetricTile[] => {
    return [
      {
        id: "status",
        label: "Status",
        value: humanStatus,
        meta: formatScopeLabel(job.scope),
      },
      {
        id: "events",
        label: "Events",
        value: job.entryCount.toLocaleString(),
        meta: plural(job.entryCount, "log entry", "log entries"),
      },
      {
        id: "duration",
        label: "Duration",
        value: job.durationFormatted ?? "—",
        meta: `Started ${formatDateTime(job.startedAt)}`,
      },
      {
        id: "latest",
        label: "Latest event",
        value: formatDateTime(job.latestAt),
        meta: kindDisplay !== "—" ? kindDisplay : "Kind not set",
      },
    ];
  }, [humanStatus, job, kindDisplay]);

  return (
    <div className="space-y-4">
      <OverviewDataWorkspace
        title="Job snapshot"
        description={`${formatScopeLabel(job.scope)} run summary`}
        icon={Activity}
        badge={
          <Badge
            variant={getStatusBadgeVariant(job.status)}
            className={`${getStatusBadgeClassName(job.status)} capitalize`}
          >
            {humanStatus}
          </Badge>
        }
        metrics={metrics}
        columns={4}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <OverviewRecordPanel title="Run context" description="Scope, queue, and service">
          <div className="grid gap-x-6 sm:grid-cols-2">
            <div>
              <Field label="Scope">{formatScopeLabel(job.scope)}</Field>
              <Field label="Queue" mono>
                {displayText(job.queueName)}
              </Field>
            </div>
            <div>
              <Field label="Service">{displayText(job.service)}</Field>
              <Field label="Kind">
                {kindDisplay === "—" ? (
                  <span className="text-sm italic text-muted-foreground">
                    Not set
                  </span>
                ) : (
                  kindDisplay
                )}
              </Field>
            </div>
          </div>
        </OverviewRecordPanel>

        <OverviewRecordPanel title="Execution" description="Timing, attempt, and event mix">
          <div className="grid gap-x-6 sm:grid-cols-2">
            <div>
              <Field label="Started">{formatDateTime(job.startedAt)}</Field>
              <Field label="Attempt">
                {job.attempt != null ? String(job.attempt) : "—"}
              </Field>
            </div>
            <div>
              <Field label="Bull job" mono>
                {job.bullJobId != null && String(job.bullJobId).trim() !== ""
                  ? String(job.bullJobId)
                  : "—"}
              </Field>
            </div>
          </div>

          {mixChips.length > 0 ? (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Event mix
                </span>
                {mixChips.map(({ key, text }) => (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="px-2 py-0.5 font-mono text-xs font-normal tabular-nums"
                  >
                    {text}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </OverviewRecordPanel>
      </div>

      <OverviewRecordPanel
        title="Identifiers"
        description="Job and run IDs for cross-referencing logs and notifications"
      >
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
          <Identifier label="Job ID" value={displayText(job.jobId)} />
          <Identifier label="Run ID" value={displayText(job.runId)} />
        </div>
      </OverviewRecordPanel>
    </div>
  );
}
