import { SchedulerRollupData } from "@/app/dashboard/schedulers/components/SchedulerRollupData";
import { SchedulerRenderingTable } from "@/app/dashboard/schedulers/components/SchedulerRenderingTable";
import SchedulerBarChartByDays from "@/app/dashboard/schedulers/components/schedulerBarChartByDays";
import GetTodaysSchedulers from "./components/getTodaysSchedulers";
import GetTomorrowsSchedulers from "./components/getTomorrowsSchedulers";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

export default function SchedulersPage() {
  return (
    <>
      <CreatePageTitle
        title="Schedulers"
        byLine="Monitor and manage scheduler performance"
        byLineBottom="View rendering status, queue, and scheduled renders"
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Scheduler Overview"
          description="Current status and metrics for all schedulers"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-9 space-y-6">
              <SchedulerRollupData />
              <SchedulerRenderingTable />
            </div>
            <div className="lg:col-span-3">
              <SchedulerBarChartByDays />
            </div>
          </div>
        </SectionContainer>

        <SectionContainer
          title="Scheduled Renders"
          description="View schedulers scheduled for today and tomorrow"
        >
          <Tabs defaultValue="today">
            <TabsList variant="primary" className="mb-4">
              <TabsTrigger value="today">Scheduled for Today</TabsTrigger>
              <TabsTrigger value="tomorrow">Scheduled for Tomorrow</TabsTrigger>
            </TabsList>
            <TabsContent value="today">
              <GetTodaysSchedulers />
            </TabsContent>
            <TabsContent value="tomorrow">
              <GetTomorrowsSchedulers />
            </TabsContent>
          </Tabs>
        </SectionContainer>
      </PageContainer>
    </>
  );
}
