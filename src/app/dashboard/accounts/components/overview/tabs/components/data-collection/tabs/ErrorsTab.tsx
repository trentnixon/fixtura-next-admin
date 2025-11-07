"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import ErrorAnalysisCard from "../errors/ErrorAnalysisCard";
import ErrorsOverTimeChart from "../charts/ErrorsOverTimeChart";
import ErrorRateByEntityChart from "../errors/ErrorRateByEntityChart";

interface ErrorsTabProps {
  data: AccountStatsResponse;
}

export default function ErrorsTab({ data }: ErrorsTabProps) {
  return (
    <div className="space-y-6">
      <ErrorAnalysisCard data={data} />
      <ErrorsOverTimeChart data={data} />
      <ErrorRateByEntityChart data={data} />
    </div>
  );
}
