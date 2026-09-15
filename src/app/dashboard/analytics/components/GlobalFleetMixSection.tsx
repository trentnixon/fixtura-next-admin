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
import {
  Building2,
  CreditCard,
  PieChart as PieChartIcon,
  Trophy,
  Users,
} from "lucide-react";

import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import ChartCard, {
  type ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import {
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { GlobalAnalytics } from "@/types/analytics";
import { getPrimaryShadesColorArray } from "@/utils/chart-colors";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/chart-formatters";

type ChartSlice = {
  name: string;
  value: number;
  color: string;
};

function entriesToSlices(
  distribution: Record<string, number> | undefined,
  options?: { minValue?: number },
): ChartSlice[] {
  const minValue = options?.minValue ?? 0;
  const shades = getPrimaryShadesColorArray();

  return Object.entries(distribution ?? {})
    .map(([name, value], index) => ({
      name,
      value,
      color: shades[index % shades.length],
    }))
    .filter((item) => item.value > minValue)
    .sort((a, b) => b.value - a.value);
}

function buildChartConfig(slices: ChartSlice[]): ChartConfig {
  const config: ChartConfig = {};
  slices.forEach((slice) => {
    config[slice.name] = {
      label: slice.name,
      color: slice.color,
    };
  });
  return config;
}

interface GlobalFleetMixSectionProps {
  totalAccounts: number;
  accountTypesDistribution: GlobalAnalytics["accountTypesDistribution"];
  sportsDistribution: GlobalAnalytics["sportsDistribution"];
  subscriptionTierDistribution: GlobalAnalytics["subscriptionTierDistribution"];
  dataPoints: GlobalAnalytics["dataPoints"];
}

/**
 * Account type, sport, and subscription tier mix for the analytics snapshot.
 */
export function GlobalFleetMixSection({
  totalAccounts,
  accountTypesDistribution,
  sportsDistribution,
  subscriptionTierDistribution,
  dataPoints,
}: GlobalFleetMixSectionProps) {
  const accountTypeSlices = useMemo(
    () => entriesToSlices(accountTypesDistribution),
    [accountTypesDistribution],
  );

  const accountTypeTotal = useMemo(
    () => accountTypeSlices.reduce((sum, item) => sum + item.value, 0),
    [accountTypeSlices],
  );

  const sportSlices = useMemo(
    () => entriesToSlices(sportsDistribution),
    [sportsDistribution],
  );

  const tierSlices = useMemo(
    () => entriesToSlices(subscriptionTierDistribution?.distribution),
    [subscriptionTierDistribution?.distribution],
  );

  const accountTypeConfig = useMemo(
    () => buildChartConfig(accountTypeSlices),
    [accountTypeSlices],
  );

  const sportConfig = useMemo(() => {
    const config: ChartConfig = {
      share: {
        label: "Share",
        color: "hsl(var(--chart-1))",
      },
    };
    sportSlices.forEach((slice) => {
      config[slice.name] = { label: slice.name, color: slice.color };
    });
    return config;
  }, [sportSlices]);

  const tierConfig = useMemo(
    () => buildChartConfig(tierSlices),
    [tierSlices],
  );

  const accountTypeSummary: ChartSummaryStat[] = useMemo(() => {
    const lead = accountTypeSlices[0]?.name ?? "—";
    return [
      {
        icon: Users,
        label: "Accounts",
        value: formatNumber(totalAccounts || accountTypeTotal),
      },
      {
        icon: Building2,
        label: "Lead type",
        value: lead,
      },
    ];
  }, [accountTypeSlices, accountTypeTotal, totalAccounts]);

  const sportSummary: ChartSummaryStat[] = useMemo(() => {
    if (sportSlices.length === 0) return [];
    const top = sportSlices[0];

    if (sportSlices.length === 1) {
      return [
        {
          icon: Trophy,
          label: top.name,
          value: formatPercentage(top.value),
        },
      ];
    }

    return [
      {
        icon: Trophy,
        label: "Lead",
        value: `${top.name} (${formatPercentage(top.value)})`,
      },
      {
        label: "Sports",
        value: formatNumber(sportSlices.length),
      },
    ];
  }, [sportSlices]);

  const tierSummary: ChartSummaryStat[] = useMemo(
    () => [
      {
        icon: CreditCard,
        label: "Active subs",
        value: formatNumber(subscriptionTierDistribution?.totalSubscriptions ?? 0),
      },
      {
        label: "Avg value",
        value: formatCurrency(
          (subscriptionTierDistribution?.averageSubscriptionValue ?? 0) / 100,
        ),
      },
    ],
    [subscriptionTierDistribution],
  );

  const inlineSummaryLayout = "inline" as const;

  const sportBarData = sportSlices.map((slice) => ({
    sport: slice.name,
    share: slice.value,
    fill: slice.color,
  }));

  const subscriptionEmptyState = (
    <div className="space-y-3 py-4 text-center text-sm">
      <p className="font-medium text-slate-900">No subscription mix yet</p>
      <p className="text-muted-foreground">
        The analytics API did not return an active tier breakdown.{" "}
        {subscriptionTierDistribution?.totalSubscriptions
          ? `${formatNumber(subscriptionTierDistribution.totalSubscriptions)} subscriptions are counted in totals.`
          : "There may be no paid subscriptions in the current window."}
      </p>
      {dataPoints?.subscriptionTiers != null ? (
        <p className="text-xs text-muted-foreground">
          {formatNumber(dataPoints.subscriptionTiers)} tiers in product catalog
        </p>
      ) : null}
      <div className="flex justify-center pt-1">
        <DashboardLinkButton href="/dashboard/orders" trailingIcon="arrow">
          Open orders
        </DashboardLinkButton>
      </div>
    </div>
  );

  return (
    <OverviewRecordPanel
      title="Fleet mix"
      description="How accounts split by type, sport coverage, and subscription tier."
      action={
        <DashboardLinkButton href="/dashboard/accounts" trailingIcon="external">
          Account directory
        </DashboardLinkButton>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Account types"
          description="Club vs association counts across the fleet."
          icon={PieChartIcon}
          chartConfig={accountTypeConfig}
          summaryStats={accountTypeSummary}
          summaryStatsLayout={inlineSummaryLayout}
          chartClassName="h-[260px]"
          emptyStateMessage="No account type breakdown available."
        >
          {accountTypeSlices.length > 0 ? (
            <PieChart>
              <Pie
                data={accountTypeSlices}
                cx="50%"
                cy="50%"
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={3}
                label={({ name, value }) => {
                  const pct =
                    accountTypeTotal > 0
                      ? (Number(value) / accountTypeTotal) * 100
                      : 0;
                  return `${name}: ${formatPercentage(pct)}`;
                }}
              >
                {accountTypeSlices.map((entry, index) => (
                  <Cell key={`account-type-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                formatter={(value: number, _name, item) => {
                  const pct =
                    accountTypeTotal > 0
                      ? (Number(value) / accountTypeTotal) * 100
                      : 0;
                  return [
                    `${formatNumber(value)} (${formatPercentage(pct)})`,
                    item.payload.name,
                  ];
                }}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          ) : null}
        </ChartCard>

        <ChartCard
          title="Sports"
          description="Share of accounts by sport (API percentage)."
          icon={Trophy}
          chartConfig={sportConfig}
          summaryStats={sportSummary}
          summaryStatsLayout={inlineSummaryLayout}
          chartClassName="h-[260px]"
          emptyStateMessage="No sport coverage data available."
        >
          {sportBarData.length > 0 ? (
            <BarChart
              data={sportBarData}
              layout="vertical"
              margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(v) => formatPercentage(v)}
                fontSize={12}
              />
              <YAxis
                type="category"
                dataKey="sport"
                width={72}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                formatter={(value: number) => formatPercentage(Number(value))}
              />
              <Bar dataKey="share" radius={[0, 4, 4, 0]}>
                {sportBarData.map((entry, index) => (
                  <Cell key={`sport-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          ) : null}
        </ChartCard>

        <ChartCard
          title="Subscription tiers"
          description="Active mix by tier (percent of subscriptions)."
          icon={CreditCard}
          chartConfig={tierConfig}
          summaryStats={tierSummary}
          summaryStatsLayout={inlineSummaryLayout}
          chartClassName="h-[260px]"
          emptyState={subscriptionEmptyState}
        >
          {tierSlices.length > 0 ? (
            <PieChart>
              <Pie
                data={tierSlices}
                cx="50%"
                cy="50%"
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={3}
                label={({ name, value }) =>
                  `${name}: ${formatPercentage(Number(value))}`
                }
              >
                {tierSlices.map((entry, index) => (
                  <Cell key={`tier-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                formatter={(value: number, _name, item) => [
                  formatPercentage(Number(value)),
                  item.payload.name,
                ]}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          ) : null}
        </ChartCard>
      </div>
    </OverviewRecordPanel>
  );
}
