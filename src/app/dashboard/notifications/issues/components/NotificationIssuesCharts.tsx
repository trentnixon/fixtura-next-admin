"use client";

import { useMemo } from "react";
import { BarChart3, Layers3, PieChart as PieChartIcon } from "lucide-react";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import EmptyState from "@/components/ui-library/states/EmptyState";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type {
  NotificationIssueRow,
  NotificationIssuesFacets,
  NotificationIssuesPagination,
} from "@/types/notificationIssues";
import { sortRecordEntries } from "../../components/notificationHealthUi";
import { formatStepLabel } from "../utils/notificationIssuesTableUi";
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

interface NotificationIssuesChartsProps {
  facets: NotificationIssuesFacets;
  pagination: NotificationIssuesPagination;
  issues: NotificationIssueRow[];
  activeStep?: string;
  activeIssueScope?: string;
  onStepFilter?: (step: string) => void;
  onIssueScopeFilter?: (scope: string) => void;
}

const STEP_CHART_CONFIG = {
  count: { label: "Issues", color: "hsl(38, 92%, 50%)" },
} satisfies ChartConfig;

const SCOPE_CHART_CONFIG = {
  count: { label: "Issues", color: "hsl(221, 83%, 53%)" },
} satisfies ChartConfig;

const SEVERITY_COLORS = [
  "hsl(0, 72%, 51%)",
  "hsl(38, 92%, 50%)",
  "hsl(221, 83%, 53%)",
  "hsl(215, 16%, 47%)",
];

