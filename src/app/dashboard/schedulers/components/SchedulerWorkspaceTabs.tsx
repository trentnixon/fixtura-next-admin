"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Activity, AlertCircle, BarChart3, CalendarClock, CalendarDays, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  sectionTabListClass,
  sectionTabListInverseClass,
  sectionTabTriggerClass,
  sectionTabTriggerInverseClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import {
  buildSchedulerTabHref,
  parseSchedulerTab,
  type SchedulerTab,
} from "@/lib/scheduler/schedulerTab";
import { SchedulerRenderingTable } from "./SchedulerRenderingTable";
import SchedulerBarChartByDays from "./schedulerBarChartByDays";
import GetTodaysSchedulers from "./getTodaysSchedulers";
import GetTomorrowsSchedulers from "./getTomorrowsSchedulers";
import GetYesterdaysSchedulers from "./getYesterdaysSchedulers";
import SchedulerHealthTrendChart from "./SchedulerHealthTrendChart";

const schedulerTabs: Array<{ value: SchedulerTab; label: string; icon: typeof CalendarDays }> = [
  { value: "schedule", label: "Schedule", icon: CalendarDays },
  { value: "live", label: "Live Queue", icon: Activity },
  { value: "analytics", label: "Analytics", icon: BarChart3 },
];

export function SchedulerWorkspaceTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = parseSchedulerTab(searchParams.get("tab"));

  const onTabChange = (value: string) => {
    router.replace(buildSchedulerTabHref(parseSchedulerTab(value)), { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="pb-8">
        <TabsList variant="primary" className={sectionTabListClass}>
          {schedulerTabs.map((tab) => {
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

      <TabsContent value="schedule" className="mt-0">
        <SectionContainer
          title="Operational History & Forecast"
          description="Audit recent outcomes and scan the next scheduled render window"
          icon={<CalendarClock className="h-5 w-5 text-brandPrimary-500" />}
          variant="compact"
        >
          <Tabs defaultValue="today" className="w-full">
            <TabsList variant="sectionInverse" className={cn(sectionTabListInverseClass, "mb-4")}>
              <TabsTrigger value="yesterday" variant="sectionInverse" className={sectionTabTriggerInverseClass}>
                Yesterday
              </TabsTrigger>
              <TabsTrigger value="today" variant="sectionInverse" className={sectionTabTriggerInverseClass}>
                Today
              </TabsTrigger>
              <TabsTrigger value="tomorrow" variant="sectionInverse" className={sectionTabTriggerInverseClass}>
                Tomorrow
              </TabsTrigger>
            </TabsList>
            <TabsContent value="yesterday">
              <GetYesterdaysSchedulers />
            </TabsContent>
            <TabsContent value="today">
              <GetTodaysSchedulers />
            </TabsContent>
            <TabsContent value="tomorrow">
              <GetTomorrowsSchedulers />
            </TabsContent>
          </Tabs>
        </SectionContainer>
      </TabsContent>

      <TabsContent value="live" className="mt-0">
        <SectionContainer
          title="Live Rendering Activity"
          description="Real-time stream of schedulers currently being processed or waiting in queue"
          icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
          variant="compact"
        >
          <SchedulerRenderingTable />
        </SectionContainer>
      </TabsContent>

      <TabsContent value="analytics" className="mt-0">
        <SectionContainer
          title="Performance Metrics"
          description="System health and render capacity trends"
          icon={<TrendingUp className="h-5 w-5 text-brandPrimary-500" />}
          variant="compact"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <SchedulerHealthTrendChart />
            <SchedulerBarChartByDays />
          </div>
        </SectionContainer>
      </TabsContent>
    </Tabs>
  );
}
