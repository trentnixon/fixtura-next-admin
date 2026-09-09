"use client";

import { useParams } from "next/navigation";
import AccountHealthPanel from "../../account-health/AccountHealthPanel";
import DataRefreshAtAGlance from "../../account-health/DataRefreshAtAGlance";
import DataRefreshLatestRunSection from "../../account-health/DataRefreshLatestRunSection";
import DataRefreshRecentRunsTable from "../../account-health/DataRefreshRecentRunsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListInverseClass,
  sectionTabTriggerInverseClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import { Gauge, History, ListTree } from "lucide-react";

interface DataTabProps {
  accountId?: number;
}

const DATA_REFRESH_CHILD_TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: Gauge,
  },
  {
    id: "workflow",
    label: "Workflow",
    icon: ListTree,
  },
  {
    id: "history",
    label: "History",
    icon: History,
  },
] as const;

/**
 * Account Data refresh tab — season data refresh runs (Account Health).
 */
export default function DataTab({ accountId: accountIdProp }: DataTabProps) {
  const params = useParams();
  const accountIdNumber =
    accountIdProp ?? Number(params.accountID as string | undefined);

  if (!Number.isFinite(accountIdNumber) || accountIdNumber <= 0) {
    return (
      <p className="text-sm text-muted-foreground">Invalid account id.</p>
    );
  }

  return (
    <Tabs defaultValue="overview" className="col-span-12 w-full">
      <TabsList
        variant="sectionInverse"
        className={cn(sectionTabListInverseClass, "mb-4")}
      >
        {DATA_REFRESH_CHILD_TABS.map((tab) => {
          const Icon = tab.icon;

          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              variant="sectionInverse"
              className={sectionTabTriggerInverseClass}
            >
              <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="overview" className="mt-0 space-y-6">
        <AccountHealthPanel accountId={accountIdNumber} />
        <DataRefreshAtAGlance accountId={accountIdNumber} />
      </TabsContent>

      <TabsContent value="workflow" className="mt-0 space-y-4">
        <DataRefreshLatestRunSection accountId={accountIdNumber} />
      </TabsContent>

      <TabsContent value="history" className="mt-0 space-y-4">
        <DataRefreshRecentRunsTable accountId={accountIdNumber} />
      </TabsContent>
    </Tabs>
  );
}
