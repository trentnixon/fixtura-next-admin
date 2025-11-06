"use client";

import { useMemo } from "react";
import { AccountLookupItem } from "@/types/adminAccountLookup";
import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import ChartCard from "@/components/modules/charts/ChartCard";
import { getPrimaryShadesColorArray } from "@/utils/chart-colors";
import {
  CreditCard,
  AlertTriangle,
  Trophy,
  CheckCircle2,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
} from "lucide-react";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface AccountStatsProps {
  accounts: AccountLookupItem[];
}

/**
 * Stats cards and charts component for account tables
 * Displays subscription overview, expiring accounts, sport distribution, and charts
 */
export default function AccountStats({ accounts }: AccountStatsProps) {
  // Calculate stats
  const stats = useMemo(() => {
    const total = accounts.length;
    const active = accounts.filter((a) => a.hasActiveOrder).length;
    const inactive = total - active;
    const activePercentage = total > 0 ? Math.round((active / total) * 100) : 0;
    const inactivePercentage =
      total > 0 ? Math.round((inactive / total) * 100) : 0;

    // Expiring soon counts
    const expiring30 = accounts.filter(
      (a) =>
        a.hasActiveOrder &&
        a.daysLeftOnSubscription !== null &&
        a.daysLeftOnSubscription <= 30
    ).length;
    const expiring60 = accounts.filter(
      (a) =>
        a.hasActiveOrder &&
        a.daysLeftOnSubscription !== null &&
        a.daysLeftOnSubscription <= 60 &&
        a.daysLeftOnSubscription > 30
    ).length;
    const expiring90 = accounts.filter(
      (a) =>
        a.hasActiveOrder &&
        a.daysLeftOnSubscription !== null &&
        a.daysLeftOnSubscription <= 90 &&
        a.daysLeftOnSubscription > 60
    ).length;

    // Sport distribution
    const sportCounts: Record<string, number> = {};
    accounts.forEach((account) => {
      const sport = account.Sport || "Unknown";
      sportCounts[sport] = (sportCounts[sport] || 0) + 1;
    });

    // Setup status
    const setupComplete = accounts.filter((a) => a.isSetup).length;
    const notSetup = total - setupComplete;
    const setupPercentage =
      total > 0 ? Math.round((setupComplete / total) * 100) : 0;

    return {
      total,
      active,
      inactive,
      activePercentage,
      inactivePercentage,
      expiring30,
      expiring60,
      expiring90,
      sportCounts,
      setupComplete,
      notSetup,
      setupPercentage,
    };
  }, [accounts]);

  // Get primary shades for pie chart
  const primaryShades = getPrimaryShadesColorArray();

  // Prepare chart data
  const subscriptionPieData = [
    { name: "Active", value: stats.active, color: primaryShades[1] }, // Light shade (70%)
    { name: "Inactive", value: stats.inactive, color: primaryShades[3] }, // Dark shade (20%)
  ];

  const sportBarData = Object.entries(stats.sportCounts).map(
    ([sport, count]) => ({
      sport,
      count,
    })
  );

  const expirationTimelineData = [
    { period: "0-30 days", count: stats.expiring30 },
    { period: "31-60 days", count: stats.expiring60 },
    { period: "61-90 days", count: stats.expiring90 },
    {
      period: "90+ days",
      count:
        stats.active - stats.expiring30 - stats.expiring60 - stats.expiring90,
    },
  ];

  const pieChartConfig = {
    Active: { label: "Active Subscriptions", color: primaryShades[1] }, // Light shade (70%)
    Inactive: { label: "Inactive Subscriptions", color: primaryShades[3] }, // Dark shade (20%)
  } satisfies ChartConfig;

  const sportBarChartConfig = {
    count: {
      label: "Accounts",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const expirationTimelineChartConfig = {
    count: {
      label: "Accounts",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <MetricGrid columns={4} gap="lg">
        {/* Subscription Overview Card */}
        <StatCard
          title="Subscription Overview"
          value={stats.total}
          icon={<CreditCard className="h-5 w-5" />}
          description={`${stats.active} active (${stats.activePercentage}%) • ${stats.inactive} inactive (${stats.inactivePercentage}%)`}
          variant="primary"
        />

        {/* Expiring Soon Card */}
        <StatCard
          title="Expiring Soon"
          value={stats.expiring30}
          icon={<AlertTriangle className="h-5 w-5" />}
          description={`${stats.expiring60} in 31-60 days • ${stats.expiring90} in 61-90 days`}
          variant="accent"
        />

        {/* Accounts by Sport Card */}
        <StatCard
          title="By Sport"
          value={Object.keys(stats.sportCounts).length}
          icon={<Trophy className="h-5 w-5" />}
          description={Object.entries(stats.sportCounts)
            .slice(0, 3)
            .map(([sport, count]) => `${sport}: ${count}`)
            .join(" • ")}
          variant="secondary"
        />

        {/* Setup Status Card */}
        <StatCard
          title="Setup Status"
          value={stats.setupComplete}
          icon={<CheckCircle2 className="h-5 w-5" />}
          description={`${stats.setupPercentage}% complete • ${stats.notSetup} pending`}
          variant="light"
        />
      </MetricGrid>

      {/* Charts Grid */}
      <MetricGrid columns={2} gap="lg">
        {/* Subscription Status Pie Chart */}
        <ChartCard
          title="Subscription Status"
          description="Distribution of active vs inactive subscriptions"
          icon={PieChartIcon}
          chartConfig={pieChartConfig}
          chartClassName="h-[250px]"
        >
          <PieChart>
            <Pie
              data={subscriptionPieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {subscriptionPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartCard>

        {/* Accounts by Sport Bar Chart */}
        <ChartCard
          title="Accounts by Sport"
          description="Number of accounts per sport type"
          icon={BarChart3}
          chartConfig={sportBarChartConfig}
          chartClassName="h-[250px]"
        >
          <BarChart data={sportBarData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="sport"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartCard>
      </MetricGrid>

      {/* Expiration Timeline Chart */}
      <ChartCard
        title="Subscription Expiration Timeline"
        description="Accounts expiring in different time periods"
        icon={Calendar}
        chartConfig={expirationTimelineChartConfig}
        chartClassName="h-[250px]"
      >
        <BarChart data={expirationTimelineData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="count"
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartCard>
    </div>
  );
}
