"use client";

import {
  formatIssueUrl,
  formatIssueWhen,
  formatStepLabel,
  stepBadgeVariant,
} from "@/app/dashboard/notifications/issues/utils/notificationIssuesTableUi";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScraperArtifacts } from "@/hooks/data-collection/useScraperArtifacts";
import { resolveStrapiMediaUrl } from "@/lib/utils/strapiMediaUrl";
import type { ScraperArtifact } from "@/types/scraperArtifact";
import type { ScrapeIssue } from "@/types/scraperLogs";
import { cn } from "@/lib/utils";
import { ExternalLink, ImageIcon } from "lucide-react";

const SCRAPER_ARTIFACT_BASE_URL =
  typeof process.env.NEXT_PUBLIC_SCRAPER_ARTIFACT_BASE_URL === "string"
    ? process.env.NEXT_PUBLIC_SCRAPER_ARTIFACT_BASE_URL.replace(/\/$/, "")
    : "";

const issueBadgeCompactClass = "h-5 px-1.5 py-0 text-[10px] font-medium";

function artifactFileHref(relativePath: string): string | null {
  if (!SCRAPER_ARTIFACT_BASE_URL) return null;
  const path = relativePath.replace(/^\//, "");
  return `${SCRAPER_ARTIFACT_BASE_URL}/${path}`;
}

function isImageArtifactPath(path: string): boolean {
  return (
    /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(path) ||
    /screenshot/i.test(path)
  );
}

function pickImageArtifactRef(refs: string[]): string | null {
  return refs.find(isImageArtifactPath) ?? null;
}

function isImageCmsArtifact(artifact: ScraperArtifact): boolean {
  const mime = artifact.file?.mime ?? artifact.contentType ?? "";
  if (mime.startsWith("image/")) return true;
  return artifact.artifactType === "screenshot";
}

function artifactBasename(path: string): string {
  return path.replace(/\\/g, "/").split("/").pop() ?? path;
}

function matchCmsArtifactForIssue(
  issue: ScrapeIssue,
  artifacts: ScraperArtifact[],
): ScraperArtifact | null {
  const imageArtifacts = artifacts.filter(isImageCmsArtifact);
  if (imageArtifacts.length === 0) return null;

  if (issue.fixtureKey) {
    const byFixture = imageArtifacts.find(
      (artifact) => artifact.fixtureKey === issue.fixtureKey,
    );
    if (byFixture) return byFixture;
  }

  const refs = issue.artifactRefs?.filter(Boolean) ?? [];
  for (const ref of refs) {
    const base = artifactBasename(ref);
    const byName = imageArtifacts.find((artifact) => {
      const name = artifact.file?.name ?? "";
      return (
        name === base || ref.endsWith(name) || (name && name.endsWith(base))
      );
    });
    if (byName) return byName;
  }

  return null;
}

function resolveIssueScreenshotUrl(
  issue: ScrapeIssue,
  artifacts: ScraperArtifact[],
  cmsOrigin: string,
): string | null {
  const cmsMatch = matchCmsArtifactForIssue(issue, artifacts);
  if (cmsMatch) {
    const cmsUrl = resolveStrapiMediaUrl(cmsMatch.file?.url, cmsOrigin);
    if (cmsUrl) return cmsUrl;
  }

  const imageRef = pickImageArtifactRef(
    issue.artifactRefs?.filter(Boolean) ?? [],
  );
  if (imageRef) return artifactFileHref(imageRef);

  return null;
}

export function issueTargetUrl(issue: ScrapeIssue): string | null {
  const u = issue.url?.trim();
  return u && u.length > 0 ? u : null;
}

function normalizeSeverityKey(severity: string | undefined): string {
  const t = (severity ?? "").trim().toUpperCase();
  return t || "OTHER";
}

function completionIssueTone(severity: string): {
  border: string;
  badge: string;
} {
  switch (severity) {
    case "FATAL":
      return {
        border: "border-l-error-500",
        badge: "border-error-200 bg-error-50 text-error-800",
      };
    case "ERROR":
      return {
        border: "border-l-error-400",
        badge: "border-error-200 bg-error-50 text-error-800",
      };
    case "WARN":
      return {
        border: "border-l-warning-400",
        badge: "border-warning-200 bg-warning-50 text-warning-800",
      };
    case "INFO":
      return {
        border: "border-l-info-400",
        badge: "border-info-200 bg-info-50 text-info-800",
      };
    case "DEBUG":
      return {
        border: "border-l-violet-400",
        badge: "border-violet-200 bg-violet-50 text-violet-800",
      };
    default:
      return {
        border: "border-l-slate-300",
        badge: "border-slate-200 bg-slate-50 text-slate-700",
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
          "max-w-[160px] truncate text-[11px] text-slate-700",
          mono && "font-mono",
        )}
        title={value}
      >
        {value}
      </span>
    </span>
  );
}

