"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon, Trophy } from "lucide-react";

import ChartCard from "@/components/modules/charts/ChartCard";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AssociationStatistics } from "@/types/associationDetail";

interface StatisticsOverviewProps {
  statistics: AssociationStatistics;
}

export default function StatisticsOverview({
  statistics,
}: StatisticsOverviewProps) {
  const { competitions, grades, clubs, teams, accounts } = statistics;

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
    { label: "Competitions", total: competitions.total },
    { label: "Grades", total: grades.total },
    { label: "Clubs", total: clubs.total },
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
    <SectionContainer
      title="Statistics Overview"
      description="Visualise association volume, competition status, and grade coverage."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Entity Totals"
          description="Core entities linked to this association."
          icon={BarChart3}
          chartConfig={entityTotalsConfig}
        >
          <ResponsiveContainer width="100%" height={300}>
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
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Competition Status"
          description="Active, upcoming, and completed competitions."
          icon={Trophy}
          chartConfig={competitionStatusConfig}
        >
          <ResponsiveContainer width="100%" height={300}>
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
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Grade Team Coverage"
          description="Grades with and without discovered teams."
          icon={PieChartIcon}
          chartConfig={gradeCoverageConfig}
        >
          <ResponsiveContainer width="100%" height={300}>
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
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </SectionContainer>
  );
}
