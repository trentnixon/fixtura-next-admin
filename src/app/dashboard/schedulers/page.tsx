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
  Activity,
  AlertCircle,
  BarChart3,
  CalendarClock,
  CalendarDays,
  Search,
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
        <div className="flex justify-end mt-4 lg:mt-0">
          <SchedulerSearch />
        </div>
      </CreatePageTitle>

      <PageContainer padding="xs" spacing="md">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <SchedulerRollupData />
          <QuickInterventionSidebar />
        </div>

        <Tabs defaultValue="schedule" className="w-full">
          <TabsList
            variant="primary"
            className="mb-4 h-auto flex-wrap justify-start gap-1"
          >
            {schedulerTabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="schedule">
            <SectionContainer
              title="Operational History & Forecast"
              description="Audit recent outcomes and scan the next scheduled render window"
              icon={<CalendarClock className="h-5 w-5 text-brandPrimary-500" />}
              variant="compact"
              action={
                <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase text-slate-600 md:flex">
                  <Search className="h-3.5 w-3.5" />
                  Search by scheduler ID above
                </div>
              }
            >
              <Tabs defaultValue="today" className="w-full">
                <TabsList variant="secondary" className="mb-4 h-auto flex-wrap">
                  <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
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

          <TabsContent value="live">
            <SectionContainer
              title="Live Rendering Activity"
              description="Real-time stream of schedulers currently being processed or waiting in queue"
              icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
              variant="compact"
            >
              <SchedulerRenderingTable />
            </SectionContainer>
          </TabsContent>

          <TabsContent value="analytics">
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