function issueWhen(
  issue: ScrapeIssue,
  reportedAt: string | null,
): { label: string; title: string } {
  const raw = issue as ScrapeIssue & {
    timestamp?: string;
    occurredAt?: string;
    createdAt?: string;
  };
  const iso = raw.occurredAt ?? raw.timestamp ?? raw.createdAt ?? reportedAt;
  return formatIssueWhen(iso);
}

export function coerceScrapeIssues(issues: unknown[]): ScrapeIssue[] {
  return issues.map((issue) => {
    if (issue && typeof issue === "object" && !Array.isArray(issue)) {
      return issue as ScrapeIssue;
    }
    return { message: String(issue) };
  });
}

function CompletionIssueCard({
  issue,
  reportedAt,
  screenshotUrl,
  artifactsLoading = false,
}: {
  issue: ScrapeIssue;
  reportedAt: string | null;
  screenshotUrl: string | null;
  artifactsLoading?: boolean;
}) {
  const severity = normalizeSeverityKey(issue.severity);
  const tone = completionIssueTone(severity);
  const targetUrl = issueTargetUrl(issue);
  const isHttp = targetUrl != null && /^https?:\/\//i.test(targetUrl);
  const page = targetUrl && isHttp ? formatIssueUrl(targetUrl) : null;
  const when = issueWhen(issue, reportedAt);
  const message = issue.message?.trim() || "No issue message supplied";
  const artifactRefs = issue.artifactRefs?.filter(Boolean) ?? [];
  const hasImageArtifactRef = pickImageArtifactRef(artifactRefs) != null;
  const nonImageArtifactRefs = artifactRefs.filter(
    (path) => !isImageArtifactPath(path),
  );
  const showArtifactColumn =
    Boolean(screenshotUrl) ||
    hasImageArtifactRef ||
    (artifactsLoading && Boolean(issue.fixtureKey || hasImageArtifactRef));

  return (
    <Card
      className={cn(
        "overflow-hidden border-l-[3px] border-slate-200 shadow-none",
        tone.border,
      )}
    >
      <CardContent className="p-0">
        <div
          className={cn(
            "grid",
            showArtifactColumn
              ? "lg:grid-cols-[minmax(0,1fr)_108px]"
              : "grid-cols-1",
          )}
        >
          <div className="min-w-0 px-2.5 py-2">
            <div className="flex items-center gap-2">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                <Badge
                  variant="outline"
                  className={cn(issueBadgeCompactClass, tone.badge)}
                >
                  {severity}
                </Badge>
                {issue.step ? (
                  <Badge
                    variant={stepBadgeVariant(issue.step)}
                    className={cn(
                      issueBadgeCompactClass,
                      "font-mono uppercase tracking-wide",
                    )}
                  >
                    {formatStepLabel(issue.step)}
                  </Badge>
                ) : null}
                {issue.retryable ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      issueBadgeCompactClass,
                      "border-info-200 bg-info-50 text-info-800",
                    )}
                  >
                    Retry
                  </Badge>
                ) : null}
                {issue.selectorDriftSignal ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      issueBadgeCompactClass,
                      "border-violet-200 bg-violet-50 text-violet-800",
                    )}
                  >
                    Drift
                  </Badge>
                ) : null}
                {issue.botSignal ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      issueBadgeCompactClass,
                      "border-amber-200 bg-amber-50 text-amber-800",
                    )}
                  >
                    Bot
                  </Badge>
                ) : null}
                {issue.fixtureKey ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      issueBadgeCompactClass,
                      "max-w-[160px] truncate border-slate-200 bg-slate-50 font-mono text-slate-700",
                    )}
                    title={issue.fixtureKey}
                  >
                    {issue.fixtureKey}
                  </Badge>
                ) : null}
              </div>

              <span
                className="hidden shrink-0 text-[11px] text-muted-foreground sm:inline"
                title={when.title || undefined}
              >
                {when.label}
              </span>
            </div>

            <p
              className="mt-1 line-clamp-2 text-sm font-medium leading-tight text-slate-900"
              title={message}
            >
              {message}
            </p>

            {page ? (
              <a
                href={targetUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex max-w-full items-center gap-1 text-[11px] text-info-700 hover:underline"
                title={page.title}
              >
                <span className="truncate">{page.label}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            ) : targetUrl ? (
              <span
                className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground"
                title={targetUrl}
              >
                {targetUrl}
              </span>
            ) : null}

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
              <ContextDot
                label="Class"
                value={issue.failureClass ?? undefined}
                mono
              />
              <ContextDot label="Scope" value={issue.scope ?? undefined} mono />
              <ContextDot
                label="Selector"
                value={issue.selector ?? undefined}
                mono
              />
              <ContextDot
                label="Fix"
                value={issue.remediation ?? undefined}
              />
              {nonImageArtifactRefs.length > 0 ? (
                <span
                  className="text-[11px] text-muted-foreground"
                  title={nonImageArtifactRefs.join("\n")}
                >
                  +{nonImageArtifactRefs.length} file
                  {nonImageArtifactRefs.length === 1 ? "" : "s"}
                </span>
              ) : null}
              <span
                className="text-[11px] text-muted-foreground sm:hidden"
                title={when.title || undefined}
              >
                {when.label}
              </span>
            </div>
          </div>

          {showArtifactColumn ? (
            <div className="flex items-center justify-center border-t border-slate-100 bg-slate-50/80 p-1.5 lg:border-l lg:border-t-0">
              {artifactsLoading ? (
                <div className="flex h-14 w-full animate-pulse items-center justify-center rounded border border-dashed border-slate-200 bg-white">
                  <ImageIcon className="h-4 w-4 text-slate-300" />
                </div>
              ) : screenshotUrl ? (
                <a
                  href={screenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block w-full overflow-hidden rounded border border-slate-200 bg-white"
                  title="Open capture"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screenshotUrl}
                    alt="Issue capture"
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
}

export function CompletionIssuesList({
  issues,
  reportedAt,
  jobId,
}: {
  issues: ScrapeIssue[];
  reportedAt: string | null;
  jobId: string;
}) {
  const { Domain } = useGlobalContext();
  const { artifacts, isLoading: artifactsLoading } = useScraperArtifacts({
    jobId,
  });

  if (issues.length === 0) {
    return <p className="text-sm text-muted-foreground">No issues recorded.</p>;
  }

  const cards = issues.map((issue, index) => (
    <CompletionIssueCard
      key={`${normalizeSeverityKey(issue.severity)}-${issue.message ?? "issue"}-${index}`}
      issue={issue}
      reportedAt={reportedAt}
      screenshotUrl={resolveIssueScreenshotUrl(issue, artifacts, Domain.strapi)}
      artifactsLoading={artifactsLoading}
    />
  ));

  if (issues.length <= 8) {
    return <div className="space-y-2">{cards}</div>;
  }

  return (
    <ScrollArea className="h-[min(65vh,640px)]">
      <div className="space-y-2 pr-3">{cards}</div>
    </ScrollArea>
  );
}
