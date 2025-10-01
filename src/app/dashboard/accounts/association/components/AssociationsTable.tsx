"use client";

import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
import { AccountTable } from "@/components/modules/tables/AccountTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssociationEmails from "./associationEmails";
export default function DisplayAssociationsTable() {
  const { data, isLoading, isError, error, refetch } = useAccountsQuery();
  if (isLoading) return <p>Loading accounts...</p>;

  if (isError) {
    return (
      <div className="p-6">
        <p>Error loading accounts: {error?.message}</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const { active: activeAssociations, inactive: inactiveAssociations } =
    data!.associations;

  return (
    <>
      {/* Active Accounts Table */}
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Active Associations ({activeAssociations.length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive Associations ({inactiveAssociations.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Associations Contact Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <AccountTable
            title="Active Accounts"
            accounts={activeAssociations}
            emptyMessage="No active accounts available."
          />
        </TabsContent>
        <TabsContent value="inactive">
          <AccountTable
            title="Inactive Accounts"
            accounts={inactiveAssociations}
            emptyMessage="No inactive accounts available."
          />
        </TabsContent>
        <TabsContent value="all">
          <AssociationEmails />
        </TabsContent>
      </Tabs>
    </>
  );
}
