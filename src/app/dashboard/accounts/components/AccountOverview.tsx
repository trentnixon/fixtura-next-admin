"use client";

import { Building2, Users, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAccountSummaryQuery } from "@/hooks/accounts/useAccountSummaryQuery";
import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";

export default function AccountOverview() {
  const { data: accountSummary } = useAccountSummaryQuery();

  const useAccountSummary = accountSummary?.data;
  const ClubsBySport = useAccountSummary?.Totals.sportsPerAccountTypeCount.Club;
  const AssociationsBySport =
    useAccountSummary?.Totals.sportsPerAccountTypeCount.Association;

  return (
    <div className="space-y-6">
      {/* Main Stats - Associations and Clubs */}
      <MetricGrid columns={2} gap="lg">
        <StatCard
          title="Associations"
          value={useAccountSummary?.Totals.accountTypesCount.Association || 0}
          description={`${AssociationsBySport?.Cricket || 0} Cricket | ${
            AssociationsBySport?.AFL || 0
          } AFL | ${AssociationsBySport?.Netball || 0} Netball`}
          icon={<Building2 className="h-5 w-5" />}
          variant="primary"
          action={
            <Button variant="primary" asChild>
              <Link href="/dashboard/accounts/association">
                View Associations
              </Link>
            </Button>
          }
        />
        <StatCard
          title="Total Clubs"
          value={useAccountSummary?.Totals.accountTypesCount.Club || 0}
          description={`${ClubsBySport?.Cricket || 0} Cricket | ${
            ClubsBySport?.AFL || 0
          } AFL | ${ClubsBySport?.Netball || 0} Netball`}
          icon={<Users className="h-5 w-5" />}
          variant="secondary"
          action={
            <Button variant="primary" asChild>
              <Link href="/dashboard/accounts/club">View Clubs</Link>
            </Button>
          }
        />
      </MetricGrid>

      {/* Secondary Stats */}
      <MetricGrid columns={2} gap="lg">
        <StatCard
          title="Cricket Accounts"
          value={useAccountSummary?.Totals.sportsCount.Cricket || 0}
          description={`${
            useAccountSummary?.Totals.sportsCount.AFL || 0
          } AFL | ${
            useAccountSummary?.Totals.sportsCount.Netball || 0
          } Netball`}
          icon={<Trophy className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          title="Active Trial"
          value={useAccountSummary?.Totals.trialInstanceStatus.active || 0}
          description={`Expired ${
            useAccountSummary?.Totals.trialInstanceStatus.expired || 0
          }`}
          icon={<Clock className="h-5 w-5" />}
          variant="light"
        />
      </MetricGrid>
    </div>
  );
}
