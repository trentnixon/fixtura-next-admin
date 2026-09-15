"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewDataWorkspace } from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
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
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useRevenueAnalytics } from "@/hooks/analytics/useRevenueAnalytics";
import { useSubscriptionTrends } from "@/hooks/analytics/useSubscriptionTrends";
import { getPrimaryShadesColorArray } from "@/utils/chart-colors";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/chart-formatters";
import { cn } from "@/lib/utils";

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function sortPeriodKeys(keys: string[]): string[] {
  return [...keys].sort();
}

function formatTrendLabel(
  trend: "increasing" | "decreasing" | "stable" | undefined,
  growthRate: number | undefined,
): string {
  const rate =
    growthRate != null && Number.isFinite(growthRate)
      ? formatPercentage(Math.abs(growthRate))
      : "—";
  if (trend === "increasing") return `Up ${rate}`;
  if (trend === "decreasing") return `Down ${rate}`;
  if (trend === "stable") return "Stable";
  return "—";
}

function centsToDollars(cents: number): number {
  return cents / 100;
}

function distributionToPieData(distribution: Record<string, number> | undefined) {
  const shades = getPrimaryShadesColorArray();
  return Object.entries(distribution ?? {})
    .filter(([, value]) => value > 0)
    .map(([name, value], index) => ({
      name,
      value,
      color: shades[index % shades.length],
    }))
    .sort((a, b) => b.value - a.value);
}

function buildPieConfig(
  slices: ReturnType<typeof distributionToPieData>,
): ChartConfig {
  const config: ChartConfig = {};
  slices.forEach((slice) => {
    config[slice.name] = { label: slice.name, color: slice.color };
  });
  return config;
}

function DetailMetric({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3 py-2", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-slate-900">
        {value}
      </span>
    </div>
  );
}

/**
 * Full revenue tab — trends, composition, CLV, and subscription renewal context.
 */
