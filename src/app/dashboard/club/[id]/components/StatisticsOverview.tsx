"use client";

import {
  Trophy,
  Users,
  Building2,
  Target,
  CreditCard,
  TestTube,
  BarChart3,
} from "lucide-react";
import { ClubStatistics } from "@/types/clubAdminDetail";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface StatisticsOverviewProps {
  statistics: ClubStatistics;
}

export default function StatisticsOverview({
  statistics,
}: StatisticsOverviewProps) {
  const { associations, teams, competitions, grades, accounts, trial } =
    statistics;

  const chartData = [
    {
      name: "Associations",
      total: associations.total,
      active: associations.active,
      fill: "var(--color-associations)",
    },
    {
      name: "Competitions",
      total: competitions.total,
      active: competitions.active,
      fill: "var(--color-competitions)",
    },
    {
      name: "Grades",
      total: grades.total,
      active: grades.withTeams,
      fill: "var(--color-grades)",
    },
    {
      name: "Teams",
      total: teams.total,
      active: teams.acrossCompetitions,
      fill: "var(--color-teams)",
    },
    {
      name: "Accounts",
      total: accounts.total,
      active: accounts.active,
      fill: "var(--color-accounts)",
    },
  ];

  const chartConfig = {
    total: {
      label: "Total",
      color: "hsl(var(--chart-1))",
    },
    active: {
      label: "Active",
      color: "hsl(var(--chart-2))",
    },
    associations: {
      label: "Associations",
      color: "hsl(var(--chart-3))",
    },
    competitions: {
      label: "Competitions",
      color: "hsl(var(--chart-1))",
    },
    grades: {
      label: "Grades",
      color: "hsl(var(--chart-2))",
    },
    teams: {
      label: "Teams",
      color: "hsl(var(--chart-4))",
    },
    accounts: {
      label: "Accounts",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  const summaryStats: ChartSummaryStat[] = [
    {
      icon: Building2,
      label: "Associations",
      value: associations.total.toString(),
    },
    {
      icon: Trophy,
      label: "Competitions",
      value: competitions.total.toString(),
    },
    {
      icon: Target,
      label: "Grades",
      value: grades.total.toString(),
    },
    {
      icon: Users,
      label: "Teams",
      value: teams.total.toString(),
    },
    {
      icon: CreditCard,
      label: "Accounts",
      value: accounts.total.toString(),
    },
  ];

  if (trial) {
    summaryStats.push({
      icon: TestTube,
      label: "Trial",
      value: trial.hasTrial ? (trial.isActive ? "Active" : "Inactive") : "No",
    });
  }

  return (
    <ChartCard
      title="Club Statistics Overview"
      description="High-level statistics across associations, competitions, grades, teams, and accounts for this club."
      icon={BarChart3}
      chartConfig={chartConfig}
      summaryStats={summaryStats}
    >
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
        <Bar
          dataKey="active"
          fill="var(--color-active)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartCard>
  );
}


