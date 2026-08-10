"use client";

import { useMemo } from "react";
import { AccountLookupItem } from "@/types/adminAccountLookup";
import ChartCard from "@/components/modules/charts/ChartCard";
import { getPrimaryShadesColorArray } from "@/utils/chart-colors";
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle2,
  CreditCard,
  PieChart as PieChartIcon,
  Trophy,
} from "lucide-react";
import {
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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

interface AccountStatsProps {
  accounts: AccountLookupItem[];
}

export default function AccountStats({ accounts }: AccountStatsProps) {
  const stats = useMemo(() => {
    const total = accounts.length;
    const active = accounts.filter((account) => account.hasActiveOrder).length;
    const inactive = total - active;

    const expiring30 = accounts.filter(
      (account) =>
        account.hasActiveOrder &&
        account.daysLeftOnSubscription !== null &&
        account.daysLeftOnSubscription <= 30,
    ).length;
    const expiring60 = accounts.filter(
      (account) =>
        account.hasActiveOrder &&
        account.daysLeftOnSubscription !== null &&
        account.daysLeftOnSubscription <= 60 &&
        account.daysLeftOnSubscription > 30,
    ).length;
    const expiring90 = accounts.filter(
      (account) =>
        account.hasActiveOrder &&
        account.daysLeftOnSubscription !== null &&
        account.daysLeftOnSubscription <= 90 &&
        account.daysLeftOnSubscription > 60,
    ).length;

    const sportCounts: Record<string, number> = {};
    accounts.forEach((account) => {
      const sport = account.Sport || "Unknown";
      sportCounts[sport] = (sportCounts[sport] || 0) + 1;
    });

    const setupComplete = accounts.filter((account) => account.isSetup).length;
    const notSetup = total - setupComplete;
    const setupPercentage =
      total > 0 ? Math.round((setupComplete / total) * 100) : 0;

    return {
      active,
      expiring30,
      expiring60,
      expiring90,
      inactive,
      notSetup,
      setupComplete,
      setupPercentage,
      sportCounts,
      total,
    };
  }, [accounts]);

  const primaryShades = getPrimaryShadesColorArray();

  const subscriptionPieData = [
    { name: "Active", value: stats.active, color: primaryShades[1] },
    { name: "Inactive", value: stats.inactive, color: primaryShades[3] },
  ];

  const sportBarData = Object.entries(stats.sportCounts).map(
    ([sport, count]) => ({
      sport,
      count,
    }),
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
    Active: { label: "Active Subscriptions", color: primaryShades[1] },
    Inactive: { label: "Inactive Subscriptions", color: primaryShades[3] },
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

  const metricItems = [
    {
      detail: `${stats.active} active / ${stats.inactive} inactive`,
      icon: CreditCard,
      label: "Total Accounts",
      value: stats.total,
    },
    {
      detail: `${stats.expiring60} in 31-60 days`,
      icon: AlertTriangle,
      label: "Expiring Soon",
      value: stats.expiring30,
    },
    {
      detail:
        Object.entries(stats.sportCounts)
          .slice(0, 2)
          .map(([sport, count]) => `${sport}: ${count}`)
          .join(" / ") || "No sport data",
      icon: Trophy,
      label: "Sports",
      value: Object.keys(stats.sportCounts).length,
    },
    {
      detail: `${stats.setupComplete} complete / ${stats.notSetup} pending`,
      icon: CheckCircle2,
      label: "Setup Complete",
      value: `${stats.setupPercentage}%`,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        {metricItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </div>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-slate-950">
                    {item.value}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {item.detail}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Subscription Status"
          description="Active vs inactive subscriptions"
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
              outerRadius={76}
              fill="#8884d8"
              dataKey="value"
            >
              {subscriptionPieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartCard>

        <ChartCard
          title="Accounts by Sport"
          description="Account count by sport"
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

        <ChartCard
          title="Expiration Timeline"
          description="Active accounts grouped by days remaining"
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
    </div>
  );
}
