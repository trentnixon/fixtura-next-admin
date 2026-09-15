import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import {
  BarChart3,
  CircleDollarSign,
  RefreshCcw,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { SubscriptionAnalyticsWidget } from "./components/SubscriptionAnalyticsWidget";
import { GlobalAnalyticsWidget } from "./components/GlobalAnalyticsWidget";
import { TrialConversionWidget } from "./components/TrialConversionWidget";
import { RevenueAnalyticsWidget } from "./components/RevenueAnalyticsWidget";
import { CohortAnalyticsWidget } from "./components/CohortAnalyticsWidget";

interface AnalyticsSection {
  value: string;
  label: string;
  icon: LucideIcon;
  content: ReactNode;
}

const analyticsSections: AnalyticsSection[] = [
  {
    value: "snapshot",
    label: "Snapshot",
    icon: BarChart3,
    content: <GlobalAnalyticsWidget />,
  },
  {
    value: "revenue",
    label: "Revenue",
    icon: CircleDollarSign,
    content: <RevenueAnalyticsWidget />,
  },
  {
    value: "trials",
    label: "Trials",
    icon: Target,
    content: <TrialConversionWidget />,
  },
  {
    value: "subscriptions",
    label: "Subscriptions",
    icon: RefreshCcw,
    content: <SubscriptionAnalyticsWidget />,
  },
  {
    value: "cohorts",
    label: "Cohorts",
    icon: Users,
    content: <CohortAnalyticsWidget />,
  },
];

/**
 * Analytics Dashboard Page
 *
 * Tab shell matches `/dashboard` (`DashboardTabs`) and `/dashboard/renders`.
 * Workspace / record containers live inside tab widgets — TBD in a containers pass.
 */
export default function AnalyticsPage() {
  return (
    <>
      <CreatePageTitle
        title="Analytics"
        byLine="Business intelligence"
        byLineBottom="Revenue, subscription, trial, and cohort performance"
      >
        <DashboardLinkButton
          href="/dashboard?tab=financials"
          trailingIcon="external"
        >
          Dashboard financials
        </DashboardLinkButton>
      </CreatePageTitle>
      <PageContainer padding="xs" spacing="md">
        <Tabs
          defaultValue={analyticsSections[0].value}
          className="w-full min-w-0 max-w-full"
        >
          <div className="pb-8">
            <TabsList variant="primary" className={sectionTabListClass}>
              {analyticsSections.map((section) => {
                const Icon = section.icon;

                return (
                  <TabsTrigger
                    key={section.value}
                    value={section.value}
                    variant="section"
                    className={sectionTabTriggerClass}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                    {section.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {analyticsSections.map((section) => (
            <TabsContent
              key={section.value}
              value={section.value}
              className="mt-0 space-y-6"
            >
              {section.content}
            </TabsContent>
          ))}
        </Tabs>
      </PageContainer>
    </>
  );
}
