"use client";

import { TeamsInsights } from "@/types/clubInsights";

interface TeamsInsightsCardProps {
  data: TeamsInsights;
}

export default function TeamsInsightsCard({ data }: TeamsInsightsCardProps) {
  return (
    <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2">
      <Stat label="Total Teams" value={data.totalTeams.toLocaleString()} />
      <Stat
        label="Avg Teams / Club"
        value={data.averageTeamsPerClub.toFixed(2)}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-200 px-4 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
