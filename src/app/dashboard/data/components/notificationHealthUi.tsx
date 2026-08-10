"use client";

import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ChartConfig } from "@/components/ui/chart";
import { formatDateShort, formatPercentage } from "@/utils/chart-formatters";
import type { NotificationHealthPresetDays } from "@/types/notificationHealth";

export const PRESET_OPTIONS: {
  value: NotificationHealthPresetDays;
  label: string;
}[] = [
  { value: 7, label: "Last 7 days" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
  { value: 60, label: "Last 60 days" },
];

export const NOTIFICATION_HEALTH_CHART_CONFIG = {
  notificationCount: {
    label: "Notifications",
    color: "hsl(221, 83%, 53%)",
  },
  fixturesFailed: {
    label: "Fixtures failed (sum)",
    color: "hsl(0, 72%, 51%)",
  },
} satisfies ChartConfig;

export function toInputDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function formatBucketLabel(bucket: string): string {
  try {
    return formatDateShort(bucket);
  } catch {
    return bucket;
  }
}

export function formatRate(ratio: number | null | undefined): string {
  if (ratio == null || Number.isNaN(ratio)) return "—";
  return formatPercentage(ratio * 100);
}

export function sortRecordEntries(
  record: Record<string, number>,
): { key: string; count: number }[] {
  return Object.entries(record)
    .map(([key, count]) => ({ key, count }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count);
}

export function formatHealthWindowLabel(
  customRange: boolean,
  presetDays: NotificationHealthPresetDays,
): string {
  if (customRange) return "custom range";
  return `last ${presetDays} days`;
}

export function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
}) {
  return (
    <div className="flex min-h-[96px] items-center gap-3 rounded-md border border-slate-200 bg-white p-4">
      {icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase text-muted-foreground">
          {title}
        </div>
        <div
          className="truncate text-xl font-semibold tabular-nums text-slate-900"
          title={String(value)}
        >
          {value}
        </div>
        {description && (
          <div className="truncate text-xs text-muted-foreground">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

export function MetricLine({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium tabular-nums text-slate-900">{value}</div>
    </div>
  );
}

export function DimensionTable({
  rows,
  emptyMessage,
  getRowHref,
}: {
  rows: { key: string; count: number }[];
  emptyMessage: string;
  getRowHref?: (key: string) => string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-slate-500">{emptyMessage}</p>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Key</TableHead>
          <TableHead className="text-right">Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ key, count }) => {
          const href = getRowHref?.(key);
          return (
            <TableRow
              key={key}
              className={href ? "hover:bg-slate-50" : undefined}
            >
              <TableCell className="font-mono text-sm">
                {href ? (
                  <a
                    href={href}
                    className="text-blue-600 hover:underline"
                  >
                    {key}
                  </a>
                ) : (
                  key
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">{count}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
