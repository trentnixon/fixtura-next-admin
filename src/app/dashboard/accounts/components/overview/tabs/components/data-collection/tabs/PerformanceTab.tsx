"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import PerformanceMetricsCards from "../performance/PerformanceMetricsCards";
import PerformanceOverTimeChart from "../performance/PerformanceOverTimeChart";
import PerformanceDistributionChart from "../performance/PerformanceDistributionChart";

interface PerformanceTabProps {
  data: AccountStatsResponse;
}

export default function PerformanceTab({ data }: PerformanceTabProps) {
  return (
    <div className="space-y-6">
      <PerformanceMetricsCards data={data} />
      <PerformanceOverTimeChart data={data} />
      <PerformanceDistributionChart data={data} />
    </div>
  );
}
