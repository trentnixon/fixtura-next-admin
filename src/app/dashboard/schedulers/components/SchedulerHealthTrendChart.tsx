"use client";

import ChartCard, {
    ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from "recharts";
import { TrendingUp, Activity, CheckCircle2, AlertCircle } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { useGetHealthHistory } from "@/hooks/scheduler/useGetHealthHistory";
import { formatNumber } from "@/utils/chart-formatters";
import LoadingState from "@/components/ui-library/states/LoadingState";

export default function SchedulerHealthTrendChart() {
    const { data, isLoading } = useGetHealthHistory(14);

    if (isLoading) return <LoadingState variant="default" message="Loading health trends..." />;

    const chartConfig = {
        success: {
            label: "Success",
            color: "hsl(var(--success-500))",
        },
        failed: {
            label: "Failed",
            color: "hsl(var(--error-500))",
        },
    } satisfies ChartConfig;

    // Calculate summary statistics
    const totalVolume = data?.reduce((sum, item) => sum + item.totalVolume, 0) || 0;
    const totalSuccess = data?.reduce((sum, item) => sum + item.success, 0) || 0;
    const totalFailed = data?.reduce((sum, item) => sum + item.failed, 0) || 0;
    const successRate = totalVolume > 0 ? (totalSuccess / totalVolume) * 100 : 0;
    const avgDuration = data && data.length > 0 ? data.reduce((sum, item) => sum + item.avgDuration, 0) / data.length : 0;

    const summaryStats: ChartSummaryStat[] = [
        {
            icon: CheckCircle2,
            label: "14d Success Rate",
            value: `${successRate.toFixed(1)}%`,
        },
        {
            icon: AlertCircle,
            label: "Total Failures",
            value: formatNumber(totalFailed),
        },
        {
            icon: TrendingUp,
            label: "Avg Duration",
            value: `${avgDuration.toFixed(1)}m`,
        },
        {
            icon: Activity,
            label: "Total Volume",
            value: formatNumber(totalVolume),
        },
    ];

    return (
        <ChartCard
            title="System Health Trend"
            description="Daily success vs failure rates (Last 14 Days)"
            icon={Activity}
            chartConfig={chartConfig}
            summaryStats={summaryStats}
        >
            <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(value: string) => value.split("-").slice(1).join("/")}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip
                    content={<ChartTooltipContent />}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line
                    type="monotone"
                    dataKey="success"
                    stroke="var(--color-success)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                />
                <Line
                    type="monotone"
                    dataKey="failed"
                    stroke="var(--color-failed)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                />
            </LineChart>
        </ChartCard>
    );
}
