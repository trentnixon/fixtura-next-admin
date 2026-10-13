"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ImageIcon,
  Layers,
} from "lucide-react";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatScopeLabel } from "@/app/dashboard/data/utils/formatScrapeScope";
import { cn } from "@/lib/utils";
import { resolveStrapiMediaUrl } from "@/lib/utils/strapiMediaUrl";
import type { NotificationIssueRow } from "@/types/notificationIssues";
import type { IssueCardToneFilter } from "../utils/notificationIssuesUrl";
import {
  countGroupedRuns,
  groupNotificationIssues,
  issueGroupCardTone,
  type FailureIssueGroup,
  type IssueCardTone,
  type IssueRunRef,
  type WarningIssueGroup,
} from "../utils/notificationIssueGroups";
import {
  formatIssueUrl,
  formatIssueWhen,
  formatStepLabel,
  pickIssueScreenshotArtifact,
} from "../utils/notificationIssuesTableUi";

interface NotificationIssuesListProps {
  issues: NotificationIssueRow[];
  stepFocus?: string;
  cardToneFilter?: IssueCardToneFilter;
}

type MediaCardGroup = FailureIssueGroup | WarningIssueGroup;

function runRefHref(ref: IssueRunRef): string | null {
  const jobId = ref.jobId;
  if (!jobId) return null;
  const base = `/dashboard/data/${encodeURIComponent(jobId)}`;
  return ref.runId ? `${base}?runId=${encodeURIComponent(ref.runId)}` : base;
}

function createdAtMs(iso: string | null | undefined): number {
  if (!iso) return 0;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : 0;
}

const CARD_TONE_STYLES: Record<
  IssueCardTone,
  { shell: string; media: string; tag: string; tagText: string }
> = {
  failure: {
    shell: "border-error-300 bg-error-50/25 hover:border-error-400",
    media: "bg-error-50",
    tag: "border-error-200 bg-error-100 text-error-900",
    tagText: "Failure",
  },
  warning: {
    shell: "border-warning-300 bg-warning-50/35 hover:border-warning-400",
    media: "bg-warning-50",
    tag: "border-warning-200 bg-warning-100 text-warning-900",
    tagText: "Warning",
  },
};

