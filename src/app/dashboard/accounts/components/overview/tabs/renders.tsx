import {
  fixturaContentHubAccountDetails,
  Render,
} from "@/types/fixturaContentHubAccountDetails";
import SchedulerDetailsGrid from "../components/SchedulerDetails";
import ListRendersInTable from "../components/ListRendersInTable";
import MetricsTable from "./components/MetricsTable";
// TODO: Add Overview Tab
export default function RendersTab({
  accountData,
  accountId,
}: {
  accountData: fixturaContentHubAccountDetails;
  accountId: number;
}) {
  return (
    <div className="col-span-12 gap-4 space-y-4">
      <SchedulerDetailsGrid
        schedulerId={accountData?.scheduler.id as number}
        accountData={accountData as fixturaContentHubAccountDetails}
      />
      <MetricsTable accountData={accountData} />
      <ListRendersInTable
        schedulerId={accountData?.scheduler.id as number}
        accountId={accountId}
        sport={accountData?.Sport || ""}
        accountType={accountData?.account_type === 1 ? "club" : "association"}
        renders={accountData?.renders as Render[]}
      />
    </div>
  );
}
