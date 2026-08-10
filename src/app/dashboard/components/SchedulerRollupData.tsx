"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import {
  ArrowRight,
  Calendar,
  CalendarDays,
  Clock,
  PlayCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

/**
 * Scheduler rollup — matches RenderActivitySection header layout.
 */
export function SchedulerRollupData({
  title = "Scheduler rollup",
  description = "Expected renders and queue state across the fleet",
  actionLink = {
    href: "/dashboard/schedulers",
    label: "Open schedulers",
  },
}: {
  title?: string;
  description?: string;
  actionLink?: { href: string; label: string };
}) {
  const { data, isLoading, isError, error, refetch } = useSchedulerRollup();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayOfWeekName = today.toLocaleDateString("en-US", { weekday: "long" });
  const tomorrowDayOfTheWeekName = tomorrow.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const tableData = [
    {
      title: "Expected renders",
      detail: dayOfWeekName,
      value: data?.DaysOfTheWeekGroupedByCount[dayOfWeekName] || 0,
      icon: Calendar,
    },
    {
      title: "Expected renders",
      detail: tomorrowDayOfTheWeekName,
      value: data?.DaysOfTheWeekGroupedByCount[tomorrowDayOfTheWeekName] || 0,
      icon: CalendarDays,
    },
    {
      title: "Schedulers rendering",
      detail: "Current active jobs",
      value: data?.numberOfSchedulersRendering || 0,
      icon: PlayCircle,
    },
    {
      title: "Schedulers queued",
      detail: "Waiting to process",
      value: data?.numberOfSchedulersQueued || 0,
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actionLink ? (
          <Button variant="accent" size="sm" className="shrink-0" asChild>
            <Link href={actionLink.href}>
              {actionLink.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </div>

      {isLoading ? (
        <LoadingState variant="default" message="Loading scheduler rollup…" />
      ) : isError && error ? (
        <div className="space-y-2">
          <ErrorState
            error={error instanceof Error ? error : new Error(String(error))}
            title="Could not load scheduler rollup"
            variant="default"
          />
          <Button
            type="button"
            onClick={() => refetch()}
            size="sm"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100 hover:bg-slate-100">
              <TableHead>Metric</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item) => (
              <TableRow key={`${item.title}-${item.detail}-row`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {item.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.detail}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-semibold text-slate-900">
                    {item.value}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
