"use client";

import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import AccountTitle from "../../../components/ui/AccountTitle";
import AccountBasics from "../../../components/overview/AccountBasics";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RendersTab from "../../../components/overview/tabs/renders";
import CompetitionsTab from "../../../components/overview/tabs/competitions";
import DataTab from "../../../components/overview/tabs/Data";
import { useParams } from "next/navigation";
import AccountAnalyticsCards from "../../../components/overview/tabs/components/AccountAnalyticsCards";

// Loading component
const LoadingState = () => <p>Loading account details...</p>;

// Error component
const ErrorState = ({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) => (
  <div>
    <p>Error loading account: {error?.message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Retry
    </button>
  </div>
);

// Tab labels configuration
const TAB_LABELS = [
  { id: "account", label: "Account" },
  { id: "renders", label: "Renders" },
  { id: "data", label: "Data" },
  { id: "competitions", label: "Competitions" },
  { id: "grades", label: "Grades" },
  { id: "fixtures", label: "Fixtures" },
] as const;

// Render tab content based on id
const renderTabContent = (
  tabId: string,
  accountData: fixturaContentHubAccountDetails,
  accountID: string
) => {
  const accountId = Number(accountID);

  switch (tabId) {
    case "account":
      return <AccountAnalyticsCards accountId={accountId} />;
    case "renders":
      return <RendersTab accountData={accountData} accountId={accountId} />;
    case "competitions":
      return <CompetitionsTab />;
    case "grades":
      return <div>Coming soon: Grades</div>;
    case "fixtures":
      return <div>Coming soon: Fixtures</div>;
    case "data":
      return <DataTab accountData={accountData} accountId={accountId} />;
    default:
      return null;
  }
};

export default function DisplayAssociation() {
  const { accountID } = useParams();
  const { data, isLoading, isError, error, refetch } = useAccountQuery(
    accountID as string
  );

  if (isLoading) return <LoadingState />;

  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  const accountData = data?.data;

  console.log(accountData);

  return (
    <>
      {accountData && <AccountTitle titleProps={accountData} />}
      <div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                {TAB_LABELS.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {TAB_LABELS.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  {renderTabContent(
                    tab.id,
                    accountData as fixturaContentHubAccountDetails,
                    accountID as string
                  )}
                </TabsContent>
              ))}
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
