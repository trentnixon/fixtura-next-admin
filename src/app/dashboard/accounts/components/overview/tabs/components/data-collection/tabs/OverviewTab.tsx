"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import { P } from "@/components/type/type";
import { H3 } from "@/components/type/titles";
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
      <div>
        <H3 className="mb-1">Overview</H3>
        <P className="text-sm text-muted-foreground">
          Account health and key summary metrics
        </P>
      </div>
      <SummaryCards data={data} />
      <AccountHealthCard data={data} />
      <div>
        <H3 className="mb-1">Time Series Analysis</H3>
        <P className="text-sm text-muted-foreground">
          Trends and patterns over time for various metrics
        </P>
      </div>
      <ItemsProcessedOverTimeChart data={data} />
      <CompletionRateOverTimeChart data={data} />
      <EntityStatsOverTimeChart data={data} />
    </div>
  );
}
