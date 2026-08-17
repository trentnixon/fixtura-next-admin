"use client";

import { Activity, CheckCircle2, Clock3, ListTodo } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useScraperLogs } from "@/hooks/data-collection/useScraperLogs";
import { cn } from "@/lib/utils";

function formatDurationMs(ms: number | null | undefined): string {
  if (ms == null || ms < 0) return "-";
  if (ms < 1000) return `${ms}ms`;

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
  if (seconds % 60 > 0 || parts.length === 0) parts.push(`${seconds % 60}s`);

  return parts.join(" ");
}

export function ScraperOperationsStrip() {
  const {
    meta: scraperMeta,
    isLoading: logsLoading,
    error: logsError,
  } = useScraperLogs({
    page: 1,
    pageSize: 1,
  });

  const byStatus = scraperMeta?.summary.byStatus;
  const inProgress = byStatus?.in_progress ?? 0;
  const retryLater = byStatus?.retry_later ?? 0;
  const completed = byStatus?.completed ?? 0;
  const stats = [
    {
      label: "Pipeline",
      value: logsLoading ? "Loading" : inProgress > 0 ? "Running" : "Idle",
      meta:
        logsError != null
          ? "Log feed unavailable"
          : `${inProgress} active, ${retryLater} retry`,
      icon: inProgress > 0 ? Activity : CheckCircle2,
      tone:
        logsError != null
          ? "border-red-200 bg-red-50 text-red-800"
          : inProgress > 0
            ? "border-cyan-200 bg-cyan-50 text-cyan-800"
            : "border-emerald-200 bg-emerald-50 text-emerald-800",
    },
    {
      label: "Jobs Indexed",
      value: logsLoading ? "..." : (scraperMeta?.summary.totalJobs ?? 0),
      meta: `${completed} completed in current window`,
      icon: ListTodo,
      tone: "border-slate-200 bg-slate-50 text-slate-800",
    },
    {
      label: "Avg Duration",
      value: logsLoading
        ? "..."
        : formatDurationMs(scraperMeta?.summary.avgDurationMs),
      meta: "Loaded job sample",
      icon: Clock3,
      tone: "border-indigo-200 bg-indigo-50 text-indigo-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className={cn("border shadow-sm", stat.tone)}>
            <CardContent className="flex min-h-[92px] items-center gap-3 p-3.5">
              <div className="rounded-md bg-white/70 p-2">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium opacity-75">
                  {stat.label}
                </div>
                <div className="truncate text-lg font-bold leading-tight">
                  {stat.value}
                </div>
                <div className="truncate text-xs opacity-75">{stat.meta}</div>
              </div>
              {stat.label === "Pipeline" && inProgress > 0 ? (
                <Badge
                  className="shrink-0 bg-white/80 text-current"
                  variant="outline"
                >
                  Live
                </Badge>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
