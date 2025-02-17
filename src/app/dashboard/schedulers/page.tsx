// TODO: Add schedulers page

import { SchedulerRollupData } from "@/app/dashboard/schedulers/components/SchedulerRollupData";
import { SchedulerRenderingTable } from "@/app/dashboard/schedulers/components/SchedulerRenderingTable";
import { SectionTitle } from "@/components/type/titles";
import SchedulerBarChartByDays from "@/app/dashboard/schedulers/components/schedulerBarChartByDays";
import GetTodaysSchedulers from "./components/getTodaysSchedulers";
import GetTomorrowsSchedulers from "./components/getTomorrowsSchedulers";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";

export default function SchedulersPage() {
  return (
    <CreatePage>
      <CreatePageTitle title="Schedulers" byLine="Fixtura Schedulers" />
      <section className="flex flex-col gap-4 my-4">
        <SectionTitle>Schedulers</SectionTitle>

        <div className="col-span-12 gap-4 space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-9 gap-4">
              <SchedulerRollupData />
              <SchedulerRenderingTable />
            </div>
            <div className="col-span-3 gap-4">
              <SchedulerBarChartByDays />
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="today">
        <TabsList className="">
          <TabsTrigger value="today">Scheduled for Today</TabsTrigger>
          <TabsTrigger value="tomorrow">Scheduled for Tomorrow</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <div className=" px-4 py-2">
            <TabsContent value="today">
              <section className="flex flex-col gap-4 my-4">
                <GetTodaysSchedulers />
              </section>
            </TabsContent>
            <TabsContent value="tomorrow">
              <section className="flex flex-col gap-4 my-4">
                <GetTomorrowsSchedulers />
              </section>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </CreatePage>
  );
}
