"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";
import { TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { RenderAnalyticsDataPoint, AnalyticsPeriod } from "@/types/render";
import ChartCard, { ChartSummaryStat } from "@/components/modules/charts/ChartCard";
import { ChartConfig, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { formatDateShort, formatNumber, formatPercentage } from "@/utils/chart-formatters";

interface RenderThroughputChartProps {
    data: RenderAnalyticsDataPoint[];
    period: AnalyticsPeriod;
}

const chartConfig: ChartConfig = {
    renderVolume: {
        label: "Successful Renders",
        color: "hsl(var(--chart-2))", // emerald-500 equivalent in some configs
    },
    totalRenders: {
        label: "Total Renders",
        color: "hsl(var(--chart-1))", // blue-500 equivalent
    },
    failureCount: {
        label: "Failures",
        color: "hsl(var(--chart-5))", // red-500
    },
};

export function RenderThroughputChart({ data, period }: RenderThroughputChartProps) {
    const totalSuccessful = data.reduce((acc, curr) => acc + curr.renderVolume, 0);
    const totalFailures = data.reduce((acc, curr) => acc + curr.failureCount, 0);
    const avgFailureRate = data.length > 0
        ? data.reduce((acc, curr) => acc + curr.failureRate, 0) / data.length
        : 0;

    const summaryStats: ChartSummaryStat[] = [
        {
            icon: CheckCircle2,
            label: "Total Success",
            value: formatNumber(totalSuccessful),
        },
        {
            icon: AlertCircle,
            label: "Total Failures",
            value: formatNumber(totalFailures),
        },
        {
            icon: TrendingUp,
            label: "Avg Failure Rate",
            value: formatPercentage(avgFailureRate),
        },
    ];

    return (
        <ChartCard
            title="System Throughput"
            description={`Render activity trends by ${period}`}
            chartConfig={chartConfig}
            summaryStats={summaryStats}
            variant="elevated"
        >
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-totalRenders)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-totalRenders)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillSuccess" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-renderVolume)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-renderVolume)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="date"
                    tickFormatter={(value) => formatDateShort(value)}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={10}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={10}
                    allowDecimals={false}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <ChartLegend content={<ChartLegendContent />} verticalAlign="top" height={36} />
                <Area
                    type="monotone"
                    dataKey="totalRenders"
                    stroke="var(--color-totalRenders)"
                    fill="url(#fillTotal)"
                    strokeWidth={2}
                    stackId="a"
                />
                <Area
                    type="monotone"
                    dataKey="renderVolume"
                    stroke="var(--color-renderVolume)"
                    fill="url(#fillSuccess)"
                    strokeWidth={2}
                    stackId="b"
                />
            </AreaChart>
        </ChartCard>
    );
}
