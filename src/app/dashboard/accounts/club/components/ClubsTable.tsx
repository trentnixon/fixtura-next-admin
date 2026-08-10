"use client";

import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
import { AccountTable } from "@/components/modules/tables/AccountTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountStats from "@/app/dashboard/accounts/components/AccountStats";
import ClubEmails from "./clubEmails";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

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
      <TabsList
        variant="secondary"
        className="h-auto flex-wrap justify-start gap-1 rounded-md"
      >
        <TabsTrigger value="snapshot">Club Snapshot</TabsTrigger>
        <TabsTrigger value="active">
          Active Subscriptions ({activeClubs.length})
        </TabsTrigger>
        <TabsTrigger value="inactive">
          Inactive Subscriptions ({inactiveClubs.length})
        </TabsTrigger>
        <TabsTrigger value="emails">Contacts</TabsTrigger>
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
          />
        </SectionContainer>
      </TabsContent>

      <TabsContent value="emails">
        <SectionContainer
          title="Club Contacts"
          description="Search, review, and export club contact details"
          variant="compact"
        >
          <ClubEmails initialFilter="active" hideAllFilter />
        </SectionContainer>
      </TabsContent>
    </Tabs>
  );
}
