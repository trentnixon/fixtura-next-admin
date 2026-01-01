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
import { Activity, TrendingUp, AlertCircle } from "lucide-react";

import { SchedulerSearch } from "./components/SchedulerSearch";
import { QuickInterventionSidebar } from "./components/QuickInterventionSidebar";
import SchedulerHealthTrendChart from "@/app/dashboard/schedulers/components/SchedulerHealthTrendChart";

export default function SchedulersPage() {
  return (
    <>
      <CreatePageTitle
        title="Schedulers"
        byLine="Monitor and manage scheduler performance"
        byLineBottom="View rendering status, queue, and scheduled renders"
      >
        <div className="flex justify-end mt-4 lg:mt-0">
          <SchedulerSearch />
        </div>
      </CreatePageTitle>

      <PageContainer padding="md" spacing="lg">
        {/* Full-width Audit Audit Section */}
        <div className="flex flex-col gap-8">
          <SectionContainer
            title="Operational History & Forecast"
            description="Audit past performance and view upcoming scheduled renders"
            icon={<Activity className="h-5 w-5 text-brandPrimary-500" />}
          >
            <Tabs defaultValue="today" className="w-full">
              <TabsList variant="secondary" className="mb-6">
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

          <SectionContainer
            title="Live Rendering Activity"
            description="Real-time stream of schedulers currently being processed or waiting in queue"
            icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
          >
            <SchedulerRenderingTable />
          </SectionContainer>

          {/* Metrics & Intelligence Section Table Width */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
            {/* Main Metrics (Left 8 cols) */}
            <div className="lg:col-span-12 flex flex-col gap-8 text-left">
              <SchedulerRollupData />

              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider px-1 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Performance Metrics & Capacity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SchedulerHealthTrendChart />
                  <SchedulerBarChartByDays />
                </div>
              </div>
              <div className="sticky top-6">
                <QuickInterventionSidebar />
              </div>
            </div>


          </div>
        </div>
      </PageContainer>
    </>
  );
}
