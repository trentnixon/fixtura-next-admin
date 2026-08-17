"use client";

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
