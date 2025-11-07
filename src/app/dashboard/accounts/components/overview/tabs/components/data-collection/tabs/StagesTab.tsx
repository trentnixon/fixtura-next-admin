"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import StageAnalysisCard from "../stages/StageAnalysisCard";
import StageDistributionChart from "../stages/StageDistributionChart";

interface StagesTabProps {
  data: AccountStatsResponse;
}

export default function StagesTab({ data }: StagesTabProps) {
  return (
    <div className="space-y-6">
      <StageAnalysisCard data={data} />
      <StageDistributionChart data={data} />
    </div>
  );
}
