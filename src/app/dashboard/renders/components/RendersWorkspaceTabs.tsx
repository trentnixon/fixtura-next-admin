"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RenderActivitySection } from "@/app/dashboard/components/account-asset-run/RenderActivitySection";
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
import { GlobalRenderRollup } from "./GlobalRenderRollup";
import { GlobalRenderTable } from "./GlobalRenderTable";
import { RenderAnalyticsDashboard } from "./RenderAnalyticsDashboard";
import { AssetRunOverviewSection } from "./AssetRunOverviewSection";
import { AssetRunOutcomesByDaySection } from "./AssetRunOutcomesByDaySection";
import { RenderResourceLeaders } from "./RenderResourceLeaders";
import { RenderPipelineOverview } from "./RenderPipelineOverview";
import { RenderAttentionSignalsSection } from "./RenderAttentionSignalsSection";

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

type RenderTabValue = (typeof renderTabs)[number]["value"];

function parseTab(value: string | null): RenderTabValue {
  const found = renderTabs.find((tab) => tab.value === value);
  return found?.value ?? "overview";
}

export function RendersWorkspaceTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = parseTab(searchParams.get("tab"));

  const onTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full min-w-0 max-w-full"
    >
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
        <RenderAttentionSignalsSection />
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
  );
}
