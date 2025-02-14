// TODO: Add schedulers page

import { SchedulerRollupData } from "@/app/dashboard/schedulers/components/SchedulerRollupData";
import { SchedulerRenderingTable } from "@/app/dashboard/schedulers/components/SchedulerRenderingTable";
import { ByLine, SectionTitle, Title } from "@/components/type/titles";
import SchedulerBarChartByDays from "@/app/dashboard/schedulers/components/schedulerBarChartByDays";
import GetTodaysSchedulers from "./components/getTodaysSchedulers";

export default function SchedulersPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 mb-2">
        <div className="border-b border-slate-200 pb-2 mb-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0">
              <ByLine>Schedulers</ByLine>
              <Title>Fixtura Schedulers</Title>
            </div>
          </div>
        </div>

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
        <section className="flex flex-col gap-4 my-4">
          <SectionTitle>Recent Renders</SectionTitle>
          <GetTodaysSchedulers />
        </section>

        <section className="flex flex-col gap-4 my-4">
          <SectionTitle>Expected Renders</SectionTitle>
        </section>
      </div>
    </div>
  );
}
