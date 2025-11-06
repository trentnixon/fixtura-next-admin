"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import ChartSummaryStats, { ChartSummaryStat } from "./ChartSummaryStats";

export type { ChartSummaryStat };

export interface ChartCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  chartConfig: ChartConfig;
  summaryStats?: ChartSummaryStat[];
  emptyState?: React.ReactNode;
  emptyStateMessage?: string;
  chartClassName?: string;
  cardClassName?: string;
  variant?: "default" | "elevated";
  children?: React.ReactElement | null;
}

/**
 * ChartCard Component
 *
 * A reusable wrapper component that combines Card, ChartContainer, header, and supporting data pattern.
 * Matches the data insights chart structure with:
 * - Card with elevated background (bg-slate-50)
 * - Header with icon, title, and description
 * - Optional summary stats grid above chart
 * - ChartContainer with configurable variant
 *
 * @example
 * ```tsx
 * <ChartCard
 *   title="Performance Over Time"
 *   description="Performance trends over the last 12 months"
 *   icon={Clock}
 *   chartConfig={chartConfig}
 *   summaryStats={[
 *     { icon: Clock, label: "Avg Time", value: "2.5s" },
 *     { icon: MemoryStick, label: "Avg Memory", value: "128MB" },
 *   ]}
 * >
 *   <LineChart data={data}>...</LineChart>
 * </ChartCard>
 * ```
 */
export default function ChartCard({
  title,
  description,
  icon: Icon,
  chartConfig,
  summaryStats = [],
  emptyState,
  emptyStateMessage = "No data available",
  chartClassName,
  cardClassName,
  variant = "default",
  children,
}: ChartCardProps) {
  const hasData = children != null && React.Children.count(children) > 0;

  return (
    <Card
      className={cn("shadow-none bg-slate-50 border rounded-md", cardClassName)}
    >
      <CardHeader>
        {Icon && (
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
        )}
        {!Icon && (
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        )}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="space-y-4">
        {!hasData ? (
          emptyState || (
            <div className="text-center py-8 text-muted-foreground">
              {emptyStateMessage}
            </div>
          )
        ) : (
          <>
            {/* Summary Stats */}
            {summaryStats.length > 0 && (
              <ChartSummaryStats stats={summaryStats} />
            )}

            {/* Chart */}
            <ChartContainer
              config={chartConfig}
              variant={variant}
              className={cn("h-[300px] w-full", chartClassName)}
            >
              {children!}
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
