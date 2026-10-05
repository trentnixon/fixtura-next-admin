import { Suspense } from "react";
import { SchedulerRollupData } from "@/app/dashboard/schedulers/components/SchedulerRollupData";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { SchedulerSearch } from "./components/SchedulerSearch";
import { QuickInterventionSidebar } from "./components/QuickInterventionSidebar";
import { SchedulerWorkspaceTabs } from "./components/SchedulerWorkspaceTabs";

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

        <Suspense fallback={null}>
          <SchedulerWorkspaceTabs />
        </Suspense>
      </PageContainer>
    </>
  );
}
