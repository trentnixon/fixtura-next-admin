"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import TemporalAnalysisCard from "../temporal/TemporalAnalysisCard";
import CollectionsOverTimeChart from "../charts/CollectionsOverTimeChart";

interface TemporalTabProps {
  data: AccountStatsResponse;
}

export default function TemporalTab({ data }: TemporalTabProps) {
  return (
    <div className="space-y-6">
      <TemporalAnalysisCard data={data} />
      <CollectionsOverTimeChart data={data} />
    </div>
  );
}
