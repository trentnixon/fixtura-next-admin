"use client";

import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
import { AccountTable } from "@/components/modules/tables/AccountTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountStats from "@/app/dashboard/accounts/components/AccountStats";
import ClubEmails from "./clubEmails";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import {
  AlertTriangle,
  CheckCircle2,
  LayoutDashboard,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CLUB_TABS = [
  { value: "snapshot", label: "Club Snapshot", icon: LayoutDashboard },
  { value: "active", label: "Active", icon: CheckCircle2 },
  { value: "inactive", label: "Inactive", icon: AlertTriangle },
  { value: "emails", label: "Contacts", icon: Mail },
] as const;

export default function DisplayClubsTable() {
  const { data, isLoading, isError, error, refetch } = useAccountsQuery();

  if (isLoading) {
    return <LoadingState variant="default" />;
  }

  if (isError) {
    return (
      <ErrorState
        error={
          error instanceof Error ? error : new Error("Failed to load clubs")
        }
        onRetry={refetch}
        variant="default"
      />
    );
  }

  const { active: activeClubs, inactive: inactiveClubs } = data!.clubs;
  const allClubs = [...activeClubs, ...inactiveClubs];

  return (
    <Tabs defaultValue="snapshot" className="space-y-4">
      <TabsList variant="primary" className={cn(sectionTabListClass, "mb-4")}>
        {CLUB_TABS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            variant="section"
            className={sectionTabTriggerClass}
          >
            <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
            {value === "active"
              ? `${label} (${activeClubs.length})`
              : value === "inactive"
                ? `${label} (${inactiveClubs.length})`
                : label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="snapshot">
        <SectionContainer
          title="Club Snapshot"
          description="Subscription coverage, setup status, and account mix"
          variant="compact"
        >
          <AccountStats accounts={allClubs} />
        </SectionContainer>
      </TabsContent>

      <TabsContent value="active">
        <SectionContainer
          title="Active Club Accounts"
          description="Club accounts with current subscriptions"
          variant="compact"
        >
          <AccountTable
            accounts={activeClubs}
            emptyMessage="No clubs with active subscriptions available."
            showFleetOpsColumn
          />
        </SectionContainer>
      </TabsContent>

      <TabsContent value="inactive">
        <SectionContainer
          title="Inactive Club Accounts"
          description="Club accounts without an active subscription"
          variant="compact"
        >
          <AccountTable
            accounts={inactiveClubs}
            emptyMessage="No clubs with inactive subscriptions available."
            showFleetOpsColumn
          />
        </SectionContainer>
      </TabsContent>

      <TabsContent value="emails">
        <ClubEmails initialFilter="active" hideAllFilter />
      </TabsContent>
    </Tabs>
  );
}
