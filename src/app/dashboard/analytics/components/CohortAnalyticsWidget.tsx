"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  DollarSign,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Shield,
  Target,
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
import { useCohortAnalysis } from "@/hooks/analytics/useCohortAnalysis";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/chart-formatters";
import {
  buildPieConfig,
  distributionToPieData,
  sortPeriodKeys,
} from "./analyticsChartHelpers";

const inlineSummary = "inline" as const;

const countConfig = {
  count: { label: "Accounts", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const revenueConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
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

function centsToDollars(cents: number | null | undefined): number {
  return (cents ?? 0) / 100;
}

/**
 * Cohorts tab — acquisition, retention, lifecycle, revenue, CLV, and segments.
 */
export function CohortAnalyticsWidget() {
  const { data, isLoading, error, refetch } = useCohortAnalysis();

  const acquisition = data?.acquisitionCohorts;
  const retention = data?.retentionAnalysis;
  const lifecycle = data?.lifecycleStages;
  const revenue = data?.cohortRevenuePatterns;
  const churn = data?.churnAnalysis;
  const performance = data?.cohortPerformanceMetrics;
  const clv = data?.clvByCohort;
  const conversion = data?.conversionFunnels;
  const engagement = data?.engagementPatterns;
  const segmentation = data?.cohortSegmentation;

  const acquisitionBarData = useMemo(() => {
    return sortPeriodKeys(Object.keys(acquisition?.monthlyCohorts ?? {}))
      .slice(-12)
      .map((period) => ({
        period,
        accounts: acquisition?.monthlyCohorts?.[period]?.totalAccounts ?? 0,
      }));
  }, [acquisition?.monthlyCohorts]);

  const retentionByCohort = useMemo(() => {
    return Object.entries(retention?.retentionRates ?? {})
      .map(([cohort, row]) => ({
        cohort,
        retention: row.averageRetentionRate ?? 0,
        size: row.cohortSize ?? 0,
      }))
      .sort((a, b) => a.cohort.localeCompare(b.cohort))
      .slice(-10);
  }, [retention?.retentionRates]);

  const lifecyclePie = useMemo(() => {
    const metrics = lifecycle?.stageMetrics ?? {};
    return distributionToPieData(
      Object.fromEntries(
        Object.entries(metrics).map(([stage, m]) => [stage, m.count ?? 0]),
      ),
    );
  }, [lifecycle?.stageMetrics]);

  const cohortRevenueBar = useMemo(() => {
    return Object.entries(revenue?.cohortRevenue ?? {})
      .map(([cohort, row]) => ({
        cohort,
        revenue: centsToDollars(row.totalRevenue),
      }))
      .sort((a, b) => a.cohort.localeCompare(b.cohort))
      .slice(-10);
  }, [revenue?.cohortRevenue]);

  const monthlyCohortRevenue = useMemo(() => {
    return sortPeriodKeys(Object.keys(revenue?.monthlyRevenue ?? {}))
      .slice(-12)
      .map((month) => ({
        month,
        revenue: centsToDollars(revenue?.monthlyRevenue?.[month]),
      }));
  }, [revenue?.monthlyRevenue]);

  const segmentPie = useMemo(() => {
    const metrics = segmentation?.segmentMetrics ?? {};
    return distributionToPieData(
      Object.fromEntries(
        Object.entries(metrics).map(([segment, m]) => [segment, m.count ?? 0]),
      ),
    );
  }, [segmentation?.segmentMetrics]);

  const churnRows = useMemo(() => {
    return Object.entries(churn?.churnAnalysis ?? {})
      .map(([cohort, row]) => ({
        cohort,
        churnRate: row.churnRate ?? 0,
        retentionRate: row.retentionRate ?? 0,
        churned: row.churnedAccounts ?? 0,
      }))
      .sort((a, b) => b.churnRate - a.churnRate)
      .slice(0, 8);
  }, [churn?.churnAnalysis]);

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
        title="Error loading cohort analytics"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        variant="card"
        title="No cohort data"
        description="Cohort analytics will appear here once account history is available."
        icon={<Users className="h-12 w-12 text-muted-foreground" />}
      />
    );
  }

  const overallRetention = retention?.overallRetentionMetrics;
  const overallChurn = churn?.overallChurnMetrics;
  const overallClv = clv?.overallCLVMetrics;
  const overallPerf = performance?.overallPerformance;
  const overallConversion = conversion?.overallConversionMetrics;
  const overallEngagement = engagement?.overallEngagementMetrics;
  const activeStage = lifecycle?.stageMetrics?.active;
  const churnedStage = lifecycle?.stageMetrics?.churned;

  const workspaceMetrics = [
    {
      id: "cohorts",
      label: "Cohorts",
      value: formatNumber(acquisition?.totalCohorts ?? 0),
      meta: `${formatNumber(acquisition?.totalAccounts ?? 0)} accounts acquired`,
    },
    {
      id: "retention",
      label: "Avg retention",
      value: formatPercentage(overallRetention?.averageRetentionRate ?? 0),
      meta: `${formatNumber(overallRetention?.totalCohorts ?? 0)} cohorts tracked`,
    },
    {
      id: "churn",
      label: "Avg churn",
      value: formatPercentage(overallChurn?.averageChurnRate ?? 0),
      meta: `${formatNumber(overallChurn?.totalChurned ?? 0)} churned total`,
    },
    {
      id: "clv",
      label: "Avg CLV",
      value: formatCurrency(centsToDollars(overallClv?.averageCLV)),
      meta: `${formatCurrency(centsToDollars(revenue?.totalRevenue))} cohort revenue`,
    },
  ];

  const acquisitionSummary: ChartSummaryStat[] = [
    {
      icon: Users,
      label: "Monthly cohorts",
      value: formatNumber(Object.keys(acquisition?.monthlyCohorts ?? {}).length),
    },
    {
      label: "Quarterly",
      value: formatNumber(
        Object.keys(acquisition?.quarterlyCohorts ?? {}).length,
      ),
    },
  ];

  const retentionSummary: ChartSummaryStat[] = [
    {
      icon: Shield,
      label: "Retention",
      value: formatPercentage(overallRetention?.averageRetentionRate ?? 0),
    },
    {
      label: "Accounts",
      value: formatNumber(overallRetention?.totalAccounts ?? 0),
    },
  ];

  return (
    <div className="space-y-6">
      <OverviewDataWorkspace
        title="Cohort intelligence"
        description="Acquisition cohorts, retention curves, lifecycle mix, and revenue by vintage."
        icon={Users}
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
                ? `${formatNumber(data.dataPoints.totalAccounts ?? 0)} accounts · ${formatNumber(data.dataPoints.trialInstances ?? 0)} trials in dataset`
                : "Cohort dataset metadata"}
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
          title="Acquisition by month"
          description="New accounts grouped by acquisition period."
          icon={TrendingUp}
          chartConfig={countConfig}
          summaryStats={acquisitionSummary}
          summaryStatsLayout={inlineSummary}
          cardClassName="xl:col-span-2"
          chartClassName="h-[280px]"
          emptyStateMessage="No monthly acquisition cohorts."
        >
          {acquisitionBarData.length > 0 ? (
            <BarChart data={acquisitionBarData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="period"
                angle={-35}
                textAnchor="end"
                height={72}
                fontSize={11}
              />
              <YAxis fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="accounts"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : null}
        </ChartCard>

        <ChartCard
          title="Lifecycle mix"
          description="Share of accounts in each lifecycle stage."
          icon={PieChartIcon}
          chartConfig={buildPieConfig(lifecyclePie)}
          chartClassName="h-[280px]"
          emptyStateMessage="No lifecycle stage data."
        >
          {lifecyclePie.length > 0 ? (
            <PieChart>
              <Pie
                data={lifecyclePie}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={2}
              >
                {lifecyclePie.map((entry, index) => (
                  <Cell key={`life-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          ) : null}
        </ChartCard>
      </div>

      <OverviewRecordPanel
        title="Retention & churn by cohort"
        description="Average retention by vintage and cohorts with the highest churn."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Retention by cohort"
            description="Average retention rate per acquisition cohort."
            icon={Shield}
            chartConfig={countConfig}
            summaryStats={retentionSummary}
            summaryStatsLayout={inlineSummary}
            chartClassName="h-[260px]"
            emptyStateMessage="No cohort retention series."
          >
            {retentionByCohort.length > 0 ? (
              <BarChart data={retentionByCohort} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(v) => formatPercentage(v)}
                  fontSize={11}
                />
                <YAxis
                  type="category"
                  dataKey="cohort"
                  width={80}
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value: number, _n, item) => [
                    `${formatPercentage(value)} · ${formatNumber(item.payload.size)} accounts`,
                    item.payload.cohort,
                  ]}
                />
                <Bar
                  dataKey="retention"
                  fill="hsl(var(--chart-2))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            ) : null}
          </ChartCard>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900">
              Highest churn cohorts
            </h4>
            {churnRows.length > 0 ? (
              <ul className="divide-y rounded-md border border-slate-200 text-sm">
                {churnRows.map((row) => (
                  <li
                    key={row.cohort}
                    className="flex items-center justify-between gap-3 px-3 py-2"
                  >
                    <span className="font-medium text-slate-900">{row.cohort}</span>
                    <span className="text-right text-muted-foreground">
                      <span className="font-semibold tabular-nums text-red-700">
                        {formatPercentage(row.churnRate)}
                      </span>
                      {" · "}
                      {formatNumber(row.churned)} churned
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No cohort-level churn breakdown yet.
              </p>
            )}
            <div className="rounded-md border border-slate-200 px-3 py-1">
              <DetailMetric
                label="Active lifecycle share"
                value={formatPercentage(activeStage?.percentage ?? 0)}
              />
              <DetailMetric
                label="Churned lifecycle share"
                value={formatPercentage(churnedStage?.percentage ?? 0)}
              />
              <DetailMetric
                label="Lifecycle accounts"
                value={formatNumber(lifecycle?.totalAccounts ?? 0)}
              />
            </div>
          </div>
        </div>
      </OverviewRecordPanel>

      <OverviewRecordPanel
        title="Revenue & value"
        description="Cohort revenue vintages, monthly totals, CLV, and performance."
        action={
          <DashboardLinkButton href="/dashboard/orders" trailingIcon="arrow">
            Orders workspace
          </DashboardLinkButton>
        }
      >
        <div className="grid gap-6 xl:grid-cols-3">
          <ChartCard
            title="Revenue by cohort"
            description="Total revenue attributed to each cohort."
            icon={DollarSign}
            chartConfig={revenueConfig}
            summaryStatsLayout={inlineSummary}
            summaryStats={[
              {
                icon: DollarSign,
                label: "Total",
                value: formatCurrency(centsToDollars(revenue?.totalRevenue)),
              },
              {
                label: "Avg / cohort",
                value: formatCurrency(
                  centsToDollars(revenue?.averageRevenuePerCohort),
                ),
              },
            ]}
            chartClassName="h-[240px]"
            emptyStateMessage="No cohort revenue breakdown."
          >
            {cohortRevenueBar.length > 0 ? (
              <BarChart data={cohortRevenueBar} layout="vertical" margin={{ left: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => formatCurrency(v)}
                  fontSize={11}
                />
                <YAxis
                  type="category"
                  dataKey="cohort"
                  width={72}
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--chart-1))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            ) : null}
          </ChartCard>

          <ChartCard
            title="Monthly cohort revenue"
            description="Revenue trend across cohort months."
            icon={LineChartIcon}
            chartConfig={revenueConfig}
            chartClassName="h-[240px]"
            emptyStateMessage="No monthly cohort revenue series."
          >
            {monthlyCohortRevenue.length > 0 ? (
              <LineChart data={monthlyCohortRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={10} angle={-25} textAnchor="end" height={56} />
                <YAxis tickFormatter={(v) => formatCurrency(v)} fontSize={11} />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            ) : null}
          </ChartCard>

          <ChartCard
            title="Value segments"
            description="High / medium / low value and trial segments."
            icon={Target}
            chartConfig={buildPieConfig(segmentPie)}
            chartClassName="h-[240px]"
            emptyStateMessage="No segment mix."
          >
            {segmentPie.length > 0 ? (
              <PieChart>
                <Pie
                  data={segmentPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={44}
                  outerRadius={72}
                >
                  {segmentPie.map((entry, index) => (
                    <Cell key={`seg-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            ) : null}
          </ChartCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-md border border-slate-200 px-3 py-1">
            <DetailMetric
              label="Overall average CLV"
              value={formatCurrency(centsToDollars(overallClv?.averageCLV))}
            />
            <DetailMetric
              label="Total CLV (all cohorts)"
              value={formatCurrency(centsToDollars(overallClv?.totalCLV))}
            />
            <DetailMetric
              label="Avg conversion rate"
              value={formatPercentage(overallPerf?.averageConversionRate ?? 0)}
            />
            <DetailMetric
              label="Converted accounts"
              value={formatNumber(overallPerf?.totalConverted ?? 0)}
            />
          </div>
          <div className="rounded-md border border-slate-200 px-3 py-1">
            <DetailMetric
              label="Funnel conversion (avg)"
              value={formatPercentage(
                overallConversion?.averageConversionRate ?? 0,
              )}
            />
            <DetailMetric
              label="Engagement rate (avg)"
              value={formatPercentage(
                overallEngagement?.averageEngagementRate ?? 0,
              )}
            />
            <DetailMetric
              label="Engaged accounts"
              value={formatNumber(overallEngagement?.totalEngaged ?? 0)}
            />
            <DetailMetric
              label="Segment accounts"
              value={formatNumber(segmentation?.totalAccounts ?? 0)}
            />
          </div>
        </div>
      </OverviewRecordPanel>
    </div>
  );
}
