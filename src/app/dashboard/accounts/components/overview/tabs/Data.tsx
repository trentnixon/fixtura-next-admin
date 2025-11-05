"use client";

import { useParams } from "next/navigation";
import { P } from "@/components/type/type";
import { H3, H4 } from "@/components/type/titles";
import { useAccountDataCollectionQuery } from "@/hooks/accounts/useAccountDataCollectionQuery";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="space-y-4">
      {/* Collections Table */}
      {dataCollectionData && (
        <CollectionsTable
          data={dataCollectionData}
          accountId={accountIdNumber}
          accountType={accountType}
        />
      )}

      {/* Data Collection Statistics */}
      <div>
        <H3 className="mb-1">Data Collection Statistics</H3>
        <P className="text-sm text-muted-foreground mb-4">
          Comprehensive account-specific data collection insights and
          statistics.
        </P>
      </div>

      {isDataCollectionLoading && (
        <div className="bg-slate-50 rounded-lg p-6 border shadow-none">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <P>Loading data collection statistics...</P>
          </div>
        </div>
      )}

      {isDataCollectionError && (
        <div className="rounded-lg p-4 bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <H4 className="text-sm mb-1">Error Loading Data</H4>
              <P className="text-sm">
                {dataCollectionError?.message ||
                  "Failed to load data collection statistics"}
              </P>
            </div>
          </div>
        </div>
      )}

      {dataCollectionData && (
        <Tabs defaultValue="overview" className="w-full ">
          <TabsList className="grid w-full grid-cols-8 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="entities">Data Collection</TabsTrigger>
            <TabsTrigger value="stages">Stage Analysis</TabsTrigger>
            <TabsTrigger value="temporal">Temporal Analysis</TabsTrigger>
            <TabsTrigger value="errors">Error Analysis</TabsTrigger>
          </TabsList>
          <div className="">
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
          </div>
        </Tabs>
      )}

      {!isDataCollectionLoading &&
        !isDataCollectionError &&
        !dataCollectionData && (
          <P className="text-sm text-muted-foreground">
            No data collection statistics available.
          </P>
        )}
    </div>
  );
}
