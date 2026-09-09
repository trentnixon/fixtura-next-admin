import { SchedulerRollupData } from "@/app/dashboard/schedulers/components/SchedulerRollupData";
import { SchedulerRenderingTable } from "@/app/dashboard/schedulers/components/SchedulerRenderingTable";
import SchedulerBarChartByDays from "@/app/dashboard/schedulers/components/schedulerBarChartByDays";
import GetTodaysSchedulers from "./components/getTodaysSchedulers";
import GetTomorrowsSchedulers from "./components/getTomorrowsSchedulers";
import GetYesterdaysSchedulers from "./components/getYesterdaysSchedulers";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  sectionTabListClass,
  sectionTabListInverseClass,
  sectionTabTriggerClass,
  sectionTabTriggerInverseClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CalendarClock,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

import { SchedulerSearch } from "./components/SchedulerSearch";
import { QuickInterventionSidebar } from "./components/QuickInterventionSidebar";
import SchedulerHealthTrendChart from "@/app/dashboard/schedulers/components/SchedulerHealthTrendChart";

const schedulerTabs = [
  {
    value: "schedule",
    label: "Schedule",
    icon: CalendarDays,
  },
  {
    value: "live",
    label: "Live Queue",
    icon: Activity,
  },
  {
    value: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
] as const;

export default function SchedulersPage() {
  return (
    <>
      <CreatePageTitle
        title="Schedulers"
        byLine="Operations"
        byLineBottom="Monitor scheduler health, render queues, and upcoming workload"
      >
        <SchedulerSearch />
      </CreatePageTitle>

      <PageContainer padding="xs" spacing="md">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <SchedulerRollupData />
          <QuickInterventionSidebar />
        </div>

        <Tabs defaultValue="schedule" className="w-full">
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
                <TabsList
                  variant="sectionInverse"
                  className={cn(sectionTabListInverseClass, "mb-4")}
                >
                  <TabsTrigger
                    value="yesterday"
                    variant="sectionInverse"
                    className={sectionTabTriggerInverseClass}
                  >
                    Yesterday
                  </TabsTrigger>
                  <TabsTrigger
                    value="today"
                    variant="sectionInverse"
                    className={sectionTabTriggerInverseClass}
                  >
                    Today
                  </TabsTrigger>
                  <TabsTrigger
                    value="tomorrow"
                    variant="sectionInverse"
                    className={sectionTabTriggerInverseClass}
                  >
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
      </PageContainer>
    </>
  );
}