function HorizontalBarPanel({
  title,
  description,
  rows,
  chartConfig,
  barClassName,
  activeKey,
  onBarClick,
  emptyTitle,
}: {
  title: string;
  description: string;
  rows: { key: string; label: string; count: number }[];
  chartConfig: ChartConfig;
  barClassName?: string;
  activeKey?: string;
  onBarClick?: (key: string) => void;
  emptyTitle: string;
}) {
  const chartData = rows.slice(0, 8).map((row) => ({
    key: row.key,
    label: row.label,
    count: row.count,
  }));
  const height = Math.max(chartData.length * 28 + 24, 120);

  return (
    <OverviewRecordPanel title={title} description={description}>
      {chartData.length > 0 ? (
        <ChartContainer
          config={chartConfig}
          className="w-full"
          style={{ height }}
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="label"
              width={108}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[0, 4, 4, 0]}
              barSize={16}
              className={cn(barClassName, onBarClick && "cursor-pointer")}
              onClick={(entry) => {
                const payload = (entry as { payload?: { key?: string } })
                  .payload;
                if (payload?.key && onBarClick) onBarClick(payload.key);
              }}
            >
              {chartData.map((row) => (
                <Cell
                  key={row.key}
                  fill={
                    activeKey === row.key
                      ? "hsl(38, 92%, 42%)"
                      : "var(--color-count)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      ) : (
        <EmptyState
          variant="minimal"
          title={emptyTitle}
          description="No data for the current filter window."
          icon={<BarChart3 className="h-7 w-7 text-muted-foreground" />}
        />
      )}
    </OverviewRecordPanel>
  );
}

export function NotificationIssuesCharts({
  facets,
  pagination,
  issues,
  activeStep,
  activeIssueScope,
  onStepFilter,
  onIssueScopeFilter,
}: NotificationIssuesChartsProps) {
  const stepRows = useMemo(
    () =>
      sortRecordEntries(facets.byStep).map((row) => ({
        key: row.key,
        label: formatStepLabel(row.key),
        count: row.count,
      })),
    [facets.byStep],
  );

  const scopeRows = useMemo(
    () =>
      sortRecordEntries(facets.byIssueScope).map((row) => ({
        key: row.key,
        label: row.key,
        count: row.count,
      })),
    [facets.byIssueScope],
  );

  const severityData = useMemo(() => {
    const buckets = {
      fatal: 0,
      error: 0,
      warning: 0,
      other: 0,
    };

    for (const row of issues) {
      if (row.notification.fatal) {
        buckets.fatal += 1;
        continue;
      }
      const severity = row.severity?.toLowerCase();
      if (severity === "error" || severity === "high") {
        buckets.error += 1;
      } else if (severity === "warning" || severity === "medium") {
        buckets.warning += 1;
      } else {
        buckets.other += 1;
      }
    }

    return [
      { name: "Fatal", value: buckets.fatal, fill: SEVERITY_COLORS[0] },
      { name: "Error", value: buckets.error, fill: SEVERITY_COLORS[1] },
      { name: "Warning", value: buckets.warning, fill: SEVERITY_COLORS[2] },
      { name: "Other", value: buckets.other, fill: SEVERITY_COLORS[3] },
    ].filter((item) => item.value > 0);
  }, [issues]);

  const signalData = useMemo(() => {
    const total = pagination.totalIssues;
    const retryable = facets.retryableCount;
    const drift = facets.selectorDriftCount;
    const baseline = Math.max(total - retryable, 0);

    return [
      { name: "Retryable", value: retryable, fill: "hsl(221, 83%, 53%)" },
      { name: "Selector drift", value: drift, fill: "hsl(262, 83%, 58%)" },
      {
        name: "Other issues",
        value: Math.max(baseline - drift, 0),
        fill: "hsl(215, 16%, 47%)",
      },
    ].filter((item) => item.value > 0);
  }, [facets.retryableCount, facets.selectorDriftCount, pagination.totalIssues]);

  const severityConfig = useMemo(
    () =>
      Object.fromEntries(
        severityData.map((item) => [
          item.name.toLowerCase(),
          { label: item.name, color: item.fill },
        ]),
      ) satisfies ChartConfig,
    [severityData],
  );

  const signalConfig = useMemo(
    () =>
      Object.fromEntries(
        signalData.map((item) => [
          item.name.toLowerCase().replace(/\s+/g, "_"),
          { label: item.name, color: item.fill },
        ]),
      ) satisfies ChartConfig,
    [signalData],
  );

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <HorizontalBarPanel
        title="Failure steps"
        description="Where issues cluster in the pipeline (click to filter)"
        rows={stepRows}
        chartConfig={STEP_CHART_CONFIG}
        activeKey={activeStep}
        onBarClick={onStepFilter}
        emptyTitle="No step breakdown"
      />

      <HorizontalBarPanel
        title="Issue scope"
        description="Granular domains on issue rows (click to filter)"
        rows={scopeRows}
        chartConfig={SCOPE_CHART_CONFIG}
        barClassName="fill-sky-500"
        activeKey={activeIssueScope}
        onBarClick={onIssueScopeFilter}
        emptyTitle="No scope breakdown"
      />

      <OverviewRecordPanel
        title="Severity on this page"
        description={`Mix across ${issues.length} loaded rows`}
      >
        {severityData.length > 0 ? (
          <ChartContainer config={severityConfig} className="mx-auto h-[200px] w-full max-w-[280px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={severityData}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={2}
              >
                {severityData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <EmptyState
            variant="minimal"
            title="No issues on this page"
            description="Adjust filters or change page."
            icon={<PieChartIcon className="h-7 w-7 text-muted-foreground" />}
          />
        )}
      </OverviewRecordPanel>

      <OverviewRecordPanel
        title="Signal mix"
        description={`Retryable and selector drift across ${pagination.totalIssues.toLocaleString()} matching issues`}
      >
        {signalData.length > 0 ? (
          <ChartContainer config={signalConfig} className="mx-auto h-[200px] w-full max-w-[280px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={signalData}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={2}
              >
                {signalData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <EmptyState
            variant="minimal"
            title="No signal data"
            description="No issues in the current window."
            icon={<Layers3 className="h-7 w-7 text-muted-foreground" />}
          />
        )}
      </OverviewRecordPanel>
    </div>
  );
}
