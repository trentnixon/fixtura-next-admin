"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import { P } from "@/components/type/type";
import { H3 } from "@/components/type/titles";
import PerformanceMetricsCards from "../performance/PerformanceMetricsCards";
import PerformanceOverTimeChart from "../performance/PerformanceOverTimeChart";
import PerformanceDistributionChart from "../performance/PerformanceDistributionChart";

interface PerformanceTabProps {
  data: AccountStatsResponse;
}

export default function PerformanceTab({ data }: PerformanceTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <H3 className="mb-1">Performance Metrics</H3>
        <P className="text-sm text-muted-foreground">
          Time taken and memory usage metrics with distribution analysis
        </P>
      </div>
      <PerformanceMetricsCards data={data} />
      <PerformanceOverTimeChart data={data} />
      <PerformanceDistributionChart data={data} />
    </div>
  );
}
