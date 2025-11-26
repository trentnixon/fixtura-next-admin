"use client";

import { useMemo } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { useFixtureInsights } from "@/hooks/fixtures/useFixtureInsights";
import ErrorState from "@/components/ui-library/states/ErrorState";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";

export function FixturesTimeline() {
    const { data, isLoading, error, refetch } = useFixtureInsights();

    const chartData = useMemo(() => {
        if (!data?.data?.charts?.fixtureTimeline) return [];

        return data.data.charts.fixtureTimeline.map((item) => ({
            date: item.date,
            formattedDate: format(parseISO(item.date), "MMM d"),
            total: item.fixtureCount,
            upcoming: item.statusBreakdown.upcoming,
            finished: item.statusBreakdown.finished,
            inProgress: item.statusBreakdown.inProgress,
        }));
    }, [data]);

    if (isLoading) {
        return (
            <SectionContainer
                title="Fixture Timeline"
                description="Visualization of fixture volume over time"
            >
                <div className="h-[300px] w-full">
                    <Skeleton className="h-full w-full rounded-lg" />
                </div>
            </SectionContainer>
        );
    }

    if (error) {
        return (
            <SectionContainer title="Fixture Timeline">
                <ErrorState
                    error={error}
                    title="Failed to load timeline data"
                    onRetry={() => refetch()}
                    variant="minimal"
                />
            </SectionContainer>
        );
    }

    if (chartData.length === 0) {
        return null;
    }

    return (
        <SectionContainer
            title="Fixture Timeline"
            description="Daily fixture volume (Upcoming vs Finished)"
        >
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorUpcoming" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorFinished" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#64748b" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="formattedDate"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            itemStyle={{ fontSize: "12px", fontWeight: 500 }}
                            labelStyle={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="finished"
                            name="Finished"
                            stroke="#64748b"
                            fillOpacity={1}
                            fill="url(#colorFinished)"
                            stackId="1"
                        />
                        <Area
                            type="monotone"
                            dataKey="upcoming"
                            name="Upcoming"
                            stroke="#f59e0b"
                            fillOpacity={1}
                            fill="url(#colorUpcoming)"
                            stackId="1"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </SectionContainer>
    );
}
