"use client";

import { useState } from "react";
import { useRenderAnalytics } from "@/hooks/renders/useRenderAnalytics";
import { AnalyticsPeriod } from "@/types/render";
import { RenderThroughputChart } from "./RenderThroughputChart";
import { RenderAssetMixChart } from "./RenderAssetMixChart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";

export function RenderAnalyticsDashboard() {
    const [period, setPeriod] = useState<AnalyticsPeriod>("day");
    const { data, isLoading, isError, error } = useRenderAnalytics(period);

    if (isLoading) return <LoadingState message="Calculating analytics..." />;
    if (isError) return <ErrorState error={error} title="Analytics Error" />;
    if (!data) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    System Analytics
                </h3>
                <Tabs
                    value={period}
                    onValueChange={(value) => setPeriod(value as AnalyticsPeriod)}
                    className="w-[300px]"
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="day">Daily</TabsTrigger>
                        <TabsTrigger value="week">Weekly</TabsTrigger>
                        <TabsTrigger value="month">Monthly</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RenderThroughputChart data={data.data} period={period} />
                <RenderAssetMixChart data={data.data} period={period} />
            </div>
        </div>
    );
}
