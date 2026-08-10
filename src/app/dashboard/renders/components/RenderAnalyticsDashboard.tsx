"use client";

import { useState } from "react";
import { useRenderAnalytics } from "@/hooks/renders/useRenderAnalytics";
import { AnalyticsPeriod } from "@/types/render";
import { RenderThroughputChart } from "./RenderThroughputChart";
import { RenderAssetMixChart } from "./RenderAssetMixChart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

const PERIOD_DESCRIPTION: Record<AnalyticsPeriod, string> = {
  day: "Daily buckets, last 30 days",
  week: "ISO weeks, last 12 weeks",
  month: "Monthly buckets, last 12 months",
};

export function RenderAnalyticsDashboard() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("day");
  const { data, isLoading, isError, error } = useRenderAnalytics(period);

  if (isLoading) return <LoadingState message="Calculating analytics..." />;
  if (isError) return <ErrorState error={error} title="Analytics Error" />;
  if (!data) return null;

  const hasData = data.data.length > 0;

  return (
    <SectionContainer
      title="System Analytics"
      description={`Render throughput, failure rate, and asset density. ${PERIOD_DESCRIPTION[period]}.`}
      action={
        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as AnalyticsPeriod)}
          className="w-full sm:w-[300px]"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="day">Daily</TabsTrigger>
            <TabsTrigger value="week">Weekly</TabsTrigger>
            <TabsTrigger value="month">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      }
    >
      {!hasData ? (
        <EmptyState
          variant="default"
          title="No analytics for this period"
          description="There are no renders in the selected time range. Try another period or check back after renders complete."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RenderThroughputChart data={data.data} period={period} />
          <RenderAssetMixChart data={data.data} period={period} />
        </div>
      )}
    </SectionContainer>
  );
}
