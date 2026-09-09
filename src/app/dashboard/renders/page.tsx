import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RenderActivitySection } from "@/app/dashboard/components/account-asset-run/RenderActivitySection";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import {
  Activity,
  BarChart3,
  ClipboardCheck,
  Gauge,
} from "lucide-react";
import { GlobalRenderRollup } from "./components/GlobalRenderRollup";
import { GlobalRenderTable } from "./components/GlobalRenderTable";
import { RenderAnalyticsDashboard } from "./components/RenderAnalyticsDashboard";
import { AssetRunOverviewSection } from "./components/AssetRunOverviewSection";
import { AssetRunOutcomesByDaySection } from "./components/AssetRunOutcomesByDaySection";
import { RenderResourceLeaders } from "./components/RenderResourceLeaders";
import { RenderPipelineOverview } from "./components/RenderPipelineOverview";

const renderTabs = [
  { value: "overview", label: "Overview", icon: Gauge },
  {
    value: "render-activity",
    label: "Render activity",
    icon: Activity,
  },
  { value: "analytics", label: "Analytics", icon: BarChart3 },
  { value: "audit", label: "Audit", icon: ClipboardCheck },
] as const;

export default function Renders() {
  return (
    <>
      <CreatePageTitle
        title="Renders"
        byLine="Render operations workspace"
        byLineBottom="Monitor live processing, scheduler queues, analytics, and recent render output"
      >
        <DashboardLinkButton href="/dashboard/schedulers" trailingIcon="external">
          Schedulers
        </DashboardLinkButton>
      </CreatePageTitle>
      <PageContainer padding="xs" spacing="lg">
        <Tabs defaultValue="overview" className="w-full min-w-0 max-w-full">
          <div className="pb-8">
            <TabsList variant="primary" className={sectionTabListClass}>
              {renderTabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    variant="section"
                    className={sectionTabTriggerClass}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0 space-y-6">
            <GlobalRenderRollup />
            <RenderPipelineOverview />
            <AssetRunOverviewSection />
          </TabsContent>

          <TabsContent value="render-activity" className="mt-0">
            <RenderActivitySection
              defaultPageSize={25}
              title="Render activity"
              description="Asset runs in the last 48 hours (UTC rolling window)"
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0 space-y-6">
            <RenderAnalyticsDashboard />
            <AssetRunOutcomesByDaySection />
            <RenderResourceLeaders />
          </TabsContent>

          <TabsContent value="audit" className="mt-0">
            <GlobalRenderTable />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
