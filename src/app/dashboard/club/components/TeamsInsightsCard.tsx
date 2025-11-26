"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamsInsights } from "@/types/clubInsights";

/**
 * TeamsInsightsCard Component
 *
 * Displays team statistics across all clubs:
 * - Total teams across all clubs
 * - Average teams per club
 */
interface TeamsInsightsCardProps {
  data: TeamsInsights;
}

export default function TeamsInsightsCard({ data }: TeamsInsightsCardProps) {
  return (
    <Card className="bg-white border shadow-none">
      <CardHeader className="p-4">
        <CardTitle>Teams Insights</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Stat label="Total Teams" value={data.totalTeams.toLocaleString()} />
          <Stat
            label="Average Teams per Club"
            value={data.averageTeamsPerClub.toFixed(2)}
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
