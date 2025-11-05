"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import { P } from "@/components/type/type";
import { H3 } from "@/components/type/titles";
import StageAnalysisCard from "../stages/StageAnalysisCard";
import StageDistributionChart from "../stages/StageDistributionChart";

interface StagesTabProps {
  data: AccountStatsResponse;
}

export default function StagesTab({ data }: StagesTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <H3 className="mb-1">Stage Analysis</H3>
        <P className="text-sm text-muted-foreground">
          Collection stage completion and distribution patterns
        </P>
      </div>
      <StageAnalysisCard data={data} />
      <StageDistributionChart data={data} />
    </div>
  );
}
