"use client";

import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ImageIcon,
} from "lucide-react";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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

function ContextDot({
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
    <span className="inline-flex min-w-0 items-center gap-1">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "max-w-[140px] truncate text-[11px] text-slate-700",
          mono && "font-mono",
        )}
        title={value}
      >
        {value}
      </span>
    </span>
  );
}

const badgeCompactClass = "h-5 px-1.5 py-0 text-[10px] font-medium";

export function NotificationIssuesList({
  issues,
  includeArtifacts,
}: NotificationIssuesListProps) {
  const router = useRouter();
  const { Domain } = useGlobalContext();
  const cmsOrigin = Domain.strapi;

  if (issues.length === 0) {
    return (
      <EmptyState
        variant="minimal"
        title="No matching issue rows"
        description="No failure notifications matched this date range and filter set. This is not proof that every scrape succeeded."
        icon={<AlertTriangle className="h-8 w-8 text-muted-foreground" />}
      />
    );
  }

  return (
    <ScrollArea className="h-[min(65vh,640px)]">
      <div className="space-y-2 pr-3">
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
                "overflow-hidden border-l-[3px] border-slate-200 shadow-none transition hover:border-slate-300",
                tone.border,
              )}
            >
              <CardContent className="p-0">
                <div
                  className={cn(
                    "grid",
                    includeArtifacts
                      ? "lg:grid-cols-[minmax(0,1fr)_108px]"
                      : "grid-cols-1",
                  )}
                >
                  <div className="min-w-0 px-2.5 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                        <Badge
                          variant="outline"
                          className={cn(badgeCompactClass, tone.severity)}
                        >
                          {tone.severityLabel}
                        </Badge>
                        <Badge
                          variant={stepBadgeVariant(row.step)}
                          className={cn(
                            badgeCompactClass,
                            "font-mono uppercase tracking-wide",
                          )}
                        >
                          {formatStepLabel(row.step)}
                        </Badge>
                        {row.retryable ? (
                          <Badge
                            variant="outline"
                            className={cn(
                              badgeCompactClass,
                              "border-info-200 bg-info-50 text-info-800",
                            )}
                          >
                            Retry
                          </Badge>
                        ) : null}
                        {row.selectorDriftSignal ? (
                          <Badge
                            variant="outline"
                            className={cn(
                              badgeCompactClass,
                              "border-violet-200 bg-violet-50 text-violet-800",
                            )}
                          >
                            Drift
                          </Badge>
                        ) : null}
                        {row.fixtureKey ? (
                          <Badge
                            variant="outline"
                            className={cn(
                              badgeCompactClass,
                              "max-w-[160px] truncate border-slate-200 bg-slate-50 font-mono text-slate-700",
                            )}
                            title={row.fixtureKey}
                          >
                            {row.fixtureKey}
                          </Badge>
                        ) : null}
                      </div>

                      <span
                        className="hidden shrink-0 text-[11px] text-muted-foreground sm:inline"
                        title={when.title || undefined}
                      >
                        {when.label}
                      </span>

                      {href ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-6 shrink-0 gap-1 px-2 text-[11px] border-slate-200 bg-slate-50 text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-900"
                          onClick={() => router.push(href)}
                        >
                          Run
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      ) : null}
                    </div>

                    <p
                      className="mt-1 line-clamp-1 text-sm font-medium leading-tight text-slate-900"
                      title={row.message ?? undefined}
                    >
                      {row.message ?? "No issue message supplied"}
                    </p>

                    {page ? (
                      <a
                        href={row.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 inline-flex max-w-full items-center gap-1 text-[11px] text-info-700 hover:underline"
                        title={page.title}
                      >
                        <span className="truncate">{page.label}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : null}

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 divide-x-0 text-[11px]">
                      <ContextDot
                        label="Svc"
                        value={row.notification.service}
                        mono
                      />
                      <ContextDot
                        label="Scope"
                        value={
                          row.notification.scope
                            ? formatScopeLabel(row.notification.scope)
                            : null
                        }
                      />
                      <ContextDot
                        label="Queue"
                        value={row.notification.queueName}
                        mono
                      />
                      <ContextDot
                        label="Kind"
                        value={row.notification.kind}
                        mono
                      />
                      <ContextDot
                        label="Issue"
                        value={row.issueScope}
                        mono
                      />
                      <span
                        className="text-[11px] text-muted-foreground sm:hidden"
                        title={when.title || undefined}
                      >
                        {when.label}
                      </span>
                    </div>
                  </div>

                  {includeArtifacts ? (
                    <div className="flex items-center justify-center border-t border-slate-100 bg-slate-50/80 p-1.5 lg:border-l lg:border-t-0">
                      {imageUrl ? (
                        <a
                          href={imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative block w-full overflow-hidden rounded border border-slate-200 bg-white"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt="Issue screenshot"
                            className="h-14 w-full object-cover transition group-hover:scale-[1.02]"
                            loading="lazy"
                          />
                        </a>
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                          <ImageIcon className="h-4 w-4" />
                          <span className="text-[10px]">None</span>
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
    </ScrollArea>
  );
}
