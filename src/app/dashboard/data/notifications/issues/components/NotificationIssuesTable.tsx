"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { NotificationIssueRow } from "@/types/notificationIssues";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { resolveStrapiMediaUrl } from "@/lib/utils/strapiMediaUrl";
import { ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatScopeLabel } from "../../../utils/formatScrapeScope";
import { truncateMiddle } from "../../../utils/formatScraperJobDisplay";
import {
  formatIssueUrl,
  formatIssueWhen,
  formatStepLabel,
  pickIssueScreenshotArtifact,
  stepBadgeVariant,
} from "../utils/notificationIssuesTableUi";

interface NotificationIssuesTableProps {
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
  const runId = row.notification.runId;
  if (runId) {
    return `${base}?runId=${encodeURIComponent(runId)}`;
  }
  return base;
}

function IssueJobCell({ row }: { row: NotificationIssueRow }) {
  const jobId = row.notification.jobId;
  const runId = row.notification.runId;
  const scope = row.notification.scope;

  if (!jobId && !runId && !scope) {
    return <span className="text-sm text-slate-400">—</span>;
  }

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      {scope ? (
        <span className="text-sm font-medium text-slate-800">
          {formatScopeLabel(scope)}
        </span>
      ) : null}
      {jobId ? (
        <Link
          href={jobHref(jobId)}
          className="truncate font-mono text-xs text-blue-600 hover:underline"
          title={`Job: ${jobId}`}
          onClick={(e) => e.stopPropagation()}
        >
          {truncateMiddle(jobId, 36)}
        </Link>
      ) : null}
      {runId ? (
        <span
          className="truncate font-mono text-[11px] text-muted-foreground"
          title={`Run: ${runId}`}
        >
          {runId}
        </span>
      ) : null}
    </div>
  );
}

export function NotificationIssuesTable({
  issues,
  includeArtifacts,
}: NotificationIssuesTableProps) {
  const router = useRouter();
  const { Domain } = useGlobalContext();
  const cmsOrigin = Domain.strapi;

  if (issues.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center text-sm text-slate-500">
        No issue rows in this window with the current filters. This means no
        failure notifications were stored—not proof that all scrapes succeeded
        globally.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200">
      <Table className="min-w-[920px]">
        <TableHeader>
          <TableRow className="bg-slate-100 hover:bg-slate-100">
            <TableHead className="w-[96px]">Date</TableHead>
            <TableHead className="min-w-[280px]">Issue</TableHead>
            <TableHead className="w-[160px]">Page</TableHead>
            <TableHead className="w-[200px]">Job / run</TableHead>
            <TableHead className="w-[120px]">Flags</TableHead>
            {includeArtifacts ? (
              <TableHead className="w-[88px]">Shot</TableHead>
            ) : null}
            <TableHead className="w-[72px] text-right">Open</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((row) => {
            const href = rowHref(row);
            const key = `${row.notification.id}-${row.issueIndex}`;
            const when = formatIssueWhen(row.notification.createdAt);
            const page = row.url ? formatIssueUrl(row.url) : null;
            const hasFlags = row.retryable || row.selectorDriftSignal;

            return (
              <TableRow
                key={key}
                className={cn(
                  "align-top",
                  href && "cursor-pointer hover:bg-slate-50/80",
                )}
                onClick={() => {
                  if (href) router.push(href);
                }}
              >
                <TableCell className="whitespace-nowrap py-3 text-sm text-slate-700">
                  <span title={when.title || undefined}>{when.label}</span>
                </TableCell>

                <TableCell className="py-3">
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <Badge
                      variant={stepBadgeVariant(row.step)}
                      className="w-fit font-mono text-[10px] font-medium uppercase tracking-wide"
                    >
                      {formatStepLabel(row.step)}
                    </Badge>
                    <p
                      className="line-clamp-2 text-sm leading-snug text-slate-800"
                      title={row.message ?? undefined}
                    >
                      {row.message ?? "—"}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="py-3">
                  {page ? (
                    <a
                      href={row.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex max-w-full items-start gap-1 text-sm text-blue-600 hover:underline"
                      title={page.title}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="line-clamp-2 min-w-0 break-all leading-snug">
                        {page.label}
                      </span>
                      <ExternalLink
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70 group-hover:opacity-100"
                        aria-hidden
                      />
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </TableCell>

                <TableCell className="py-3">
                  <IssueJobCell row={row} />
                </TableCell>

                <TableCell className="py-3">
                  {hasFlags ? (
                    <div className="flex flex-col items-start gap-1">
                      {row.retryable ? (
                        <Badge variant="outline" className="text-[10px]">
                          Retryable
                        </Badge>
                      ) : null}
                      {row.selectorDriftSignal ? (
                        <Badge variant="warning" className="text-[10px]">
                          Drift
                        </Badge>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </TableCell>

                {includeArtifacts ? (
                  <TableCell className="py-3">
                    {(() => {
                      const artifact = pickIssueScreenshotArtifact(row.artifacts);
                      const imageUrl = resolveStrapiMediaUrl(
                        artifact?.fileUrl,
                        cmsOrigin
                      );
                      if (!imageUrl) {
                        return (
                          <span
                            className="text-xs text-slate-400"
                            title={
                              row.artifacts.length > 0
                                ? "Artifact row(s) returned but no displayable file URL"
                                : "No CMS artifact matched this issue (common for navigation timeouts)"
                            }
                          >
                            —
                          </span>
                        );
                      }
                      return (
                        <a
                          href={imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt="Issue screenshot"
                            className="h-12 w-auto max-w-[72px] rounded border object-cover shadow-sm"
                            loading="lazy"
                          />
                        </a>
                      );
                    })()}
                  </TableCell>
                ) : null}

                <TableCell className="py-3 text-right">
                  {href ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-0.5 px-2 text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(href);
                      }}
                    >
                      Run
                      <ChevronRight className="h-4 w-4" aria-hidden />
                    </Button>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
