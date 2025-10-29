"use client";

import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import AccountBasics from "../../../components/overview/AccountBasics";

import AccountTitle from "../../../components/ui/AccountTitle";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { P } from "@/components/type/type";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import OverviewTab from "../../../components/overview/tabs/overview";
import RendersTab from "../../../components/overview/tabs/renders";
import CompetitionsTab from "../../../components/overview/tabs/competitions";
import { useParams } from "next/navigation";
import AccountAnalyticsCards from "../../../components/overview/tabs/components/AccountAnalyticsCards";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

// Loading component
const LoadingState = () => <P>Loading account details...</P>;

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
  { id: "overview", label: "Overview" },
  { id: "account", label: "Account" },
  { id: "renders", label: "Renders" },
  { id: "competitions", label: "Competitions" },
  { id: "grades", label: "Grades" },
  { id: "fixtures", label: "Fixtures" },
  { id: "data", label: "Data" },
] as const;

// Render tab content based on id
const renderTabContent = (
  tabId: string,
  accountData: fixturaContentHubAccountDetails,
  accountID: string
) => {
  const accountId = Number(accountID);

  switch (tabId) {
    case "overview":
      return <OverviewTab accountData={accountData} />;
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
      return <div>Coming soon: Data</div>;
    default:
      return null;
  }
};

export default function DisplayClub() {
  const { accountID } = useParams();
  const { data, isLoading, isError, error, refetch } = useAccountQuery(
    accountID as string
  );

  if (isLoading) return <LoadingState />;

  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  const accountData = data?.data;

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  return (
    <>
      {accountData && <AccountTitle titleProps={accountData} />}
      <div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            <Tabs defaultValue="overview" className="w-full">
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
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </>
  );
}
