"use client";

import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
import { AccountTable } from "@/components/modules/tables/AccountTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DisplayClubsTable() {
  const { data, isLoading, isError, error, refetch } = useAccountsQuery();

  console.log("[data]", data);
  if (isLoading) return <p>Loading accounts...</p>;

  if (isError) {
    return (
      <div className="p-6">
        <p>Error loading accounts: {error?.message}</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Retry
        </button>
      </div>
    );
  }

  const { active: activeClubs, inactive: inactiveClubs } = data!.clubs;

  return (
    <>
      {/* Active Accounts Table */}
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Active Clubs ({activeClubs.length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive Clubs ({inactiveClubs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <AccountTable
            title="Active Clubs"
            accounts={activeClubs}
            emptyMessage="No active clubs available."
          />
        </TabsContent>
        <TabsContent value="inactive">
          <AccountTable
            title="Inactive Clubs"
            accounts={inactiveClubs}
            emptyMessage="No inactive clubs available."
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
