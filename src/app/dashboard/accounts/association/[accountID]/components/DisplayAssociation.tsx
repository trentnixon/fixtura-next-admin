"use client";

import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import AccountTitle from "../../../components/ui/AccountTitle";
import AccountBasics from "../../../components/overview/AccountBasics";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "../../../components/overview/tabs/overview";
import RendersTab from "../../../components/overview/tabs/renders";
import CompetitionsTab from "../../../components/overview/tabs/competitions";
import { useParams } from "next/navigation";

export default function DisplayAssociation() {
  const { accountID } = useParams();
  const { data, isLoading, isError, error, refetch } = useAccountQuery(
    accountID as string
  );

  if (isLoading) return <p>Loading account details...</p>;

  if (isError) {
    return (
      <div>
        <p>Error loading account: {error?.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Retry
        </button>
      </div>
    );
  }

  const accountData = data?.data;

  console.log(accountData);

  return (
    <>
      {accountData && <AccountTitle titleProps={accountData} />}
      <div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="renders">Renders</TabsTrigger>
                <TabsTrigger value="competitions">Competitions</TabsTrigger>
                <TabsTrigger value="grades">Grades</TabsTrigger>
                <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <OverviewTab
                  accountData={accountData as fixturaContentHubAccountDetails}
                />
              </TabsContent>
              <TabsContent value="renders">
                <RendersTab
                  accountData={accountData as fixturaContentHubAccountDetails}
                  accountId={Number(accountID)}
                />
              </TabsContent>
              <TabsContent value="competitions">
                <CompetitionsTab />
              </TabsContent>
              <TabsContent value="grades">tab4</TabsContent>
              <TabsContent value="fixtures">tab5</TabsContent>
              <TabsContent value="data">tab6</TabsContent>
            </Tabs>
          </div>
          <div className="col-span-3 gap-4 space-y-4">
            <AccountBasics
              account={accountData as fixturaContentHubAccountDetails}
            />
          </div>
        </div>
      </div>
    </>
  );
}
