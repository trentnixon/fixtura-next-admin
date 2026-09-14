"use client";

import Link from "next/link";
import { ArrowRight, Clapperboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import { useLiveRunClock } from "@/hooks/account-asset-run/useLiveRunClock";
import { getAccountPagePath } from "@/lib/account-health/accountRoutes";
import {
  formatStuckRenderingElapsedLabel,
  type StuckRenderingAttentionItem,
} from "@/lib/scheduler/renderAttention";
import { cn } from "@/lib/utils";

function normalizeAccountType(
  type: string
): "association" | "club" | undefined {
  const normalized = type.trim().toLowerCase();
  if (normalized === "club") return "club";
  if (normalized === "association") return "association";
  return undefined;
}

function severityBadgeClass(severity: StuckRenderingAttentionItem["severity"]) {
  switch (severity) {
    case "error":
      return "border-red-300 bg-red-100 text-red-900";
    case "issue":
      return "border-orange-300 bg-orange-100 text-orange-900";
    default:
      return "border-amber-300 bg-amber-100 text-amber-900";
  }
}

function severityRowClass(severity: StuckRenderingAttentionItem["severity"]) {
  switch (severity) {
    case "error":
      return "bg-red-50/70";
    case "issue":
      return "bg-orange-50/60";
    default:
      return "bg-amber-50/60";
  }
}

interface StuckRenderingAttentionListProps {
  items: StuckRenderingAttentionItem[];
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

export function StuckRenderingAttentionList({
  items,
  isLoading,
  error,
  onRetry,
}: StuckRenderingAttentionListProps) {
  const nowMs = useLiveRunClock(items.length > 0);

  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        variant="default"
        title="Could not load render status"
        error={error}
        onRetry={onRetry}
      />
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-md border border-amber-200 bg-amber-50/30">
      {items.map((item) => {
        const accountType = normalizeAccountType(item.accountType);
        const accountHref =
          accountType != null
            ? getAccountPagePath(item.accountId, accountType)
            : null;
        const startMs = item.startedAt ? Date.parse(item.startedAt) : NaN;
        const elapsedMs = Number.isFinite(startMs)
          ? Math.max(0, nowMs - startMs)
          : item.elapsedMs;
        const elapsedLabel = formatStuckRenderingElapsedLabel(
          elapsedMs != null && Number.isFinite(elapsedMs) ? elapsedMs : null,
          item.startedAt
        );

        return (
          <div
            key={`${item.schedulerId}-${item.renderId ?? "none"}`}
            className={cn(
              "grid grid-cols-1 gap-2 border-b border-amber-200/80 px-3 py-2.5 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-3",
              severityRowClass(item.severity)
            )}
          >
            <div className="min-w-0">
              {accountHref ? (
                <Link
                  href={accountHref}
                  className="truncate text-sm font-medium text-slate-900 hover:text-primary hover:underline"
                >
                  {item.accountName}
                </Link>
              ) : (
                <div className="truncate text-sm font-medium text-slate-900">
                  {item.accountName}
                </div>
              )}
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                <span className="capitalize">{item.accountType}</span>
                <span className="text-muted-foreground/60">·</span>
                <span>{elapsedLabel}</span>
                {item.renderName ? (
                  <>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="truncate">{item.renderName}</span>
                  </>
                ) : null}
              </div>
            </div>

            <Badge
              variant="outline"
              className={cn("w-fit shrink-0", severityBadgeClass(item.severity))}
            >
              {item.label}
            </Badge>

            <div className="flex w-fit shrink-0 flex-wrap items-center gap-2 sm:justify-self-end">
              {item.renderId ? (
                <Button variant="accent" size="sm" asChild>
                  <Link href={`/dashboard/renders/${item.renderId}`}>
                    Render
                    <Clapperboard className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              ) : null}
              <Button variant="primary" size="sm" asChild>
                <Link href={`/dashboard/schedulers/${item.schedulerId}`}>
                  Scheduler
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
