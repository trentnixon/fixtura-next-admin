"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownUp,
  CheckCircle2,
  PieChart as PieChartIcon,
  RefreshCcw,
  Repeat,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewDataWorkspace } from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import ChartCard, {
  type ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import {
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscriptionTrends } from "@/hooks/analytics/useSubscriptionTrends";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/chart-formatters";
import { cn } from "@/lib/utils";
import {
  buildPieConfig,
  distributionToPieData,
  formatGrowthTrendLabel,
  sortPeriodKeys,
} from "./analyticsChartHelpers";

const inlineSummary = "inline" as const;

const monthlyFlowConfig = {
  subscriptions: { label: "New subs", color: "hsl(var(--chart-1))" },
  renewals: { label: "Renewals", color: "hsl(var(--chart-2))" },
  cancellations: { label: "Cancellations", color: "hsl(var(--chart-3))" },
  netGrowth: { label: "Net growth", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

const lifecycleConfig = {
  count: { label: "Subscriptions", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-slate-900">
        {value}
      </span>
    </div>
  );
}

function accountTypeBarData(distribution: Record<string, number> | undefined) {
  return Object.entries(distribution ?? {})
    .map(([type, value]) => ({ type, value }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value);
}

/**
 * Subscriptions tab — lifecycle, renewals, monthly flow, migration, and journey.
 */
export function SubscriptionAnalyticsWidget() {
  const { data, isLoading, error, refetch } = useSubscriptionTrends();

  const lifecycle = data?.subscriptionLifecycleStages;
  const renewalChurn = data?.renewalChurnPatterns;
  const monthly = data?.monthlySubscriptionTrends;
  const status = data?.subscriptionStatusDistribution;
  const migration = data?.tierMigrationPatterns;
  const duration = data?.subscriptionDurationTrends;
  const upgradeDowngrade = data?.upgradeDowngradePatterns;
  const journey = data?.customerJourneyAnalysis;

  const lifecycleBarData = useMemo(() => {
    if (!lifecycle) return [];
    return [
      { stage: "New", count: lifecycle.new },
      { stage: "Active", count: lifecycle.active },
      { stage: "Renewing", count: lifecycle.renewing },
      { stage: "Churning", count: lifecycle.churning },
      { stage: "Churned", count: lifecycle.churned },
      { stage: "Dormant", count: lifecycle.dormant },
    ];
  }, [lifecycle]);

  const monthlyFlowData = useMemo(() => {
    if (!monthly) return [];
    const keys = sortPeriodKeys(
      Array.from(
        new Set([
          ...Object.keys(monthly.monthlySubscriptions ?? {}),
          ...Object.keys(monthly.monthlyRenewals ?? {}),
          ...Object.keys(monthly.monthlyCancellations ?? {}),
          ...Object.keys(monthly.netGrowth ?? {}),
        ]),
      ),
    );

    return keys.map((month) => ({
      month,
      subscriptions: monthly.monthlySubscriptions?.[month] ?? 0,
      renewals: monthly.monthlyRenewals?.[month] ?? 0,
      cancellations: monthly.monthlyCancellations?.[month] ?? 0,
      netGrowth: monthly.netGrowth?.[month] ?? 0,
    }));
  }, [monthly]);

  const statusPie = useMemo(() => {
    const fromDistribution = distributionToPieData(status?.distribution);
    if (fromDistribution.length > 0) return fromDistribution;
    return distributionToPieData({
      Active: status?.active ?? 0,
      Cancelled: status?.cancelled ?? 0,
      Expired: status?.expired ?? 0,
      Pending: status?.pending ?? 0,
      Suspended: status?.suspended ?? 0,
    });
  }, [status]);

  const netMigrationPie = useMemo(
    () => distributionToPieData(migration?.netMigration),
    [migration?.netMigration],
  );

  const renewalByType = useMemo(
    () => accountTypeBarData(renewalChurn?.renewalByAccountType),
    [renewalChurn?.renewalByAccountType],
  );

  const churnByType = useMemo(
    () => accountTypeBarData(renewalChurn?.churnByAccountType),
    [renewalChurn?.churnByAccountType],
  );

  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <div className="space-y-6">
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-72 w-full rounded-md" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64 rounded-md" />
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
        title="Error loading subscription analytics"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        variant="card"
        title="No subscription data"
        description="Subscription analytics will appear here once order data is available."
        icon={<Repeat className="h-12 w-12 text-muted-foreground" />}
      />
    );
  }

  const workspaceMetrics = [
    {
      id: "active",
      label: "Active",
      value: formatNumber(lifecycle?.active ?? 0),
      meta: `${formatNumber(renewalChurn?.totalSubscriptions ?? 0)} total in scope`,
    },
    {
      id: "renewal",
      label: "Renewal rate",
      value: formatPercentage(renewalChurn?.renewalRate ?? 0),
      meta: `${formatNumber(renewalChurn?.renewedSubscriptions ?? 0)} renewed`,
    },
    {
      id: "churn",
      label: "Churn rate",
      value: formatPercentage(renewalChurn?.churnRate ?? 0),
      meta: `${formatNumber(renewalChurn?.churnedSubscriptions ?? 0)} churned`,
    },
    {
      id: "trend",
      label: "Monthly trend",
      value: formatGrowthTrendLabel(monthly?.trend, monthly?.growthRate),
      meta: migration
        ? `${formatNumber(migration.upgrades ?? 0)} upgrades / ${formatNumber(migration.downgrades ?? 0)} downgrades`
        : "Migration data unavailable",
    },
  ];

  const flowSummary: ChartSummaryStat[] = [
    {
      icon: TrendingUp,
      label: "Growth rate",
      value: formatPercentage(monthly?.growthRate ?? 0),
    },
    {
      label: "Trend",
      value: monthly?.trend ?? "—",
    },
  ];

  const renewalSummary: ChartSummaryStat[] = [
    {
      icon: RefreshCcw,
      label: "Renewal",
      value: formatPercentage(renewalChurn?.renewalRate ?? 0),
    },
    {
      icon: TrendingDown,
      label: "Churn",
      value: formatPercentage(renewalChurn?.churnRate ?? 0),
    },
    {
      label: "Avg renewal gap",
      value: `${formatNumber(renewalChurn?.averageRenewalInterval ?? 0)} days`,
    },
  ];

  return (
    <div className="space-y-6">
      <OverviewDataWorkspace
        title="Subscription health"
        description="Lifecycle stages, renewals, churn, and monthly subscription movement."
        icon={Repeat}
        metrics={workspaceMetrics}
        columns={4}
        action={
          <DashboardLinkButton href="/dashboard/accounts" trailingIcon="external">
            Account directory
          </DashboardLinkButton>
        }
        footer={
          <>
            <span className="text-muted-foreground">
              {data.dataPoints
                ? `${formatNumber(data.dataPoints.totalOrders ?? 0)} orders · ${formatNumber(data.dataPoints.subscriptionTiers ?? 0)} tiers in catalog`
                : "Order and tier catalog metadata"}
            </span>
            <DashboardLinkButton
              href="/dashboard/orders"
              intent="highlight"
              trailingIcon="arrow"
            >
              Orders workspace
            </DashboardLinkButton>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <ChartCard
          title="Monthly subscription flow"
          description="New subscriptions, renewals, cancellations, and net growth."
          icon={TrendingUp}
          chartConfig={monthlyFlowConfig}
          summaryStats={flowSummary}
          summaryStatsLayout={inlineSummary}
          cardClassName="xl:col-span-2"
          chartClassName="h-[280px]"
          emptyStateMessage="No monthly subscription series yet."
        >
          {monthlyFlowData.length > 0 ? (
            <ComposedChart data={monthlyFlowData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                angle={-35}
                textAnchor="end"
                height={72}
                fontSize={11}
              />
              <YAxis yAxisId="volume" fontSize={11} />
              <YAxis yAxisId="net" orientation="right" fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                yAxisId="volume"
                dataKey="subscriptions"
                fill="var(--color-subscriptions)"
                radius={[2, 2, 0, 0]}
                stackId="flow"
              />
              <Bar
                yAxisId="volume"
                dataKey="renewals"
                fill="var(--color-renewals)"
                radius={[2, 2, 0, 0]}
                stackId="flow"
              />
              <Bar
                yAxisId="volume"
                dataKey="cancellations"
                fill="var(--color-cancellations)"
                radius={[2, 2, 0, 0]}
              />
              <Line
                yAxisId="net"
                type="monotone"
                dataKey="netGrowth"
                stroke="var(--color-netGrowth)"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </ComposedChart>
          ) : null}
        </ChartCard>

        <ChartCard
          title="Lifecycle stages"
          description="Where subscriptions sit in the lifecycle today."
          icon={CheckCircle2}
          chartConfig={lifecycleConfig}
          chartClassName="h-[280px]"
        >
          <BarChart data={lifecycleBarData} layout="vertical" margin={{ left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" fontSize={11} />
            <YAxis
              type="category"
              dataKey="stage"
              width={72}
              tickLine={false}
              axisLine={false}
              fontSize={11}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="count"
              fill="hsl(var(--chart-1))"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartCard>
      </div>

      <OverviewRecordPanel
        title="Renewals & status"
        description="Health of renewals and how subscriptions are classified right now."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <ChartCard
            title="Renewal vs churn"
            description="Headline renewal metrics."
            icon={RefreshCcw}
            chartConfig={lifecycleConfig}
            summaryStats={renewalSummary}
            summaryStatsLayout={inlineSummary}
            chartClassName="h-[220px]"
          >
            <div className="rounded-md border border-slate-200 px-3 py-1">
              <DetailMetric
                label="Renewed subscriptions"
                value={formatNumber(renewalChurn?.renewedSubscriptions ?? 0)}
              />
              <DetailMetric
                label="Churned subscriptions"
                value={formatNumber(renewalChurn?.churnedSubscriptions ?? 0)}
              />
              <DetailMetric
                label="Total in analysis"
                value={formatNumber(renewalChurn?.totalSubscriptions ?? 0)}
              />
            </div>
          </ChartCard>

          <ChartCard
            title="Status mix"
            description="Active, cancelled, expired, and other states."
            icon={PieChartIcon}
            chartConfig={buildPieConfig(statusPie)}
            chartClassName="h-[220px]"
            emptyStateMessage="No status distribution."
          >
            {statusPie.length > 0 ? (
              <PieChart>
                <Pie
                  data={statusPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={44}
                  outerRadius={72}
                  paddingAngle={2}
                >
                  {statusPie.map((entry, index) => (
                    <Cell key={`status-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            ) : null}
          </ChartCard>

          <ChartCard
            title="Renewal & churn by account type"
            description="Club vs association split."
            icon={Users}
            chartConfig={{
              renewal: { label: "Renewal", color: "hsl(var(--chart-2))" },
              churn: { label: "Churn", color: "hsl(var(--chart-3))" },
            }}
            chartClassName="h-[220px]"
            emptyStateMessage="No account-type renewal data."
          >
            {renewalByType.length > 0 || churnByType.length > 0 ? (
              <div className="space-y-4 text-sm">
                {renewalByType.length > 0 ? (
                  <div>
                    <div className="mb-2 font-medium text-slate-900">Renewals</div>
                    <ul className="space-y-1">
                      {renewalByType.map((row) => (
                        <li
                          key={`renew-${row.type}`}
                          className="flex justify-between gap-2 text-muted-foreground"
                        >
                          <span>{row.type}</span>
                          <span className="font-semibold tabular-nums text-slate-900">
                            {formatNumber(row.value)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {churnByType.length > 0 ? (
                  <div>
                    <div className="mb-2 font-medium text-slate-900">Churn</div>
                    <ul className="space-y-1">
                      {churnByType.map((row) => (
                        <li
                          key={`churn-${row.type}`}
                          className="flex justify-between gap-2 text-muted-foreground"
                        >
                          <span>{row.type}</span>
                          <span className="font-semibold tabular-nums text-slate-900">
                            {formatNumber(row.value)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </ChartCard>
        </div>
      </OverviewRecordPanel>

      <OverviewRecordPanel
        title="Tier movement & customer journey"
        description="Upgrades, downgrades, tenure, and trial-to-paid paths."
        action={
          <DashboardLinkButton href="/dashboard/orders/invoices" trailingIcon="arrow">
            Invoice queue
          </DashboardLinkButton>
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <ChartCard
              title="Net tier migration"
              description="Net movement between subscription tiers."
              icon={ArrowDownUp}
              chartConfig={buildPieConfig(netMigrationPie)}
              summaryStatsLayout={inlineSummary}
              summaryStats={[
                {
                  label: "Upgrades",
                  value: formatNumber(migration?.upgrades ?? 0),
                },
                {
                  label: "Downgrades",
                  value: formatNumber(migration?.downgrades ?? 0),
                },
              ]}
              chartClassName="h-[200px]"
              emptyStateMessage="No tier migration recorded."
            >
              {netMigrationPie.length > 0 ? (
                <PieChart>
                  <Pie
                    data={netMigrationPie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={68}
                  >
                    {netMigrationPie.map((entry, index) => (
                      <Cell key={`migrate-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </PieChart>
              ) : null}
            </ChartCard>

            {upgradeDowngrade ? (
              <div className="rounded-md border border-slate-200 px-3 py-1">
                <DetailMetric
                  label="Upgrade rate"
                  value={formatPercentage(upgradeDowngrade.upgradeRate ?? 0)}
                />
                <DetailMetric
                  label="Downgrade rate"
                  value={formatPercentage(upgradeDowngrade.downgradeRate ?? 0)}
                />
                <DetailMetric
                  label="Net value change"
                  value={formatCurrency((upgradeDowngrade.netValueChange ?? 0) / 100)}
                />
                <DetailMetric
                  label="Upgrade / downgrade ratio"
                  value={formatNumber(upgradeDowngrade.upgradeDowngradeRatio ?? 0)}
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="rounded-md border border-slate-200 px-3 py-1">
              <DetailMetric
                label="Average subscription length"
                value={`${formatNumber(duration?.averageDuration ?? 0)} days`}
              />
              <DetailMetric
                label="Median subscription length"
                value={`${formatNumber(duration?.medianDuration ?? 0)} days`}
              />
              <DetailMetric
                label="Trial → paid"
                value={formatNumber(journey?.trialToPaid ?? 0)}
              />
              <DetailMetric
                label="Direct to paid"
                value={formatNumber(journey?.directToPaid ?? 0)}
              />
              <DetailMetric
                label="Trial conversion rate"
                value={formatPercentage(journey?.trialConversionRate ?? 0)}
              />
              <DetailMetric
                label="Avg time to convert"
                value={`${formatNumber(journey?.averageTimeToConversion ?? 0)} days`}
              />
            </div>

            {journey?.journeyPaths && journey.journeyPaths.length > 0 ? (
              <ul className="divide-y rounded-md border border-slate-200 text-sm">
                {journey.journeyPaths.slice(0, 5).map((path, index) => (
                  <li
                    key={`path-${index}`}
                    className="flex flex-col gap-1 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-medium text-slate-900">
                      {path.path.join(" → ")}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 tabular-nums text-muted-foreground",
                      )}
                    >
                      {formatNumber(path.count ?? 0)} ·{" "}
                      {formatPercentage(path.conversionRate ?? 0)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No journey path breakdown returned yet.
              </p>
            )}
          </div>
        </div>
      </OverviewRecordPanel>
    </div>
  );
}
