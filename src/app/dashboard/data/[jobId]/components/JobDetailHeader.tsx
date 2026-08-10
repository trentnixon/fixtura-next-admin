"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Cpu, RefreshCw, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

function MetricCell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 border-b border-r border-slate-200 px-3 py-2 last:border-r-0 sm:border-b-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 truncate text-sm font-semibold text-slate-900">
        {children}
      </div>
    </div>
  );
}

interface JobDetailHeaderProps {
  job: JobSummary;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function JobDetailHeader({
  job,
  onRefresh,
  isRefreshing = false,
}: JobDetailHeaderProps) {
  const mixChips = buildEventMixChips(job);
  const kindDisplay = displayText(job.kind);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="secondary" size="sm" asChild className="w-fit">
          <Link href="/dashboard/data">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Data
          </Link>
        </Button>
        {onRefresh != null && (
          <Button
            variant="accent"
            size="sm"
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="grid sm:grid-cols-4">
          <MetricCell label="Status">
            <Badge
              variant={getStatusBadgeVariant(job.status)}
              className={`${getStatusBadgeClassName(job.status)} px-2 py-0.5 text-xs capitalize`}
            >
              {job.status.replace(/_/g, " ")}
            </Badge>
          </MetricCell>
          <MetricCell label="Events">
            <span className="tabular-nums">
              {job.entryCount.toLocaleString()}
            </span>{" "}
            <span className="font-normal text-muted-foreground">
              {plural(job.entryCount, "event", "events")} in this job
            </span>
          </MetricCell>
          <MetricCell label="Duration">
            <span className="tabular-nums">{job.durationFormatted ?? "-"}</span>
          </MetricCell>
          <MetricCell label="Latest event">
            <span className="text-xs font-medium">
              {formatDateTime(job.latestAt)}
            </span>
          </MetricCell>
        </div>

        {mixChips.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50/70 px-3 py-2">
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
        )}

        <Separator />

        <div className="grid gap-5 p-4 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-4 min-w-0">
            <SectionTitle icon={Route} title="Routing" />
            <div>
              <Field label="Scope">{formatScopeLabel(job.scope)}</Field>
              <Field label="Queue" mono>
                {displayText(job.queueName)}
              </Field>
              <Field label="Run ID" mono>
                {displayText(job.runId)}
              </Field>
            </div>
          </div>

          <div className="space-y-4 min-w-0 lg:border-l lg:border-border/80 lg:pl-8">
            <SectionTitle icon={Cpu} title="Worker" />
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
              <Field label="Bull job" mono>
                {job.bullJobId != null && String(job.bullJobId).trim() !== ""
                  ? String(job.bullJobId)
                  : "—"}
              </Field>
              <Field label="Attempt">
                {job.attempt != null ? String(job.attempt) : "—"}
              </Field>
            </div>
          </div>

          <div className="space-y-4 min-w-0 lg:border-l lg:border-border/80 lg:pl-8">
            <SectionTitle icon={Clock} title="Timeline" />
            <div>
              <Field label="Duration">
                <span className="tabular-nums font-medium">
                  {job.durationFormatted ?? "—"}
                </span>
              </Field>
              <Field label="Started">{formatDateTime(job.startedAt)}</Field>
              <Field label="Latest event">{formatDateTime(job.latestAt)}</Field>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
