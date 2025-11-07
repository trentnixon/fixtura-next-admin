"use client";

import { useParams } from "next/navigation";
import { useAccountDataCollectionQuery } from "@/hooks/accounts/useAccountDataCollectionQuery";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui-library";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import OverviewTab from "./components/data-collection/tabs/OverviewTab";
import PerformanceTab from "./components/data-collection/tabs/PerformanceTab";
import ErrorsTab from "./components/data-collection/tabs/ErrorsTab";
import EntitiesTab from "./components/data-collection/tabs/EntitiesTab";
import StagesTab from "./components/data-collection/tabs/StagesTab";
import TemporalTab from "./components/data-collection/tabs/TemporalTab";
import CollectionsTable from "./components/data-collection/collections/CollectionsTable";

interface DataTabProps {
  accountData: fixturaContentHubAccountDetails;
  accountId?: number;
}

export default function DataTab({ accountData, accountId }: DataTabProps) {
  const params = useParams();

  // Extract accountId from props or params
  const accountIdNumber = accountId || Number(params.accountID);

  // Determine accountType from account data (account_type === 1 is "CLUB", otherwise "ASSOCIATION")
  const accountType: "CLUB" | "ASSOCIATION" =
    accountData.account_type === 1 ? "CLUB" : "ASSOCIATION";

  // Use the data collection query hook
  const {
    data: dataCollectionData,
    isLoading: isDataCollectionLoading,
    isError: isDataCollectionError,
    error: dataCollectionError,
  } = useAccountDataCollectionQuery(accountIdNumber.toString());

  return (
    <div className="space-y-6">
      {/* Collections Table */}
      {dataCollectionData && (
        <CollectionsTable
          data={dataCollectionData}
          accountId={accountIdNumber}
          accountType={accountType}
        />
      )}

      {/* Data Collection Statistics */}
      <SectionContainer
        title="Data Collection Statistics"
        description="Comprehensive account-specific data collection insights and statistics"
        variant="compact"
      >
        {isDataCollectionLoading && (
          <LoadingState
            variant="skeleton"
            message="Loading data collection statistics..."
          >
            <div className="space-y-4">
              <div className="h-32 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-64 w-full bg-slate-200 rounded animate-pulse" />
            </div>
          </LoadingState>
        )}

        {isDataCollectionError && (
          <ErrorState
            error={dataCollectionError}
            title="Error Loading Data"
            description="Failed to load data collection statistics"
            variant="card"
          />
        )}

        {dataCollectionData && (
          <ElementContainer padding="none" margin="none">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList variant="secondary" className="">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="entities">Entities</TabsTrigger>
                <TabsTrigger value="stages">Stages</TabsTrigger>
                <TabsTrigger value="temporal">Temporal</TabsTrigger>
                <TabsTrigger value="errors">Errors</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <OverviewTab data={dataCollectionData} />
              </TabsContent>

              {/* Performance Metrics Tab */}
              <TabsContent value="performance" className="mt-6">
                <PerformanceTab data={dataCollectionData} />
              </TabsContent>

              {/* Error Analysis Tab */}
              <TabsContent value="errors" className="mt-6">
                <ErrorsTab data={dataCollectionData} />
              </TabsContent>

              {/* Entity Statistics Tab */}
              <TabsContent value="entities" className="mt-6">
                <EntitiesTab data={dataCollectionData} />
              </TabsContent>

              {/* Stage Analysis Tab */}
              <TabsContent value="stages" className="mt-6">
                <StagesTab data={dataCollectionData} />
              </TabsContent>

              {/* Temporal Analysis Tab */}
              <TabsContent value="temporal" className="mt-6">
                <TemporalTab data={dataCollectionData} />
              </TabsContent>
            </Tabs>
          </ElementContainer>
        )}

        {!isDataCollectionLoading &&
          !isDataCollectionError &&
          !dataCollectionData && (
            <EmptyState
              title="No data collection statistics"
              description="No data collection statistics available for this account."
              variant="minimal"
            />
          )}
      </SectionContainer>
    </div>
  );
}
