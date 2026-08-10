"use client";

import { Badge } from "@/components/ui/badge";
import { ClubOverview } from "@/types/clubInsights";

interface OverviewStatsCardProps {
  data: ClubOverview;
}

export default function OverviewStatsCard({ data }: OverviewStatsCardProps) {
  return (
    <div className="space-y-4">
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Clubs" value={data.totalClubs.toLocaleString()} />
        <Stat label="Active Clubs" value={data.activeClubs.toLocaleString()} />
        <Stat
          label="With Accounts"
          value={data.clubsWithAccounts.toLocaleString()}
        />
        <Stat
          label="Without Accounts"
          value={data.clubsWithoutAccounts.toLocaleString()}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Status:</span>
        <Badge variant="default" className="text-xs">
          {data.activeClubs.toLocaleString()} Active
        </Badge>
        {data.inactiveClubs > 0 && (
          <Badge variant="secondary" className="text-xs">
            {data.inactiveClubs.toLocaleString()} Inactive
          </Badge>
        )}
        <span className="ml-2 text-muted-foreground">Coverage:</span>
        <Badge variant="primary" className="text-xs">
          {data.clubsWithAccounts.toLocaleString()} Linked
        </Badge>
        <Badge variant="outline" className="text-xs">
          {data.clubsWithoutAccounts.toLocaleString()} Missing
        </Badge>
      </div>

      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-3">
        <Stat label="Sport" value={data.sport} />
        <Stat
          label="Associations"
          value={data.associationsCount.toLocaleString()}
        />
        <Stat
          label="Avg Teams / Club"
          value={data.averageTeamsPerClub.toFixed(2)}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-200 px-4 py-3 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
