"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { FleetAttentionSection } from "@/app/dashboard/components/fleet/FleetAttentionSection";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import AccountOverview from "./AccountOverview";
import AccountSummaryCharts from "./AccountSummaryCharts";
import { AccountsOperationsTabBadge } from "./AccountsOperationsTabBadge";

const ACCOUNT_HUB_TABS = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "operations", label: "Operations", icon: AlertTriangle },
  { value: "analytics", label: "Analytics", icon: BarChart3 },
] as const;

type AccountsHubTab = (typeof ACCOUNT_HUB_TABS)[number]["value"];

function parseAccountsHubTab(value: string | null): AccountsHubTab {
  if (value === "operations" || value === "analytics") return value;
  return "overview";
}

/**
 * Accounts hub — tabbed layout by category (overview, operations, analytics).
 */
export default function AccountsDashboard() {
  const searchParams = useSearchParams();
  const defaultTab = useMemo(
    () => parseAccountsHubTab(searchParams.get("tab")),
    [searchParams]
  );

  return (
    <div className="space-y-4">
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
            Fleet snapshot, operations alerts, and analytics — pick a tab below
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

      <Tabs key={defaultTab} defaultValue={defaultTab} className="space-y-4">
        <TabsList variant="primary" className={cn(sectionTabListClass, "w-full justify-start")}>
          {ACCOUNT_HUB_TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              variant="section"
              className={sectionTabTriggerClass}
            >
              <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
              {label}
              {value === "operations" ? <AccountsOperationsTabBadge /> : null}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-6">
          <AccountOverview sections={["browse", "snapshot"]} />
        </TabsContent>

        <TabsContent value="operations" className="mt-0 space-y-6">
          <FleetAttentionSection showSyncOperatorActions />
        </TabsContent>

        <TabsContent value="analytics" className="mt-0 space-y-6">
          <OverviewRecordPanel
            title="Charts"
            description="Account mix, sports coverage, and engagement trends"
            action={
              <DashboardLinkButton
                href="/dashboard/accounts/association"
                trailingIcon="arrow"
              >
                Open associations
              </DashboardLinkButton>
            }
          >
            <AccountSummaryCharts />
          </OverviewRecordPanel>

          <AccountOverview sections={["signups"]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
