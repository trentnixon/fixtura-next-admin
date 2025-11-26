"use client";

import { useMemo } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { useFixtureInsights } from "@/hooks/fixtures/useFixtureInsights";
import ErrorState from "@/components/ui-library/states/ErrorState";
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export function FixturesDistributions() {
    const { data, isLoading, error, refetch } = useFixtureInsights();

    const dayOfWeekData = useMemo(() => {
        if (!data?.data?.distributions?.byDayOfWeek) return [];
        const d = data.data.distributions.byDayOfWeek;
        return [
            { name: "Mon", value: d.monday },
            { name: "Tue", value: d.tuesday },
            { name: "Wed", value: d.wednesday },
            { name: "Thu", value: d.thursday },
            { name: "Fri", value: d.friday },
            { name: "Sat", value: d.saturday },
            { name: "Sun", value: d.sunday },
        ];
    }, [data]);

    const statusData = useMemo(() => {
        if (!data?.data?.distributions?.byStatus) return [];
        const s = data.data.distributions.byStatus;
        return [
            { name: "Upcoming", value: s.upcoming, color: "#f59e0b" }, // Amber
            { name: "In Progress", value: s.inProgress, color: "#22c55e" }, // Green
            { name: "Finished", value: s.finished, color: "#64748b" }, // Slate
            { name: "Cancelled", value: s.cancelled, color: "#ef4444" }, // Red
        ].filter((item) => item.value > 0);
    }, [data]);

    if (isLoading) {
        return (
            <SectionContainer
                title="Distributions"
                description="Breakdown by Day of Week and Status"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                </div>
            </SectionContainer>
        );
    }

    if (error) {
        return (
            <SectionContainer title="Distributions">
                <ErrorState
                    error={error}
                    title="Failed to load distribution data"
                    onRetry={() => refetch()}
                    variant="minimal"
                />
            </SectionContainer>
        );
    }

    return (
        <SectionContainer
            title="Distributions"
            description="Breakdown by Day of Week and Status"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Day of Week Bar Chart */}
                <div className="h-[300px] w-full bg-white rounded-lg p-4 border border-slate-100">
                    <h4 className="text-sm font-medium text-slate-500 mb-4 text-center">
                        Fixtures by Day of Week
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dayOfWeekData}>
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: "#f1f5f9" }}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                }}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Donut Chart */}
                <div className="h-[300px] w-full bg-white rounded-lg p-4 border border-slate-100">
                    <h4 className="text-sm font-medium text-slate-500 mb-4 text-center">
                        Fixtures by Status
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                formatter={(value) => (
                                    <span className="text-xs font-medium text-slate-600">
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </SectionContainer>
    );
}
