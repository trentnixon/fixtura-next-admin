"use client";

import { useSearchParams } from "next/navigation";
import LiveOverview from "./LiveOverview";
import DashboardFinancials from "./DashboardFinancials";
import DashboardAssetCreation from "./DashboardAssetCreation";
import DashboardDataCollection from "./DashboardDataCollection";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clapperboard, Database, DollarSign, LayoutDashboard } from "lucide-react";

const tabs = [
  {
    value: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    value: "financials",
    label: "Financials",
    icon: DollarSign,
  },
  {
    value: "renders",
    label: "Asset Creation",
    icon: Clapperboard,
  },
  {
    value: "collection",
    label: "Data Collection",
    icon: Database,
  },
] as const;

type DashboardTab = (typeof tabs)[number]["value"];

function resolveInitialTab(tabParam: string | null): DashboardTab {
  if (
    tabParam === "collection" ||
    tabParam === "renders" ||
    tabParam === "financials"
  ) {
    return tabParam;
  }
  return "overview";
}

/**
 * Dashboard — all operations content organised in one tab bar.
 */
export default function DashboardTabs() {
  const searchParams = useSearchParams();
  const initialTab = resolveInitialTab(searchParams.get("tab"));

  return (
    <PageContainer padding="xs" spacing="md">
      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList
          variant="primary"
          className="mb-6 flex h-auto flex-wrap justify-start gap-1"
        >
          {tabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="gap-1.5"
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <LiveOverview />
        </TabsContent>

        <TabsContent value="financials" className="mt-0">
          <DashboardFinancials />
        </TabsContent>

        <TabsContent value="renders" className="mt-0">
          <DashboardAssetCreation />
        </TabsContent>

        <TabsContent value="collection" className="mt-0">
          <DashboardDataCollection />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
