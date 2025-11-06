"use client";

import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
import { AccountTable } from "@/components/modules/tables/AccountTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountStats from "@/app/dashboard/accounts/components/AccountStats";
import AssociationEmails from "./associationEmails";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

export default function DisplayAssociationsTable() {
  const { data, isLoading, isError, error, refetch } = useAccountsQuery();

  if (isLoading) {
    return <LoadingState variant="default" />;
  }

  if (isError) {
    return (
      <ErrorState
        error={
          error instanceof Error
            ? error
            : new Error("Failed to load associations")
        }
        onRetry={refetch}
        variant="default"
      />
    );
  }

  const { active: activeAssociations, inactive: inactiveAssociations } =
    data!.associations;
  const allAssociations = [...activeAssociations, ...inactiveAssociations];

  return (
    <>
      {/* Active Accounts Table */}
      <Tabs defaultValue="active">
        <TabsList variant="secondary" className="mb-4">
          <TabsTrigger value="active">
            Active Subscriptions ({activeAssociations.length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive Subscriptions ({inactiveAssociations.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Associations Contact Information
          </TabsTrigger>
        </TabsList>

        <SectionContainer
          title="Association Accounts"
          description="View, manage, and search all association accounts"
        >
          <TabsContent value="active">
            <AccountTable
              accounts={activeAssociations}
              emptyMessage="No associations with active subscriptions available."
            />
          </TabsContent>
          <TabsContent value="inactive">
            <AccountTable
              accounts={inactiveAssociations}
              emptyMessage="No associations with inactive subscriptions available."
            />
          </TabsContent>
          <TabsContent value="all">
            <AssociationEmails />
          </TabsContent>
        </SectionContainer>
      </Tabs>

      {/* Stats Cards & Charts */}
      <SectionContainer
        title="Association Statistics"
        description="Overview of association accounts and subscription status"
      >
        <AccountStats accounts={allAssociations} />
      </SectionContainer>
    </>
  );
}
