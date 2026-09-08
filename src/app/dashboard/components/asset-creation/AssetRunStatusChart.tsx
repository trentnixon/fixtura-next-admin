"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { Activity } from "lucide-react";
import ChartCard from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { isAssetRunActive } from "@/lib/account-asset-run/displayRules";
import { formatNumber } from "@/utils/chart-formatters";
import type { AccountAssetRunRenderActivityRow } from "@/types/accountAssetRun";

const STATUS_COLORS = {
  running: "hsl(var(--chart-1))",
  completed: "hsl(var(--chart-2))",
  failed: "hsl(var(--chart-3))",
  other: "hsl(var(--chart-4))",
} as const;

function bucketStatus(status: string): keyof typeof STATUS_COLORS {
  if (status === "completed") return "completed";
  if (status === "failed") return "failed";
  if (isAssetRunActive(status)) return "running";
  return "other";
}

interface AssetRunStatusChartProps {
  rows: AccountAssetRunRenderActivityRow[];
}

export function AssetRunStatusChart({ rows }: AssetRunStatusChartProps) {
  const chartData = useMemo(() => {
    const counts = new Map<string, number>();

    for (const row of rows) {
      const bucket = bucketStatus(row.run.status);
      counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
    }

    const labels: Record<keyof typeof STATUS_COLORS, string> = {
      running: "Running",
      completed: "Completed",
      failed: "Failed",
      other: "Other",
    };

    return Array.from(counts.entries()).map(([key, value]) => ({
      name: labels[key as keyof typeof STATUS_COLORS],
      key,
      value,
      color: STATUS_COLORS[key as keyof typeof STATUS_COLORS],
    }));
  }, [rows]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((entry) => {
      config[entry.name] = { label: entry.name, color: entry.color };
    });
    return config;
  }, [chartData]);

  const total = rows.length;

  return (
    <ChartCard
      title="Run status mix"
      description="Distribution of runs in the current view"
      icon={Activity}
      chartConfig={chartConfig}
      summaryStats={[
        {
          icon: Activity,
          label: "Runs in view",
          value: formatNumber(total),
        },
      ]}
      variant="elevated"
    >
      {chartData.length > 0 ? (
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={88}
            paddingAngle={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      ) : null}
    </ChartCard>
  );
}
