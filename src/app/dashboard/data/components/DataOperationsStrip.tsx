"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  ListTodo,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useScraperLogs } from "@/hooks/data-collection/useScraperLogs";
import type { NotificationHealthData } from "@/types/notificationHealth";
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

interface DataOperationsStripProps {
  notificationHealth?: NotificationHealthData;
  healthLoading?: boolean;
  healthError?: Error | null;
  windowLabel?: string;
  onNotificationsClick?: () => void;
  issuesListHref?: string;
}

export function DataOperationsStrip({
  notificationHealth,
  healthLoading = false,
  healthError = null,
  windowLabel = "last 7 days",
  onNotificationsClick,
  issuesListHref,
}: DataOperationsStripProps) {
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
  const notificationCount =
    notificationHealth?.notifications.notificationCount ?? 0;
  const fatalCount = notificationHealth?.notifications.fatalCount ?? 0;

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
      clickable: false,
    },
    {
      label: "Jobs Indexed",
      value: logsLoading ? "..." : (scraperMeta?.summary.totalJobs ?? 0),
      meta: `${completed} completed in current window`,
      icon: ListTodo,
      tone: "border-slate-200 bg-slate-50 text-slate-800",
      clickable: false,
    },
    {
      label: "Avg Duration",
      value: logsLoading
        ? "..."
        : formatDurationMs(scraperMeta?.summary.avgDurationMs),
      meta: "Loaded job sample",
      icon: Clock3,
      tone: "border-indigo-200 bg-indigo-50 text-indigo-800",
      clickable: false,
    },
    {
      label: "Notifications",
      value: healthLoading ? "..." : notificationCount,
      meta:
        healthError != null
          ? "Health feed unavailable"
          : `${fatalCount} fatal, ${windowLabel}`,
      icon:
        notificationCount > 0 || fatalCount > 0 || healthError != null
          ? AlertTriangle
          : Bell,
      tone:
        healthError != null || notificationCount > 0 || fatalCount > 0
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-blue-200 bg-blue-50 text-blue-800",
      clickable: Boolean(onNotificationsClick),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isNotifications = stat.label === "Notifications";

        const card = (
          <Card
            className={cn(
              "border shadow-sm",
              stat.tone,
              stat.clickable &&
                "cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
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
                {isNotifications && issuesListHref ? (
                  <Link
                    href={issuesListHref}
                    className="mt-1 inline-block text-xs font-medium text-blue-700 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View all issues
                  </Link>
                ) : null}
              </div>
              {(stat.label === "Pipeline" && inProgress > 0) ||
              (isNotifications &&
                (notificationCount > 0 || fatalCount > 0)) ? (
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

        if (stat.clickable && onNotificationsClick) {
          return (
            <div
              key={stat.label}
              role="button"
              tabIndex={0}
              className="cursor-pointer text-left"
              onClick={onNotificationsClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onNotificationsClick();
                }
              }}
              aria-label="Scroll to notification health section"
            >
              {card}
            </div>
          );
        }

        return <div key={stat.label}>{card}</div>;
      })}
    </div>
  );
}
