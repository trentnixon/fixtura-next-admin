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
import { AssociationStatistics } from "@/types/associationDetail";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/**
 * StatisticsOverview Component
 *
 * Main statistics overview card displaying:
 * - Competition statistics (total, active, upcoming, completed, byStatus breakdown)
 * - Grade statistics (total, withTeams, withoutTeams)
 * - Club statistics (total, active, withCompetitions)
 * - Team statistics (total, acrossCompetitions, acrossGrades)
 * - Account statistics (total, active, withOrders)
 * - Trial status indicator (if applicable)
 */
interface StatisticsOverviewProps {
  statistics: AssociationStatistics;
}

export default function StatisticsOverview({
  statistics,
}: StatisticsOverviewProps) {
  const { competitions, grades, clubs, teams, accounts, trial } = statistics;

  // Prepare data for the chart
  const chartData = [
    {
      name: "Competitions",
      total: competitions.total,
      active: competitions.active,
      fill: "var(--color-competitions)",
    },
    {
      name: "Grades",
      total: grades.total,
      active: grades.withTeams, // Using withTeams as proxy for 'active' in this context
      fill: "var(--color-grades)",
    },
    {
      name: "Clubs",
      total: clubs.total,
      active: clubs.active,
      fill: "var(--color-clubs)",
    },
    {
      name: "Teams",
      total: teams.total,
      active: teams.acrossCompetitions, // Using acrossCompetitions as proxy for 'active'
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
    competitions: {
      label: "Competitions",
      color: "hsl(var(--chart-1))",
    },
    grades: {
      label: "Grades",
      color: "hsl(var(--chart-2))",
    },
    clubs: {
      label: "Clubs",
      color: "hsl(var(--chart-3))",
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

  // Prepare summary stats
  const summaryStats: ChartSummaryStat[] = [
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
      icon: Building2,
      label: "Clubs",
      value: clubs.total.toString(),
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
      title="Statistics Overview"
      description="Comprehensive statistics for competitions, grades, clubs, teams, and accounts"
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