function IssueMediaCard({
  group,
  tone,
  cmsOrigin,
  onNavigate,
}: {
  group: MediaCardGroup;
  tone: IssueCardTone;
  cmsOrigin: string;
  onNavigate: (href: string) => void;
}) {
  const row = group.representativeRow;
  const href = runRefHref(group.primaryRun);
  const runCount = countGroupedRuns(group);
  const when = formatIssueWhen(row.notification.createdAt);
  const page = row.url ? formatIssueUrl(row.url) : null;
  const scope = row.notification.scope
    ? formatScopeLabel(row.notification.scope)
    : null;
  const stepLabel = formatStepLabel(group.step);
  const artifact = pickIssueScreenshotArtifact(row.artifacts);
  const imageUrl = resolveStrapiMediaUrl(artifact?.fileUrl, cmsOrigin);
  const styles = CARD_TONE_STYLES[tone];

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border-2 shadow-none transition",
        styles.shell,
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] w-full shrink-0",
          styles.media,
        )}
      >
        <Badge
          variant="outline"
          className={cn(
            "absolute right-2 top-2 z-10 text-[10px] font-semibold",
            styles.tag,
          )}
        >
          {styles.tagText}
        </Badge>
        {imageUrl ? (
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full"
            title="Open screenshot"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
          </a>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-slate-500">
            <ImageIcon className="h-8 w-8 opacity-60" aria-hidden />
            <span className="text-xs font-medium uppercase tracking-wide">
              {stepLabel}
            </span>
            <span className="text-[10px] opacity-80">No screenshot</span>
          </div>
        )}
        {runCount > 1 ? (
          <Badge
            variant="secondary"
            className="absolute left-2 top-2 border-0 bg-black/55 text-[10px] text-white hover:bg-black/55"
          >
            <Layers className="mr-1 h-3 w-3" aria-hidden />
            {runCount} runs
          </Badge>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 bg-white/80 p-3">
        <h3
          className="line-clamp-3 text-sm font-semibold leading-snug text-slate-900"
          title={group.message}
        >
          {group.message}
        </h3>

        <div
          className="flex flex-col gap-0.5 text-xs text-muted-foreground"
          title={when.title || undefined}
        >
          <span className="capitalize">{stepLabel}</span>
          {scope ? <span className="capitalize">{scope}</span> : null}
          <span>
            {when.label}
            {when.relative ? (
              <>
                {" "}
                <span className="text-slate-500">· {when.relative}</span>
              </>
            ) : null}
          </span>
        </div>

        {page ? (
          <a
            href={row.url!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-1 text-[11px] text-info-700 hover:underline"
            title={page.title}
          >
            <span className="truncate">{page.label}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          {href ? (
            <Button
              type="button"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => onNavigate(href)}
            >
              Latest run
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : null}
          {row.retryable ? (
            <Badge variant="outline" className="text-[10px] font-normal">
              Retryable
            </Badge>
          ) : null}
        </div>

        {group.otherRuns.length > 0 ? (
          <Collapsible>
            <CollapsibleTrigger className="text-[11px] font-medium text-slate-600 hover:text-slate-900">
              +{group.otherRuns.length} more run
              {group.otherRuns.length === 1 ? "" : "s"}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-1">
              {group.otherRuns.map((ref) => {
                const otherHref = runRefHref(ref);
                const otherWhen = formatIssueWhen(ref.createdAt);
                return (
                  <div
                    key={`${ref.notificationId}-${ref.jobId}-${ref.runId}`}
                    className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-2 py-1.5"
                  >
                    <span className="min-w-0 truncate font-mono text-[10px] text-slate-600">
                      {ref.jobId}
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {otherWhen.label}
                      {otherWhen.relative ? ` · ${otherWhen.relative}` : ""}
                    </span>
                    {otherHref ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 shrink-0 px-2 text-[10px]"
                        onClick={() => onNavigate(otherHref)}
                      >
                        Open
                      </Button>
                    ) : null}
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        ) : null}
      </div>
    </article>
  );
}

export function NotificationIssuesList({
  issues,
  stepFocus,
  cardToneFilter,
}: NotificationIssuesListProps) {
  const router = useRouter();
  const { Domain } = useGlobalContext();
  const cmsOrigin = Domain.strapi;

  const grouped = useMemo(
    () => groupNotificationIssues(issues, stepFocus ? { stepFocus } : undefined),
    [issues, stepFocus],
  );

  const cards = useMemo(() => {
    const items = [
      ...grouped.failures.map((group) => ({
        group,
        tone: issueGroupCardTone(group.representativeRow),
      })),
      ...grouped.warnings.map((group) => ({
        group,
        tone: "warning" as const,
      })),
    ];
    items.sort(
      (a, b) =>
        createdAtMs(b.group.primaryRun.createdAt) -
        createdAtMs(a.group.primaryRun.createdAt),
    );
    if (cardToneFilter) {
      return items.filter((item) => item.tone === cardToneFilter);
    }
    return items;
  }, [grouped.failures, grouped.warnings, cardToneFilter]);

  const onNavigate = (href: string) => router.push(href);

  if (issues.length === 0) {
    return (
      <EmptyState
        variant="minimal"
        title="Nothing matched"
        description="Try a different search or date range."
        icon={<AlertTriangle className="h-8 w-8 text-muted-foreground" />}
      />
    );
  }

  if (cards.length === 0) {
    return (
      <EmptyState
        variant="minimal"
        title="No problems matched"
        description="Try a different filter or date range."
        icon={<AlertTriangle className="h-8 w-8 text-muted-foreground" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map(({ group, tone }) => (
        <IssueMediaCard
          key={group.key}
          group={group}
          tone={tone}
          cmsOrigin={cmsOrigin}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
