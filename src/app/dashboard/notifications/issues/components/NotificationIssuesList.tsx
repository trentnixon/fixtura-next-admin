"use client";

import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ImageIcon,
} from "lucide-react";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatScopeLabel } from "@/app/dashboard/data/utils/formatScrapeScope";
import { cn } from "@/lib/utils";
import { resolveStrapiMediaUrl } from "@/lib/utils/strapiMediaUrl";
import type { NotificationIssueRow } from "@/types/notificationIssues";
import {
  formatIssueUrl,
  formatIssueWhen,
  formatStepLabel,
  pickIssueScreenshotArtifact,
  stepBadgeVariant,
} from "../utils/notificationIssuesTableUi";

interface NotificationIssuesListProps {
  issues: NotificationIssueRow[];
  includeArtifacts: boolean;
}

function jobHref(jobId: string): string {
  return `/dashboard/data/${encodeURIComponent(jobId)}`;
}

function rowHref(row: NotificationIssueRow): string | null {
  const jobId = row.notification.jobId;
  if (!jobId) return null;
  const base = jobHref(jobId);
  return row.notification.runId
    ? `${base}?runId=${encodeURIComponent(row.notification.runId)}`
    : base;
}

function issueTone(row: NotificationIssueRow): {
  border: string;
  severity: string;
  severityLabel: string;
} {
  if (row.notification.fatal) {
    return {
      border: "border-l-error-500",
      severity: "border-error-200 bg-error-50 text-error-800",
      severityLabel: "Fatal",
    };
  }

  switch (row.severity?.toLowerCase()) {
    case "error":
    case "high":
      return {
        border: "border-l-error-400",
        severity: "border-error-200 bg-error-50 text-error-800",
        severityLabel: row.severity ?? "Error",
      };
    case "warning":
    case "medium":
      return {
        border: "border-l-warning-400",
        severity: "border-warning-200 bg-warning-50 text-warning-800",
        severityLabel: row.severity ?? "Warning",
      };
    default:
      return {
        border: "border-l-info-400",
        severity: "border-info-200 bg-info-50 text-info-800",
        severityLabel: row.severity ?? "Issue",
      };
  }
}

function ContextItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="inline-flex min-w-0 items-baseline gap-1 whitespace-nowrap">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "max-w-[190px] truncate text-xs font-medium text-slate-700",
          mono && "font-mono",
        )}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

export function NotificationIssuesList({
  issues,
  includeArtifacts,
}: NotificationIssuesListProps) {
  const router = useRouter();
  const { Domain } = useGlobalContext();
  const cmsOrigin = Domain.strapi;

  if (issues.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/60 px-5 py-12 text-center">
        <AlertTriangle className="mx-auto h-7 w-7 text-slate-400" />
        <p className="mt-3 text-sm font-medium text-slate-700">
          No matching issue rows
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          No failure notifications matched this date range and filter set. This
          is not proof that every scrape succeeded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((row) => {
        const href = rowHref(row);
        const key = `${row.notification.id}-${row.issueIndex}`;
        const when = formatIssueWhen(row.notification.createdAt);
        const page = row.url ? formatIssueUrl(row.url) : null;
        const tone = issueTone(row);
        const artifact = includeArtifacts
          ? pickIssueScreenshotArtifact(row.artifacts)
          : null;
        const imageUrl = resolveStrapiMediaUrl(artifact?.fileUrl, cmsOrigin);

        return (
          <Card
            key={key}
            className={cn(
              "overflow-hidden border-l-4 border-slate-200 shadow-none transition hover:border-slate-300 hover:shadow-sm",
              tone.border,
            )}
          >
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-[minmax(0,1fr)_180px]">
                <div className="min-w-0 p-3.5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={tone.severity}>
                        {tone.severityLabel}
                      </Badge>
                      <Badge
                        variant={stepBadgeVariant(row.step)}
                        className="font-mono text-[10px] font-medium uppercase tracking-wide"
                      >
                        {formatStepLabel(row.step)}
                      </Badge>
                      {row.retryable ? (
                        <Badge
                          variant="outline"
                          className="border-info-200 bg-info-50 text-info-800"
                        >
                          Retryable
                        </Badge>
                      ) : null}
                      {row.selectorDriftSignal ? (
                        <Badge
                          variant="outline"
                          className="border-violet-200 bg-violet-50 text-violet-800"
                        >
                          Selector drift
                        </Badge>
                      ) : null}
                      {row.fixtureKey ? (
                        <Badge
                          variant="outline"
                          className="max-w-[220px] truncate border-slate-200 bg-slate-50 font-mono text-slate-700"
                          title={row.fixtureKey}
                        >
                          Fixture: {row.fixtureKey}
                        </Badge>
                      ) : null}
                    </div>
                    <span
                      className="shrink-0 text-xs font-medium text-muted-foreground"
                      title={when.title || undefined}
                    >
                      {when.label}
                    </span>
                  </div>

                  <p
                    className="mt-2 text-sm font-semibold leading-snug text-slate-900"
                    title={row.message ?? undefined}
                  >
                    {row.message ?? "No issue message supplied"}
                  </p>

                  {page ? (
                    <a
                      href={row.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex max-w-full items-center gap-1.5 text-xs text-info-700 hover:underline"
                      title={page.title}
                    >
                      <span className="truncate">{page.label}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                    <ContextItem
                      label="Service"
                      value={row.notification.service}
                      mono
                    />
                    <ContextItem
                      label="Scope"
                      value={
                        row.notification.scope
                          ? formatScopeLabel(row.notification.scope)
                          : null
                      }
                    />
                    <ContextItem
                      label="Queue"
                      value={row.notification.queueName}
                      mono
                    />
                    <ContextItem
                      label="Kind"
                      value={row.notification.kind}
                      mono
                    />
                    <ContextItem
                      label="Issue scope"
                      value={row.issueScope}
                      mono
                    />
                    {href ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="ml-auto h-7 shrink-0 gap-1.5 px-2.5"
                        onClick={() => router.push(href)}
                      >
                        Open run
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>

                {includeArtifacts ? (
                  <div className="flex min-h-[112px] items-center justify-center border-t border-slate-200 bg-slate-50 p-3 lg:border-l lg:border-t-0">
                    {imageUrl ? (
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block w-full overflow-hidden rounded-md border border-slate-200 bg-white"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt="Issue screenshot"
                          className="h-24 w-full object-cover transition group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                        <span className="absolute bottom-1.5 right-1.5 rounded bg-slate-950/75 px-1.5 py-0.5 text-[10px] text-white">
                          Open evidence
                        </span>
                      </a>
                    ) : (
                      <div className="text-center text-slate-400">
                        <ImageIcon className="mx-auto h-5 w-5" />
                        <div className="mt-1 text-[11px]">No screenshot</div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
