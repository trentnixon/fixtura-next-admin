"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import SummaryCards from "../summary/SummaryCards";
import AccountHealthCard from "../health/AccountHealthCard";
import ItemsProcessedOverTimeChart from "../charts/ItemsProcessedOverTimeChart";
import CompletionRateOverTimeChart from "../charts/CompletionRateOverTimeChart";
import EntityStatsOverTimeChart from "../charts/EntityStatsOverTimeChart";

interface OverviewTabProps {
  data: AccountStatsResponse;
}

export default function OverviewTab({ data }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <SummaryCards data={data} />
      <AccountHealthCard data={data} />
      <ItemsProcessedOverTimeChart data={data} />
      <CompletionRateOverTimeChart data={data} />
      <EntityStatsOverTimeChart data={data} />
    </div>
  );
}
