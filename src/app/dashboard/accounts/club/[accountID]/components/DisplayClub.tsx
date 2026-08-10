"use client";

import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import AccountOverviewPanel from "../../../components/overview/AccountOverviewPanel";
import AccountTitle from "../../../components/ui/AccountTitle";
import AccountsBreadcrumbHeader from "../../../components/AccountsBreadcrumbHeader";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";

import RendersTab from "../../../components/overview/tabs/renders";
import CompetitionsTab from "../../../components/overview/tabs/competitions";
import DataTab from "../../../components/overview/tabs/Data";
import { useParams } from "next/navigation";
import AccountAnalyticsCards from "../../../components/overview/tabs/components/AccountAnalyticsCards";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";

// Tab labels configuration
const TAB_LABELS = [
  { id: "financial", label: "Financial" },
  { id: "renders", label: "Renders" },
  { id: "data", label: "Data refresh" },
  { id: "competitions", label: "Competitions" },
  { id: "grades", label: "Grades" },
  { id: "fixtures", label: "Fixtures" },
] as const;

// Render tab content based on id
const renderTabContent = (
  tabId: string,
  accountData: fixturaContentHubAccountDetails,
  accountID: string,
) => {
  const accountId = Number(accountID);

  switch (tabId) {
    case "financial":
      return <AccountAnalyticsCards accountId={accountId} />;
    case "renders":
      return <RendersTab accountData={accountData} accountId={accountId} />;
    case "competitions":
      return <CompetitionsTab />;
    case "grades":
      return (
        <SectionContainer title="Grades" variant="compact">
          <p className="text-sm text-muted-foreground">Coming soon: Grades</p>
        </SectionContainer>
      );
    case "fixtures":
      return (
        <SectionContainer title="Fixtures" variant="compact">
          <p className="text-sm text-muted-foreground">Coming soon: Fixtures</p>
        </SectionContainer>
      );
    case "data":
      return <DataTab accountId={accountId} />;
    default:
      return null;
  }
};

export default function DisplayClub() {
  const { accountID } = useParams();
  const { data, isLoading, isError, error, refetch } = useAccountQuery(
    accountID as string,
  );

  if (isLoading) {
    return (
      <LoadingState variant="default" message="Loading account details…" />
    );
  }

  if (isError) {
    return (
      <ErrorState
        error={
          error instanceof Error ? error : new Error("Failed to load club account")
        }
        title="Could not load account"
        onRetry={refetch}
        variant="default"
      />
    );
  }

  const accountData = data?.data;

  if (!accountData) {
    return null;
  }

  const accountName =
    accountData.accountOrganisationDetails?.Name ?? "Club account";

  return (
    <>
      {accountData.accountOrganisationDetails && (
        <AccountTitle titleProps={accountData} />
      )}
      <PageContainer padding="xs" spacing="lg">
        <AccountsBreadcrumbHeader
          currentPage={accountName}
          parent={{
            label: "Club accounts",
            href: "/dashboard/accounts/club",
          }}
        />
        <AccountOverviewPanel
          accountData={accountData}
          accountType="club"
          syncAccountType="CLUB"
        />
        <Tabs defaultValue="financial" className="w-full">
          <TabsList
            variant="primary"
            className="mb-4 h-auto flex-wrap justify-start gap-1 rounded-md"
          >
            {TAB_LABELS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TAB_LABELS.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              {renderTabContent(
                tab.id,
                accountData as fixturaContentHubAccountDetails,
                accountID as string,
              )}
            </TabsContent>
          ))}
        </Tabs>
      </PageContainer>
    </>
  );
}
