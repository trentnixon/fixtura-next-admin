"use client";

import { Badge } from "@/components/ui/badge";
import { AccountsInsights } from "@/types/clubInsights";

interface AccountsInsightsCardProps {
  data: AccountsInsights;
  /** Hide club linkage counts (shown in Coverage rollup). */
  omitClubLinkage?: boolean;
}

export default function AccountsInsightsCard({
  data,
  omitClubLinkage = false,
}: AccountsInsightsCardProps) {
  return (
    <div className="space-y-4">
      <div
        className={
          omitClubLinkage
            ? "grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2"
            : "grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-3"
        }
      >
        <Stat
          label="Total accounts"
          value={data.totalAccounts.toLocaleString()}
        />
        <Stat
          label="Active accounts"
          value={
            data.activeAccounts !== null
              ? data.activeAccounts.toLocaleString()
              : "N/A"
          }
        />
        {!omitClubLinkage && (
          <Stat
            label="Linked clubs"
            value={data.clubsWithAccounts.toLocaleString()}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Trials on clubs:</span>
        <Badge variant="outline" className="text-xs">
          {data.clubsWithTrials.toLocaleString()} with trials
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {data.clubsWithActiveTrials.toLocaleString()} active trials
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
