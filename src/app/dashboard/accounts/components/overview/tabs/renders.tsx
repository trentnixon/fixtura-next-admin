import {
  fixturaContentHubAccountDetails,
  Render,
} from "@/types/fixturaContentHubAccountDetails";
// import SchedulerDetailsGrid from "../components/SchedulerDetails";
import ListRendersInTable from "../components/ListRendersInTable";
import MetricsTable from "./components/MetricsTable";
// import RenderCharts from "./components/RenderCharts";
// import SchedulerCostTable from "@/app/dashboard/budget/components/SchedulerCostTable";
// import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import AccountCostSummary from "./components/AccountCostSummary";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import SchedulerCostTable from "@/app/dashboard/budget/components/SchedulerCostTable";
import RenderCharts from "./components/RenderCharts";
import SchedulerDetailsGrid from "../components/SchedulerDetails";
// TODO: Add Overview Tab
export default function RendersTab({
  accountData,
  accountId,
}: {
  accountData: fixturaContentHubAccountDetails;
  accountId: number;
}) {
  const renders = (accountData?.renders as Render[]) || [];
  const schedulerId = accountData?.scheduler?.id;

  return (
    <div className="col-span-12 gap-4 space-y-4">
      {/* Step 2: AccountCostSummary - Account-level cost summary */}
      <AccountCostSummary accountId={accountId} />

      {/* Step 3: SchedulerDetailsGrid - Scheduler details (COMMENTED OUT - suspected crash source) */}
      {schedulerId && (
        <SchedulerDetailsGrid
          schedulerId={schedulerId}
          accountData={accountData as fixturaContentHubAccountDetails}
        />
      )}

      {/* Step 4: ListRendersInTable - Render history table */}
      {schedulerId && (
        <ListRendersInTable
          schedulerId={schedulerId}
          accountId={accountId}
          sport={accountData?.Sport || ""}
          accountType={accountData?.account_type === 1 ? "club" : "association"}
          renders={renders}
        />
      )}
      {/* Step 1: MetricsTable - simplest component, just displays data */}
      <MetricsTable accountData={accountData} />
      {schedulerId && (
        <SectionContainer
          title="Scheduler Cost Analysis"
          description="Cost breakdown for all renders in this scheduler"
        >
          <SchedulerCostTable schedulerId={schedulerId} />
        </SectionContainer>
      )}

      {renders.length > 0 && <RenderCharts renders={renders} />}
    </div>
  );
}
