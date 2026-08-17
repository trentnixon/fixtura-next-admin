"use client";

import type { ComponentType, ReactNode } from "react";
import { Activity, Clock, Cpu, Fingerprint, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

/** Non-zero event counts for the mix row (ordered for readability). */
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

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600">
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
      </span>
      {title}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  children,
  className,
  iconClassName,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
  className: string;
  iconClassName: string;
}) {
  return (
    <div className={`min-h-[96px] rounded-lg border p-3.5 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <Icon className={`h-4 w-4 ${iconClassName}`} aria-hidden />
      </div>
      <div className="mt-3 text-base font-semibold text-slate-900">
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

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Activity}
          label="Status"
          className="border-slate-200 bg-slate-50/70"
          iconClassName="text-slate-500"
        >
          <div className="flex items-center">
            <Badge
              variant={getStatusBadgeVariant(job.status)}
              className={`${getStatusBadgeClassName(job.status)} px-2 py-0.5 text-xs capitalize`}
            >
              {job.status.replace(/_/g, " ")}
            </Badge>
          </div>
        </MetricCard>

        <MetricCard
          icon={Route}
          label="Events"
          className="border-info-200 bg-info-50/70"
          iconClassName="text-info-700"
        >
          <span className="tabular-nums">
            {job.entryCount.toLocaleString()}
          </span>{" "}
          <span className="text-xs font-normal text-muted-foreground">
            {plural(job.entryCount, "event", "events")}
          </span>
        </MetricCard>

        <MetricCard
          icon={Clock}
          label="Duration"
          className="border-amber-200 bg-amber-50/70"
          iconClassName="text-amber-700"
        >
          <span className="tabular-nums">{job.durationFormatted ?? "—"}</span>
        </MetricCard>

        <MetricCard
          icon={Clock}
          label="Latest event"
          className="border-emerald-200 bg-emerald-50/60"
          iconClassName="text-emerald-700"
        >
          <span className="text-sm font-medium">
            {formatDateTime(job.latestAt)}
          </span>
        </MetricCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <SectionTitle icon={Route} title="Run context" />
          <div className="mt-3 grid gap-x-6 sm:grid-cols-2">
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
                  <span className="text-muted-foreground italic text-sm">
                    Not set
                  </span>
                ) : (
                  kindDisplay
                )}
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <SectionTitle icon={Cpu} title="Execution" />
          <div className="mt-3 grid gap-x-6 sm:grid-cols-2">
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
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
        <SectionTitle icon={Fingerprint} title="Identifiers" />
        <div className="mt-3 grid gap-4 lg:grid-cols-2 lg:gap-8">
          <Identifier label="Job ID" value={displayText(job.jobId)} />
          <Identifier label="Run ID" value={displayText(job.runId)} />
        </div>
      </section>
    </div>
  );
}
