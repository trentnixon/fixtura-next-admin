"use client";

import AccountOverviewPanel from "./AccountOverviewPanel";
import RendersTab from "./tabs/renders";
import CompetitionsTab from "./tabs/competitions";
import DataTab from "./tabs/Data";
import AccountAnalyticsCards from "./tabs/components/AccountAnalyticsCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Clapperboard,
  Database,
  DollarSign,
  Layers,
  Trophy,
} from "lucide-react";

const TAB_LABELS = [
  { id: "financial", label: "Financial", icon: DollarSign },
  { id: "renders", label: "Renders", icon: Clapperboard },
  { id: "data", label: "Data refresh", icon: Database },
  { id: "competitions", label: "Competitions", icon: Trophy },
  { id: "grades", label: "Grades", icon: Layers },
  { id: "fixtures", label: "Fixtures", icon: CalendarDays },
] as const;

function renderTabContent(
  tabId: string,
  accountData: fixturaContentHubAccountDetails,
  accountID: string,
) {
  const accountId = Number(accountID);

  switch (tabId) {
    case "financial":
      return <AccountAnalyticsCards accountId={accountId} />;
    case "renders":
      return <RendersTab accountData={accountData} accountId={accountId} />;
    case "competitions":
      return <CompetitionsTab />;
    case "grades":
      return (
        <SectionContainer title="Grades" variant="compact">
          <p className="text-sm text-muted-foreground">Coming soon: Grades</p>
        </SectionContainer>
      );
    case "fixtures":
      return (
        <SectionContainer title="Fixtures" variant="compact">
          <p className="text-sm text-muted-foreground">Coming soon: Fixtures</p>
        </SectionContainer>
      );
    case "data":
      return <DataTab accountId={accountId} />;
    default:
      return null;
  }
}

type AccountDetailWorkspaceProps = {
  accountData: fixturaContentHubAccountDetails;
  accountID: string;
};

/**
 * Account detail main area — 70% tabs, 30% account/subscription summary.
 */
export default function AccountDetailWorkspace({
  accountData,
  accountID,
}: AccountDetailWorkspaceProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start">
      <Tabs defaultValue="financial" className="min-w-0 w-full">
        <TabsList variant="primary" className={cn(sectionTabListClass, "mb-4")}>
          {TAB_LABELS.map(({ id, label, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              variant="section"
              className={sectionTabTriggerClass}
            >
              <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TAB_LABELS.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            {renderTabContent(tab.id, accountData, accountID)}
          </TabsContent>
        ))}
      </Tabs>

      <aside className="min-w-0">
        <AccountOverviewPanel accountData={accountData} />
      </aside>
    </div>
  );
}
