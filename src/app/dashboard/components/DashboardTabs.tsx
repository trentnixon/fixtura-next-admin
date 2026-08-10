"use client";

import LiveOverview from "./LiveOverview";
import { SchedulerRollupData } from "./SchedulerRollupData";
import GlobalDataRefreshDashboard from "./account-health/GlobalDataRefreshDashboard";
import { RenderActivitySection } from "./account-asset-run/RenderActivitySection";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clapperboard, Database, LayoutDashboard } from "lucide-react";

const tabs = [
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

/**
 * Dashboard section tabs — navigation.pattern.section-tabs
 */
export default function DashboardTabs() {
  return (
    <>
      <PageContainer padding="xs" spacing="md">
        <SectionContainer
          title="Operations overview"
          description="Today's render queue, account fleet, revenue, and recent scrape activity"
          variant="compact"
          icon={<LayoutDashboard className="h-5 w-5 text-brandPrimary-500" />}
        >
          <LiveOverview />
        </SectionContainer>
      </PageContainer>

      <Tabs defaultValue="renders" className="w-full">
        <div className="px-2 pb-1 pt-2">
          <TabsList
            variant="primary"
            className="flex h-auto flex-wrap justify-start gap-1"
          >
            {tabs.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value}>
                <Icon className="h-3.5 w-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <PageContainer padding="xs" spacing="md">
          <TabsContent value="collection" className="p-4 pt-4">
            <GlobalDataRefreshDashboard />
          </TabsContent>

          <TabsContent value="renders" className="space-y-4 p-4 pt-4">
            <SchedulerRollupData
              title="Asset Creation"
              description="Expected renders and queue state across the fleet"
            />
            <RenderActivitySection
              defaultPageSize={25}
              title="Render activity"
              description="Asset runs in the last 48 hours (UTC rolling window)"
              footerLink={{
                href: "/dashboard/renders",
                label: "Open full render workspace",
              }}
            />
          </TabsContent>
        </PageContainer>
      </Tabs>
    </>
  );
}
