"use client";

import {
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Line,
    ComposedChart,
} from "recharts";
import { Video, BarChart3, Zap } from "lucide-react";
import { RenderAnalyticsDataPoint, AnalyticsPeriod } from "@/types/render";
import ChartCard, { ChartSummaryStat } from "@/components/modules/charts/ChartCard";
import { ChartConfig, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { formatDateShort, formatNumber } from "@/utils/chart-formatters";

interface RenderAssetMixChartProps {
    data: RenderAnalyticsDataPoint[];
    period: AnalyticsPeriod;
}

const chartConfig: ChartConfig = {
    totalAssets: {
        label: "Total Assets",
        color: "hsl(var(--chart-3))", // yellow/amber
    },
    assetDensity: {
        label: "Asset Density (Efficiency)",
        color: "hsl(var(--chart-4))", // purple
    },
};

export function RenderAssetMixChart({ data, period }: RenderAssetMixChartProps) {
    const totalAssetsAcrossPeriod = data.reduce((acc, curr) => acc + curr.totalAssets, 0);
    const avgDensity = data.length > 0
        ? data.reduce((acc, curr) => acc + curr.assetDensity, 0) / data.length
        : 0;
    const maxVolume = Math.max(...data.map(d => d.renderVolume), 0);

    const summaryStats: ChartSummaryStat[] = [
        {
            icon: Video,
            label: "Total Assets",
            value: formatNumber(totalAssetsAcrossPeriod),
        },
        {
            icon: Zap,
            label: "Avg Efficiency",
            value: `${avgDensity.toFixed(1)} assets/render`,
        },
        {
            icon: BarChart3,
            label: "Peak Volume",
            value: formatNumber(maxVolume),
        },
    ];

    return (
        <ChartCard
            title="Asset Mix & Efficiency"
            description={`Asset production density by ${period}`}
            chartConfig={chartConfig}
            summaryStats={summaryStats}
            variant="elevated"
        >
            <ComposedChart data={data}>
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
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={10}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={10}
                    domain={[0, 'auto']}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} verticalAlign="top" height={36} />
                <Bar
                    yAxisId="left"
                    dataKey="totalAssets"
                    fill="var(--color-totalAssets)"
                    radius={[4, 4, 0, 0]}
                    name="Total Assets"
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="assetDensity"
                    stroke="var(--color-assetDensity)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "var(--color-assetDensity)" }}
                    name="Asset Density"
                />
            </ComposedChart>
        </ChartCard>
    );
}
