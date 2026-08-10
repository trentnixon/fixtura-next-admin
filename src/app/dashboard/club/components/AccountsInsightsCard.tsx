"use client";

import { Badge } from "@/components/ui/badge";
import { AccountsInsights } from "@/types/clubInsights";

interface AccountsInsightsCardProps {
  data: AccountsInsights;
}

export default function AccountsInsightsCard({
  data,
}: AccountsInsightsCardProps) {
  return (
    <div className="space-y-4">
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-3">
        <Stat
          label="Total Accounts"
          value={data.totalAccounts.toLocaleString()}
        />
        <Stat
          label="Active Accounts"
          value={
            data.activeAccounts !== null
              ? data.activeAccounts.toLocaleString()
              : "N/A"
          }
        />
        <Stat
          label="Linked Clubs"
          value={data.clubsWithAccounts.toLocaleString()}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Trials:</span>
        <Badge variant="outline" className="text-xs">
          {data.clubsWithTrials.toLocaleString()} With trials
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {data.clubsWithActiveTrials.toLocaleString()} Active trials
        </Badge>
      </div>
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
