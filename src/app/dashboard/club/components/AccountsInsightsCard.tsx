"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountsInsights } from "@/types/clubInsights";
import { Badge } from "@/components/ui/badge";

/**
 * AccountsInsightsCard Component
 *
 * Displays account statistics and coverage across clubs:
 * - Total accounts
 * - Active accounts (may be null)
 * - Clubs with accounts
 * - Clubs with trials
 * - Clubs with active trials
 */
interface AccountsInsightsCardProps {
  data: AccountsInsights;
}

export default function AccountsInsightsCard({
  data,
}: AccountsInsightsCardProps) {
  return (
    <Card className="bg-white border shadow-none">
      <CardHeader className="p-4">
        <CardTitle>Accounts Insights</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {/* Summary Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
            label="Clubs with Accounts"
            value={data.clubsWithAccounts.toLocaleString()}
          />
        </div>

        {/* Trial Statistics */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-4">Trial Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Stat
              label="Clubs with Trials"
              value={data.clubsWithTrials.toLocaleString()}
            />
            <Stat
              label="Clubs with Active Trials"
              value={data.clubsWithActiveTrials.toLocaleString()}
            />
          </div>
        </div>

        {/* Account Coverage Summary */}
        <div className="flex items-center gap-2 text-sm pt-2">
          <span className="text-muted-foreground">Account Coverage:</span>
          <Badge variant="primary">
            {data.clubsWithAccounts} Clubs with Accounts
          </Badge>
          {data.clubsWithTrials > 0 && (
            <Badge variant="outline">
              {data.clubsWithTrials} Clubs with Trials
            </Badge>
          )}
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
