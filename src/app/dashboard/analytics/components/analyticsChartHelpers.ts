import type { ChartConfig } from "@/components/ui/chart";
import { getPrimaryShadesColorArray } from "@/utils/chart-colors";
import { formatPercentage } from "@/utils/chart-formatters";

export type ChartSlice = {
  name: string;
  value: number;
  color: string;
};

export function sortPeriodKeys(keys: string[]): string[] {
  return [...keys].sort();
}

export function distributionToPieData(
  distribution: Record<string, number> | undefined,
): ChartSlice[] {
  const shades = getPrimaryShadesColorArray();

  return Object.entries(distribution ?? {})
    .map(([name, value], index) => ({
      name,
      value,
      color: shades[index % shades.length],
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
}

export function buildPieConfig(slices: ChartSlice[]): ChartConfig {
  const config: ChartConfig = {};
  slices.forEach((slice) => {
    config[slice.name] = { label: slice.name, color: slice.color };
  });
  return config;
}

export function formatGrowthTrendLabel(
  trend: string | undefined,
  growthRate: number | undefined,
): string {
  const rate =
    growthRate != null && Number.isFinite(growthRate)
      ? formatPercentage(Math.abs(growthRate))
      : "—";

  switch (trend) {
    case "increasing":
    case "growing":
      return `Up ${rate}`;
    case "decreasing":
    case "declining":
      return `Down ${rate}`;
    case "stable":
      return "Stable";
    default:
      return trend ? String(trend) : "—";
  }
}
