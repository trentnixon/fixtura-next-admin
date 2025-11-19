"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {} from "@/components/ui/card";
import PeriodTrendsChart from "./components/PeriodTrendsChart";
import TopAccountsList from "./components/TopAccountsList";
import GlobalCostSummaryCard from "./components/GlobalCostSummary";
import CostBreakdownChart from "./components/CostBreakdownChart";
import PeriodComparison from "./components/PeriodComparison";
import PeriodTable from "./components/PeriodTable";
import PeakPeriodsChart from "./components/PeakPeriodsChart";
import AccountShareChart from "./components/AccountShareChart";
import StackedCostTrendsChart from "./components/StackedCostTrendsChart";
import AnomalyDetection from "./components/AnomalyDetection";
import CostForecast from "./components/CostForecast";
import AccountBreakdown from "./components/AccountBreakdown";
import PeriodControls, {
  SummaryPeriod,
  TrendGranularity,
} from "./components/PeriodControls";
import BreadcrumbNavigation from "./components/BreadcrumbNavigation";
import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/**
 * Budget & Costings Page
 *
 * View global render costs and budget analysis.
 */
export default function BudgetPage() {
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
        byLine="Global Render Cost Analysis"
        byLineBottom="View global render costs and budget analysis"
      />

      <PageContainer padding="xs" spacing="lg">
        <BreadcrumbNavigation />
        <div className="my-4" />
        <PeriodControls
          period={period}
          onChangePeriod={setPeriod}
          granularity={granularity}
          onChangeGranularity={setGranularity}
        />

        <Tabs defaultValue="overview" className="w-full mt-6">
          <TabsList variant="primary" className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <SectionContainer
              title="Global Summary"
              description="Overview of global costs and period comparisons"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlobalCostSummaryCard period={period} />
                <PeriodComparison
                  currentPeriod={period}
                  comparePeriod={
                    period === "current-month" ? "last-month" : "current-month"
                  }
                />
              </div>
            </SectionContainer>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <SectionContainer
              title="Cost Trends"
              description="Historical cost trends and breakdowns over time"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <PeriodTrendsChart
                    granularity={granularity}
                    startDate={startDate}
                    endDate={endDate}
                  />
                  <StackedCostTrendsChart
                    granularity={granularity}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>
                <div className="lg:col-span-1 space-y-6">
                  <CostBreakdownChart period={period} />
                  <AccountShareChart period={period} />
                  <TopAccountsList period={period} />
                </div>
              </div>
            </SectionContainer>

            <SectionContainer
              title="Peak Periods"
              description="Top periods by cost across different timeframes"
            >
              <PeakPeriodsChart />
            </SectionContainer>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <SectionContainer
              title="Period Analytics"
              description="Daily, weekly, and monthly rollup data with account breakdowns"
            >
              <div className="space-y-6">
                <PeriodTable />
                <AccountBreakdown />
              </div>
            </SectionContainer>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <SectionContainer
              title="Advanced Insights"
              description="Anomaly detection and cost forecasting"
            >
              <div className="space-y-6">
                <AnomalyDetection />
                <CostForecast />
              </div>
            </SectionContainer>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
