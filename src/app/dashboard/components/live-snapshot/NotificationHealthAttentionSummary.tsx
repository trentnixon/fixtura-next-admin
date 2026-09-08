"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import type { NotificationHealthAttentionSummary } from "@/lib/overview/overviewActionQueues";
import { cn } from "@/lib/utils";

interface NotificationHealthAttentionSummaryProps {
  summary: NotificationHealthAttentionSummary;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

function metricTone(value: number, warnAbove = 0): string {
  return value > warnAbove
    ? "border-amber-300 bg-amber-50 text-amber-950"
    : "border-slate-200 bg-slate-50 text-slate-900";
}

export function NotificationHealthAttentionSummary({
  summary,
  isLoading,
  error,
  onRetry,
}: NotificationHealthAttentionSummaryProps) {
  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        variant="default"
        title="Could not load notification health"
        error={error}
        onRetry={onRetry}
      />
    );
  }

  if (!summary.hasAttention) {
    return (
      <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-muted-foreground">
        No notification failures in the last 7 days.
      </div>
    );
  }

  const metrics = [
    {
      label: "Fatal notifications",
      value: summary.fatalCount,
      tone: metricTone(summary.fatalCount, 0),
    },
    {
      label: "Issue rows",
      value: summary.totalIssueRows,
      tone: metricTone(summary.totalIssueRows, 0),
    },
    {
      label: "Retryable",
      value: summary.retryableCount,
      tone: metricTone(summary.retryableCount, 0),
    },
    {
      label: "Selector drift",
      value: summary.selectorDriftCount,
      tone: metricTone(summary.selectorDriftCount, 0),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={cn(
              "rounded-md border px-3 py-2.5",
              metric.tone
            )}
          >
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {metric.label}
            </div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      {summary.fixturesFailed > 0 ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            {summary.fixturesFailed.toLocaleString()} fixture failures in window
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">
          {summary.summaryParts.join(" · ")}
        </Badge>
        <Button variant="primary" size="sm" asChild>
          <Link href="/dashboard/notifications/issues">
            Review issues
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
