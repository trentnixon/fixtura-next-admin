"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  LayoutDashboard,
  LineChart,
  Sparkles,
} from "lucide-react";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";

import BudgetOverviewTab from "./components/BudgetOverviewTab";
import BudgetTrendsTab from "./components/BudgetTrendsTab";
import BudgetAnalyticsTab from "./components/BudgetAnalyticsTab";
import BudgetInsightsTab from "./components/BudgetInsightsTab";
import BudgetWorkspaceHeader from "./components/BudgetWorkspaceHeader";
import {
  type SummaryPeriod,
  type TrendGranularity,
} from "./components/PeriodControls";

const budgetTabs = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "trends", label: "Trends", icon: LineChart },
  { value: "analytics", label: "Analytics", icon: BarChart3 },
  { value: "insights", label: "Insights", icon: Sparkles },
] as const;

/**
 * Budget & costings — global render cost analysis with dashboard-aligned shell.
 */
export default function BudgetPage() {
  const [budgetTab, setBudgetTab] = useState("overview");
  const [period, setPeriod] = useState<SummaryPeriod>("current-month");
  const [granularity, setGranularity] = useState<TrendGranularity>("daily");

  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    if (granularity === "daily") {
      start.setDate(end.getDate() - 29);
    } else if (granularity === "weekly") {
      start.setDate(end.getDate() - 7 * 12);
    } else {
      start.setMonth(end.getMonth() - 11);
    }
    const toYmd = (d: Date) => d.toISOString().slice(0, 10);
    return { startDate: toYmd(start), endDate: toYmd(end) };
  }, [granularity]);

  return (
    <>
      <CreatePageTitle
        title="Budget & Costings"
        byLine="Global render cost analysis"
        byLineBottom="Lambda, AI, and render spend across the fleet"
      >
        <DashboardLinkButton href="/dashboard/budget/account" trailingIcon="arrow">
          Account costs
        </DashboardLinkButton>
        <DashboardLinkButton
          href="/dashboard/analytics"
          trailingIcon="external"
        >
          Analytics
        </DashboardLinkButton>
      </CreatePageTitle>

      <PageContainer padding="xs" spacing="md">
        <div className="space-y-6">
          <BudgetWorkspaceHeader
            period={period}
            onChangePeriod={setPeriod}
            granularity={granularity}
            onChangeGranularity={setGranularity}
          />

          <Tabs
            value={budgetTab}
            onValueChange={setBudgetTab}
            className="w-full min-w-0 max-w-full"
          >
            <div className="pb-8">
              <TabsList variant="primary" className={sectionTabListClass}>
                {budgetTabs.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    variant="section"
                    className={sectionTabTriggerClass}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="overview" className="mt-0">
              <BudgetOverviewTab period={period} />
            </TabsContent>

            <TabsContent value="trends" className="mt-0">
              <BudgetTrendsTab
                period={period}
                granularity={granularity}
                startDate={startDate}
                endDate={endDate}
                onOpenInsights={() => setBudgetTab("insights")}
              />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <BudgetAnalyticsTab period={period} granularity={granularity} />
            </TabsContent>

            <TabsContent value="insights" className="mt-0">
              <BudgetInsightsTab
                period={period}
                granularity={granularity}
                startDate={startDate}
                endDate={endDate}
                onOpenTrends={() => setBudgetTab("trends")}
              />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </>
  );
}
