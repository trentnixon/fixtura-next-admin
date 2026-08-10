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
import AccountAssetRunPanel from "../../account-asset-run/AccountAssetRunPanel";
import { RenderActivitySection } from "@/app/dashboard/components/account-asset-run/RenderActivitySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart3, CircleDollarSign, History } from "lucide-react";

const RENDER_CHILD_TABS = [
  {
    id: "runs",
    label: "Runs",
    icon: Activity,
  },
  {
    id: "history",
    label: "History",
    icon: History,
  },
  {
    id: "costs",
    label: "Costs",
    icon: CircleDollarSign,
  },
  {
    id: "insights",
    label: "Insights",
    icon: BarChart3,
  },
] as const;

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

  const accountOrgType =
    accountData?.account_type === 1 ? "club" : "association";

  return (
    <Tabs defaultValue="runs" className="col-span-12 w-full">
      <TabsList
        variant="secondary"
        className="mb-4 h-auto flex-wrap justify-start gap-1 rounded-md"
      >
        {RENDER_CHILD_TABS.map((tab) => {
          const Icon = tab.icon;

          return (
            <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="runs" className="mt-0 space-y-4">
        {schedulerId ? (
          <SchedulerDetailsGrid
            schedulerId={schedulerId}
            accountData={accountData as fixturaContentHubAccountDetails}
          />
        ) : (
          <SectionContainer title="Scheduler" variant="compact">
            <p className="text-sm text-muted-foreground">
              No scheduler is linked to this account.
            </p>
          </SectionContainer>
        )}

        <AccountAssetRunPanel
          accountId={accountId}
          accountType={accountOrgType}
        />

        <RenderActivitySection
          accountId={accountId}
          showAccountColumn={false}
          defaultPageSize={25}
          title="Recent render activity"
          description="Asset runs for this account in the last 48 hours (UTC rolling window)"
        />
      </TabsContent>

      <TabsContent value="history" className="mt-0 space-y-4">
        {schedulerId ? (
          <ListRendersInTable
            schedulerId={schedulerId}
            accountId={accountId}
            sport={accountData?.Sport || ""}
            accountType={
              accountData?.account_type === 1 ? "club" : "association"
            }
            renders={renders}
          />
        ) : (
          <SectionContainer title="Render History" variant="compact">
            <p className="text-sm text-muted-foreground">
              No scheduler is linked to this account.
            </p>
          </SectionContainer>
        )}
      </TabsContent>

      <TabsContent value="costs" className="mt-0 space-y-4">
        <AccountCostSummary accountId={accountId} />

        {schedulerId && (
          <SectionContainer
            title="Scheduler Cost Analysis"
            description="Cost breakdown for all renders in this scheduler"
          >
            <SchedulerCostTable schedulerId={schedulerId} />
          </SectionContainer>
        )}
      </TabsContent>

      <TabsContent value="insights" className="mt-0 space-y-4">
        <MetricsTable accountData={accountData} />
        {renders.length > 0 && <RenderCharts renders={renders} />}
      </TabsContent>
    </Tabs>
  );
}
