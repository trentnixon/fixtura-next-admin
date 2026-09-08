"use client";

import { useSearchParams } from "next/navigation";
import LiveOverview from "./LiveOverview";
import DashboardFinancials from "./DashboardFinancials";
import DashboardAssetCreation from "./DashboardAssetCreation";
import DashboardDataCollection from "./DashboardDataCollection";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sectionTabListClass, sectionTabTriggerClass } from "@/lib/actions/siteNavigationButtonStyles";
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
 * Dashboard operations tab shell — `navigation.tabs.section-default`.
 * TabsList primary + sectionTabListClass · TabsTrigger section + sectionTabTriggerClass.
 */
export default function DashboardTabs() {
  const searchParams = useSearchParams();
  const initialTab = resolveInitialTab(searchParams.get("tab"));

  return (
    <PageContainer padding="xs" spacing="md">
      <Tabs defaultValue={initialTab} className="w-full">
        <div className="pb-8">
          <TabsList variant="primary" className={sectionTabListClass}>
            {tabs.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                variant="section"
                className={sectionTabTriggerClass}
              >
                <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

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
