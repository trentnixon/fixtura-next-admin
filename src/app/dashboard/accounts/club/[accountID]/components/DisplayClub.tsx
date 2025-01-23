"use client";

import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import AccountBasics from "../../../components/overview/AccountBasics";

import AccountTitle from "../../../components/ui/AccountTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
export default function DisplayClub({ accountId }: { accountId: string }) {
  const { data, isLoading, isError, error, refetch } =
    useAccountQuery(accountId);

  if (isLoading) return <P>Loading account details...</P>;

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
      <div className="p-2">
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
                  accountId={Number(accountId)}
                />
              </TabsContent>
              <TabsContent value="renders">tab 2</TabsContent>
              <TabsContent value="competitions">tab3</TabsContent>
              <TabsContent value="grades">tab4</TabsContent>
              <TabsContent value="fixtures">tab5</TabsContent>
              <TabsContent value="data">tab6</TabsContent>
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
                  tickFormatter={value => value.slice(0, 3)}
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
