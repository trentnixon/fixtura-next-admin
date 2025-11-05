"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import { P } from "@/components/type/type";
import { H3 } from "@/components/type/titles";
import ErrorAnalysisCard from "../errors/ErrorAnalysisCard";
import ErrorsOverTimeChart from "../charts/ErrorsOverTimeChart";
import ErrorRateByEntityChart from "../errors/ErrorRateByEntityChart";

interface ErrorsTabProps {
  data: AccountStatsResponse;
}

export default function ErrorsTab({ data }: ErrorsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <H3 className="mb-1">Error Analysis</H3>
        <P className="text-sm text-muted-foreground">
          Error rates, patterns, and entity-specific error breakdowns
        </P>
      </div>
      <ErrorAnalysisCard data={data} />
      <ErrorsOverTimeChart data={data} />
      <ErrorRateByEntityChart data={data} />
    </div>
  );
}
