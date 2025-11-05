"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import { P } from "@/components/type/type";
import { H3 } from "@/components/type/titles";
import TemporalAnalysisCard from "../temporal/TemporalAnalysisCard";
import CollectionsOverTimeChart from "../charts/CollectionsOverTimeChart";

interface TemporalTabProps {
  data: AccountStatsResponse;
}

export default function TemporalTab({ data }: TemporalTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <H3 className="mb-1">Temporal Analysis</H3>
        <P className="text-sm text-muted-foreground">
          Collection frequency, timing patterns, and historical trends
        </P>
      </div>
      <TemporalAnalysisCard data={data} />
      <CollectionsOverTimeChart data={data} />
    </div>
  );
}
