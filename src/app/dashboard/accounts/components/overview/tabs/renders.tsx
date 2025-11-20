import {
  fixturaContentHubAccountDetails,
  Render,
} from "@/types/fixturaContentHubAccountDetails";
import SchedulerDetailsGrid from "../components/SchedulerDetails";
import ListRendersInTable from "../components/ListRendersInTable";
import MetricsTable from "./components/MetricsTable";
import RenderCharts from "./components/RenderCharts";
import SchedulerCostTable from "@/app/dashboard/budget/components/SchedulerCostTable";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import AccountCostSummary from "./components/AccountCostSummary";
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
      {/* Account-level cost summary - shows totals across all schedulers */}
      <AccountCostSummary accountId={accountId} />
      {schedulerId && (
        <SchedulerDetailsGrid
          schedulerId={schedulerId}
          accountData={accountData as fixturaContentHubAccountDetails}
        />
      )}
      {schedulerId && (
        <ListRendersInTable
          schedulerId={schedulerId}
          accountId={accountId}
          sport={accountData?.Sport || ""}
          accountType={accountData?.account_type === 1 ? "club" : "association"}
          renders={renders}
        />
      )}
      {schedulerId && (
        <SectionContainer
          title="Scheduler Cost Analysis"
          description="Cost breakdown for all renders in this scheduler"
        >
          <SchedulerCostTable schedulerId={schedulerId} />
        </SectionContainer>
      )}
      <MetricsTable accountData={accountData} />

      {renders.length > 0 && <RenderCharts renders={renders} />}
    </div>
  );
}
