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
    <>
      {/* Active Accounts Table */}
      <Tabs defaultValue="active">
        <TabsList variant="secondary" className="mb-4">
          <TabsTrigger value="active">
            Active Subscriptions ({activeClubs.length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive Subscriptions ({inactiveClubs.length})
          </TabsTrigger>
          <TabsTrigger value="emails">Contacts</TabsTrigger>
        </TabsList>

        <SectionContainer
          title="Club Accounts"
          description="View, manage, and search all club accounts"
        >
          <TabsContent value="active">
            <AccountTable
              accounts={activeClubs}
              emptyMessage="No clubs with active subscriptions available."
            />
          </TabsContent>
          <TabsContent value="inactive">
            <AccountTable
              accounts={inactiveClubs}
              emptyMessage="No clubs with inactive subscriptions available."
            />
          </TabsContent>
          <TabsContent value="emails">
            <ClubEmails />
          </TabsContent>
        </SectionContainer>
      </Tabs>

      {/* Stats Cards & Charts */}
      <SectionContainer
        title="Club Statistics"
        description="Overview of club accounts and subscription status"
      >
        <AccountStats accounts={allClubs} />
      </SectionContainer>
    </>
  );
}