export function RevenueAnalyticsWidget() {
  const { data, isLoading, error, refetch } = useRevenueAnalytics();
  const {
    data: subscriptionData,
    isLoading: subscriptionsLoading,
  } = useSubscriptionTrends();

  const trends = data?.monthlyQuarterlyRevenueTrends;
  const monthlyChartData = useMemo(() => {
    if (!trends?.monthlyRevenue) return [];
    return sortPeriodKeys(Object.keys(trends.monthlyRevenue)).map((month) => ({
      month,
      revenue: centsToDollars(trends.monthlyRevenue[month] ?? 0),
      orders: trends.monthlyOrderCounts?.[month] ?? 0,
    }));
  }, [trends]);

  const quarterlyChartData = useMemo(() => {
    if (!trends?.quarterlyRevenue) return [];
    return sortPeriodKeys(Object.keys(trends.quarterlyRevenue)).map((period) => ({
      period,
      revenue: centsToDollars(trends.quarterlyRevenue[period] ?? 0),
    }));
  }, [trends]);

  const tierPie = useMemo(() => {
    const distribution = data?.revenueBySubscriptionTier?.revenueDistribution;
    const byTier = data?.revenueBySubscriptionTier?.revenueByTier;
    const source =
      distribution && Object.keys(distribution).length > 0
        ? distribution
        : byTier
          ? Object.fromEntries(
              Object.entries(byTier).map(([k, v]) => [k, centsToDollars(v)]),
            )
          : undefined;
    return distributionToPieData(source);
  }, [data?.revenueBySubscriptionTier]);

  const accountTypePie = useMemo(() => {
    const distribution = data?.revenueByAccountType?.revenueDistribution;
    if (distribution && Object.keys(distribution).length > 0) {
      return distributionToPieData(distribution);
    }
    const byType = data?.revenueByAccountType?.revenueByAccountType;
    if (!byType) return [];
    return distributionToPieData(
      Object.fromEntries(
        Object.entries(byType).map(([k, v]) => [k, centsToDollars(v)]),
      ),
    );
  }, [data?.revenueByAccountType]);

  const paymentBarData = useMemo(() => {
    const analysis = data?.paymentMethodAnalysis;
    if (!analysis) return [];
    return Object.entries(analysis)
      .map(([method, stats]) => ({
        method,
        revenue: centsToDollars(stats.totalRevenue),
        share: stats.revenuePercentage,
        orders: stats.orderCount,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [data?.paymentMethodAnalysis]);

  const paymentConfig = useMemo(() => {
    const config: ChartConfig = {
      revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
    };
    return config;
  }, []);

  const recentMomGrowth = useMemo(() => {
    const rows = data?.revenueGrowthMetrics?.monthOverMonthGrowth ?? [];
    return [...rows].slice(-4).reverse();
  }, [data?.revenueGrowthMetrics]);

  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <div className="space-y-6">
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-72 w-full rounded-md" />
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64 rounded-md lg:col-span-2" />
            <Skeleton className="h-64 rounded-md" />
          </div>
        </div>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        variant="card"
        title="Error loading revenue analytics"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || !trends) {
    return (
      <EmptyState
        variant="card"
        title="No revenue data"
        description="Revenue analytics will appear here once order data is available."
        icon={<DollarSign className="h-12 w-12 text-muted-foreground" />}
      />
    );
  }

  const totalRevenue = centsToDollars(trends.totalRevenue);
  const growth = data.revenueGrowthMetrics;
  const projections = data.revenueProjections;
  const clv = data.customerLifetimeValueAnalysis;
  const concentration = data.revenueConcentrationAnalysis;
  const renewal = subscriptionData?.renewalChurnPatterns;
  const inlineSummary = "inline" as const;

  const monthlySummary: ChartSummaryStat[] = [
    {
      icon: DollarSign,
      label: "Total",
      value: formatCurrency(totalRevenue),
    },
    {
      icon: TrendingUp,
      label: "Monthly trend",
      value: formatTrendLabel(
        trends.monthlyTrends?.trend,
        trends.monthlyTrends?.growthRate,
      ),
    },
    {
      label: "Orders",
      value: formatNumber(data.dataPoints?.totalOrders ?? 0),
    },
  ];

  const quarterlySummary: ChartSummaryStat[] = [
    {
      icon: LineChartIcon,
      label: "Quarters",
      value: formatNumber(quarterlyChartData.length),
    },
    {
      label: "Quarterly trend",
      value: formatTrendLabel(
        trends.quarterlyTrends?.trend,
        trends.quarterlyTrends?.growthRate,
      ),
    },
  ];

  const workspaceMetrics = [
    {
      id: "total",
      label: "Total revenue",
      value: formatCurrency(totalRevenue),
      meta: `${formatNumber(monthlyChartData.length)} months in series`,
    },
    {
      id: "mom",
      label: "Avg MoM growth",
      value: formatPercentage(growth?.averageMoMGrowth ?? 0),
      meta: formatTrendLabel(growth?.revenueTrend, growth?.averageMoMGrowth),
    },
    {
      id: "projection",
      label: "Outlook",
      value: formatTrendLabel(projections?.trend, projections?.growthRate),
      meta: projections?.confidence
        ? `${projections.confidence} confidence · ${projections.basedOnMonths} mo basis`
        : "Projection unavailable",
    },
    {
      id: "customers",
      label: "Paying customers",
      value: formatNumber(clv?.totalCustomers ?? 0),
      meta: `${formatCurrency(centsToDollars(concentration?.averageRevenuePerCustomer ?? 0))} avg / customer`,
    },
  ];

  return (
    <div className="space-y-6">
      <OverviewDataWorkspace
        title="Revenue intelligence"
        description="Order revenue, growth, and how subscriptions and payment channels contribute."
        icon={DollarSign}
        metrics={workspaceMetrics}
        columns={4}
        action={
          <DashboardLinkButton href="/dashboard/orders" trailingIcon="arrow">
            Orders workspace
          </DashboardLinkButton>
        }
        footer={
          <>
            <span className="text-muted-foreground">
              {renewal && !subscriptionsLoading
                ? `Renewal ${formatPercentage(renewal.renewalRate)} · Churn ${formatPercentage(renewal.churnRate)} (subscription API)`
                : "Subscription renewal metrics load alongside revenue"}
            </span>
            <DashboardLinkButton
              href="/dashboard?tab=financials"
              intent="highlight"
              trailingIcon="external"
            >
              Dashboard financials
            </DashboardLinkButton>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <ChartCard
          title="Monthly revenue & orders"
          description="Revenue bars with order volume overlay."
          icon={BarChart3}
          chartConfig={revenueChartConfig}
          summaryStats={monthlySummary}
          summaryStatsLayout={inlineSummary}
          cardClassName="xl:col-span-2"
          chartClassName="h-[280px]"
        >
          <ComposedChart data={monthlyChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              angle={-35}
              textAnchor="end"
              height={72}
              fontSize={11}
            />
            <YAxis
              yAxisId="revenue"
              tickFormatter={(v) => formatCurrency(v)}
              fontSize={11}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              tickFormatter={(v) => formatNumber(v)}
              fontSize={11}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value, name) =>
                name === "orders"
                  ? [formatNumber(Number(value)), "Orders"]
                  : [formatCurrency(Number(value)), "Revenue"]
              }
            />
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              stroke="var(--color-orders)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartCard>

        <ChartCard
          title="Quarterly revenue"
          description="Aggregated revenue by quarter."
          icon={LineChartIcon}
          chartConfig={revenueChartConfig}
          summaryStats={quarterlySummary}
          summaryStatsLayout={inlineSummary}
          chartClassName="h-[280px]"
          emptyStateMessage="No quarterly revenue series yet."
        >
          {quarterlyChartData.length > 0 ? (
            <LineChart data={quarterlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" fontSize={11} />
              <YAxis
                tickFormatter={(v) => formatCurrency(v)}
                fontSize={11}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => formatCurrency(Number(value))}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          ) : null}
        </ChartCard>
      </div>

      <OverviewRecordPanel
        title="Revenue composition"
        description="Where revenue comes from — tier, account type, and payment channel."
        action={
          <DashboardLinkButton href="/dashboard/orders/invoices" trailingIcon="arrow">
            Invoice queue
          </DashboardLinkButton>
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <ChartCard
            title="By subscription tier"
            description="Share of revenue by product tier."
            icon={PieChartIcon}
            chartConfig={buildPieConfig(tierPie)}
            summaryStatsLayout={inlineSummary}
            chartClassName="h-[240px]"
            emptyStateMessage="No tier revenue breakdown."
          >
            {tierPie.length > 0 ? (
              <PieChart>
                <Pie
                  data={tierPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    `${name}: ${formatPercentage(percent * 100)}`
                  }
                >
                  {tierPie.map((entry, index) => (
                    <Cell key={`tier-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            ) : null}
          </ChartCard>

          <ChartCard
            title="By account type"
            description="Club vs association revenue share."
            icon={Users}
            chartConfig={buildPieConfig(accountTypePie)}
            summaryStatsLayout={inlineSummary}
            chartClassName="h-[240px]"
            emptyStateMessage="No account-type revenue split."
          >
            {accountTypePie.length > 0 ? (
              <PieChart>
                <Pie
                  data={accountTypePie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {accountTypePie.map((entry, index) => (
                    <Cell key={`acct-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            ) : null}
          </ChartCard>

          <ChartCard
            title="Payment channels"
            description="Revenue by payment method."
            icon={CreditCard}
            chartConfig={paymentConfig}
            summaryStatsLayout={inlineSummary}
            chartClassName="h-[240px]"
            emptyStateMessage="No payment method breakdown."
          >
            {paymentBarData.length > 0 ? (
              <BarChart
                data={paymentBarData}
                layout="vertical"
                margin={{ left: 8, right: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => formatCurrency(v)}
                  fontSize={11}
                />
                <YAxis
                  type="category"
                  dataKey="method"
                  width={80}
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value: number, _n, item) => [
                    `${formatCurrency(value)} (${formatPercentage(item.payload.share)})`,
                    item.payload.method,
                  ]}
                />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
              </BarChart>
            ) : null}
          </ChartCard>
        </div>
      </OverviewRecordPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <OverviewRecordPanel
          title="Customer economics"
          description="Lifetime value and revenue concentration across the customer base."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="divide-y rounded-md border border-slate-200 px-3">
              <DetailMetric
                label="Average CLV"
                value={formatCurrency(centsToDollars(clv?.averageCLV ?? 0))}
              />
              <DetailMetric
                label="Median CLV"
                value={formatCurrency(centsToDollars(clv?.medianCLV ?? 0))}
              />
              <DetailMetric
                label="Customers"
                value={formatNumber(clv?.totalCustomers ?? 0)}
              />
              <DetailMetric
                label="Avg revenue / customer"
                value={formatCurrency(
                  centsToDollars(concentration?.averageRevenuePerCustomer ?? 0),
                )}
              />
            </div>
            <div className="divide-y rounded-md border border-slate-200 px-3">
              <DetailMetric
                label="Top 10% of customers"
                value={formatPercentage(concentration?.top10PercentRevenue ?? 0)}
              />
              <DetailMetric
                label="Top 25%"
                value={formatPercentage(concentration?.top25PercentRevenue ?? 0)}
              />
              <DetailMetric
                label="Top 50%"
                value={formatPercentage(concentration?.top50PercentRevenue ?? 0)}
              />
              <DetailMetric
                label="Median revenue / customer"
                value={formatCurrency(
                  centsToDollars(concentration?.medianRevenuePerCustomer ?? 0),
                )}
              />
            </div>
          </div>
        </OverviewRecordPanel>

        <OverviewRecordPanel
          title="Growth & subscription context"
          description="Recent month-over-month changes plus renewal health from subscription analytics."
        >
          <div className="space-y-4">
            {recentMomGrowth.length > 0 ? (
              <ul className="divide-y rounded-md border border-slate-200 text-sm">
                {recentMomGrowth.map((row) => (
                  <li
                    key={row.month}
                    className="flex items-center justify-between gap-3 px-3 py-2"
                  >
                    <span className="font-medium text-slate-900">{row.month}</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-semibold tabular-nums",
                        row.growthRate >= 0 ? "text-emerald-700" : "text-red-700",
                      )}
                    >
                      {row.growthRate >= 0 ? (
                        <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" aria-hidden />
                      )}
                      {formatPercentage(row.growthRate)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No month-over-month growth series returned yet.
              </p>
            )}

            {renewal && !subscriptionsLoading ? (
              <div className="grid grid-cols-2 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Renewal rate</div>
                  <div className="mt-1 flex items-center gap-1 font-semibold text-slate-900">
                    <RefreshCcw className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                    {formatPercentage(renewal.renewalRate)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Churn rate</div>
                  <div className="mt-1 flex items-center gap-1 font-semibold text-slate-900">
                    <TrendingDown className="h-3.5 w-3.5 text-red-600" aria-hidden />
                    {formatPercentage(renewal.churnRate)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Active subs</div>
                  <div className="mt-1 font-semibold">
                    {formatNumber(
                      subscriptionData?.subscriptionLifecycleStages?.active ?? 0,
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Renewed</div>
                  <div className="mt-1 font-semibold">
                    {formatNumber(renewal.renewedSubscriptions)} /{" "}
                    {formatNumber(renewal.totalSubscriptions)}
                  </div>
                </div>
              </div>
            ) : null}

            <DashboardLinkButton href="/dashboard/orders" icon={Wallet}>
              Open orders
            </DashboardLinkButton>
          </div>
        </OverviewRecordPanel>
      </div>
    </div>
  );
}
