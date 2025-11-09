"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ChartCard from "@/components/modules/charts/ChartCard";
import {
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, Clock, PieChart as PieChartIcon } from "lucide-react";
import { useMemo } from "react";

import { CompetitionAdminDetailResponse } from "@/types/competitionAdminDetail";

interface AnalyticsSectionProps {
  analytics: CompetitionAdminDetailResponse["analytics"];
}

export function AnalyticsSection({ analytics }: AnalyticsSectionProps) {
  const gradeChartConfig: ChartConfig = useMemo(
    () => ({
      teamCount: { label: "Teams", color: "hsl(var(--chart-1))" },
    }),
    []
  );

  const clubPenetrationConfig: ChartConfig = useMemo(
    () => ({
      count: { label: "Clubs", color: "hsl(var(--chart-2))" },
    }),
    []
  );

  const timelineChartConfig: ChartConfig = useMemo(
    () => ({
      days: { label: "Days", color: "hsl(var(--chart-3))" },
    }),
    []
  );

  const timelineChartData =
    analytics.charts.timelineProgress.length > 0
      ? analytics.charts.timelineProgress
      : [
          {
            segment: "elapsed",
            days: analytics.summary.timeline.daysElapsed ?? 0,
          },
          {
            segment: "remaining",
            days: analytics.summary.timeline.daysRemaining ?? 0,
          },
        ];

  return (
    <SectionContainer
      title="Analytics"
      description="Visualise grade distribution, club coverage, and timeline progress."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Teams per Grade"
          description="Total teams in each grade."
          icon={BarChart3}
          chartConfig={gradeChartConfig}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.charts.gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="gradeName"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="teamCount"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Club Account Penetration"
          description="Clubs with and without Fixtura accounts."
          icon={PieChartIcon}
          chartConfig={clubPenetrationConfig}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.charts.clubAccountPenetration}
                dataKey="count"
                nameKey="label"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
              >
                {analytics.charts.clubAccountPenetration.map((entry, index) => (
                  <Cell
                    key={entry.label}
                    fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Timeline Progress"
          description="Elapsed vs remaining days for the competition."
          icon={Clock}
          chartConfig={timelineChartConfig}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timelineChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="segment" />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="days"
                fill="hsl(var(--chart-3))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </SectionContainer>
  );
}
