import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RenderActivitySection } from "@/app/dashboard/components/account-asset-run/RenderActivitySection";
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
];

export default function Renders() {
  return (
    <>
      <CreatePageTitle
        title="Renders"
        byLine="Render operations workspace"
        byLineBottom="Monitor live processing, scheduler queues, analytics, and recent render output"
      />
      <PageContainer padding="xs" spacing="lg">
        <Tabs defaultValue="overview" className="w-full min-w-0 max-w-full">
          <TabsList className="h-auto w-full flex-wrap justify-start rounded-md bg-slate-100 p-1 lg:w-auto">
            {renderTabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="min-h-10 gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <GlobalRenderRollup />
            <RenderPipelineOverview />
            <AssetRunOverviewSection />
          </TabsContent>

          <TabsContent value="render-activity" className="mt-6">
            <RenderActivitySection
              defaultPageSize={25}
              title="Render activity"
              description="Asset runs in the last 48 hours (UTC rolling window)"
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6 space-y-6">
            <RenderAnalyticsDashboard />
            <AssetRunOutcomesByDaySection />
            <RenderResourceLeaders />
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <SectionContainer
              title="Global Operational Audit"
              description="Most recent renders (25 per page), newest first."
            >
              <GlobalRenderTable />
            </SectionContainer>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
