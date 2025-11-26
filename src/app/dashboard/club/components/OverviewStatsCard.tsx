"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClubOverview } from "@/types/clubInsights";
import { Badge } from "@/components/ui/badge";

/**
 * OverviewStatsCard Component
 *
 * Displays overview analytics for clubs:
 * - Total Clubs (with active/inactive breakdown)
 * - Clubs with/without Accounts
 * - Association count
 * - Average teams and competitions per club
 */
interface OverviewStatsCardProps {
  data: ClubOverview;
}

export default function OverviewStatsCard({ data }: OverviewStatsCardProps) {
  return (
    <Card className="bg-white border shadow-none">
      <CardHeader className="p-4">
        <CardTitle>Overview Statistics</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {/* Summary Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Total Clubs" value={data.totalClubs.toLocaleString()} />
          <Stat
            label="Active Clubs"
            value={data.activeClubs.toLocaleString()}
          />
          <Stat
            label="With Accounts"
            value={data.clubsWithAccounts.toLocaleString()}
          />
          <Stat
            label="Without Accounts"
            value={data.clubsWithoutAccounts.toLocaleString()}
          />
        </div>

        {/* Active/Inactive Breakdown */}
        {data.inactiveClubs > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Status Breakdown:</span>
            <Badge variant="default">{data.activeClubs} Active</Badge>
            <Badge variant="secondary">{data.inactiveClubs} Inactive</Badge>
          </div>
        )}

        {/* Account Coverage Breakdown */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Account Coverage:</span>
          <Badge variant="primary">
            {data.clubsWithAccounts} With Accounts
          </Badge>
          <Badge variant="outline">
            {data.clubsWithoutAccounts} Without Accounts
          </Badge>
        </div>

        {/* Additional Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <Stat label="Sport" value={data.sport} />
          <Stat
            label="Associations Count"
            value={data.associationsCount.toLocaleString()}
          />
          <Stat
            label="Average Teams per Club"
            value={data.averageTeamsPerClub.toFixed(2)}
          />
        </div>

        {/* Average Competitions */}
        <div className="pt-2">
          <Stat
            label="Average Competitions per Club"
            value={data.averageCompetitionsPerClub.toFixed(3)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
