import {
  fixturaContentHubAccountDetails,
  Render,
} from "@/types/fixturaContentHubAccountDetails";
import SchedulerDetailsGrid from "../components/SchedulerDetails";
import ListRendersInTable from "../components/ListRendersInTable";
import MetricsTable from "./components/MetricsTable";
import RenderCharts from "./components/RenderCharts";
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
      {schedulerId && (
        <SchedulerDetailsGrid
          schedulerId={schedulerId}
          accountData={accountData as fixturaContentHubAccountDetails}
        />
      )}
      <MetricsTable accountData={accountData} />
      {schedulerId && (
        <ListRendersInTable
          schedulerId={schedulerId}
          accountId={accountId}
          sport={accountData?.Sport || ""}
          accountType={accountData?.account_type === 1 ? "club" : "association"}
          renders={renders}
        />
      )}
      {renders.length > 0 && <RenderCharts renders={renders} />}
    </div>
  );
}
