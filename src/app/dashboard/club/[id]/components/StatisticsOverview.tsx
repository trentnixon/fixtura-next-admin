"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon, Trophy } from "lucide-react";
import { ClubStatistics } from "@/types/clubAdminDetail";
import ChartCard from "@/components/modules/charts/ChartCard";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { ClientOnly } from "@/components/util/ClientOnly";
import {
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface StatisticsOverviewProps {
  statistics: ClubStatistics;
}

function StatisticsCharts({
  statistics,
}: {
  statistics: ClubStatistics;
}) {
  const { associations, teams, competitions, grades, accounts } = statistics;

  const entityTotalsConfig: ChartConfig = useMemo(
    () => ({
      total: { label: "Total", color: "hsl(var(--chart-1))" },
    }),
    [],
  );

  const competitionStatusConfig: ChartConfig = useMemo(
    () => ({
      count: { label: "Competitions", color: "hsl(var(--chart-2))" },
    }),
    [],
  );

  const gradeCoverageConfig: ChartConfig = useMemo(
    () => ({
      count: { label: "Grades", color: "hsl(var(--chart-3))" },
    }),
    [],
  );

  const entityTotalsData = [
    { label: "Associations", total: associations.total },
    { label: "Competitions", total: competitions.total },
    { label: "Grades", total: grades.total },
    { label: "Teams", total: teams.total },
    { label: "Accounts", total: accounts.total },
  ];

  const competitionStatusData = [
    { label: "Active", count: competitions.active },
    { label: "Upcoming", count: competitions.upcoming },
    { label: "Completed", count: competitions.completed },
  ];

  const gradeCoverageData = [
    { label: "With teams", count: grades.withTeams },
    { label: "Without teams", count: grades.withoutTeams },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ChartCard
        title="Entity Totals"
        description="Core entities linked to this club."
        icon={BarChart3}
        chartConfig={entityTotalsConfig}
      >
        <BarChart data={entityTotalsData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="total"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartCard>

      <ChartCard
        title="Competition Status"
        description="Active, upcoming, and completed competitions."
        icon={Trophy}
        chartConfig={competitionStatusConfig}
      >
        <BarChart data={competitionStatusData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="count"
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartCard>

      <ChartCard
        title="Grade Team Coverage"
        description="Grades with and without discovered teams."
        icon={PieChartIcon}
        chartConfig={gradeCoverageConfig}
      >
        <PieChart>
          <Pie
            data={gradeCoverageData}
            dataKey="count"
            nameKey="label"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
          >
            {gradeCoverageData.map((entry, index) => (
              <Cell
                key={entry.label}
                fill={`hsl(var(--chart-${(index % 5) + 1}))`}
              />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
        </PieChart>
      </ChartCard>
    </div>
  );
}

function StatisticsChartsFallback() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-[380px] animate-pulse rounded-md border bg-slate-50"
        />
      ))}
    </div>
  );
}

export default function StatisticsOverview({
  statistics,
}: StatisticsOverviewProps) {
  return (
    <SectionContainer
      title="Statistics Overview"
      description="Visualise club volume, competition status, and grade coverage."
    >
      <ClientOnly fallback={<StatisticsChartsFallback />}>
        <StatisticsCharts statistics={statistics} />
      </ClientOnly>
    </SectionContainer>
  );
}
