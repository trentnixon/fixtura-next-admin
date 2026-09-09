"use client";

import { Building2, Users } from "lucide-react";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import AccountOverview from "./AccountOverview";
import AccountSummaryCharts from "./AccountSummaryCharts";

/**
 * Accounts hub — directory header plus grouped record panels by content type.
 */
export default function AccountsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-blue-50 p-1.5 text-blue-700">
              <Users className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">
              Account directory
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Fleet-wide account mix, trials, and engagement signals
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DashboardLinkButton
            href="/dashboard/accounts/association"
            icon={Building2}
          >
            Associations
          </DashboardLinkButton>
          <DashboardLinkButton href="/dashboard/accounts/club" icon={Users}>
            Clubs
          </DashboardLinkButton>
        </div>
      </div>

      <AccountOverview />

      <OverviewRecordPanel
        title="Analytics"
        description="Account mix, sports coverage, and engagement trends"
        action={
          <DashboardLinkButton href="/dashboard/accounts/association" trailingIcon="arrow">
            Open associations
          </DashboardLinkButton>
        }
      >
        <AccountSummaryCharts />
      </OverviewRecordPanel>
    </div>
  );
}
