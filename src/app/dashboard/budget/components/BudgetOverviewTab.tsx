"use client";

import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import CostBreakdownChart from "./CostBreakdownChart";
import PeriodComparison from "./PeriodComparison";
import TopAccountsList from "./TopAccountsList";
import BudgetOverviewEfficiency from "./BudgetOverviewEfficiency";
import { getComparePeriod, periodLabel } from "./_utils/budgetPeriods";
import type { SummaryPeriod } from "./PeriodControls";

interface BudgetOverviewTabProps {
  period: SummaryPeriod;
}

/**
 * Budget overview — period comparison, cost mix, efficiency, top spenders.
 */
export default function BudgetOverviewTab({ period }: BudgetOverviewTabProps) {
  const comparePeriod = getComparePeriod(period);

  return (
    <div className="space-y-6">
      <PeriodComparison
        currentPeriod={period}
        comparePeriod={comparePeriod}
      />

      <OverviewRecordPanel
        title="Cost mix & efficiency"
        description={`Lambda vs AI split and unit economics for ${periodLabel(period).toLowerCase()}.`}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CostBreakdownChart period={period} compact />
          </div>
          <BudgetOverviewEfficiency period={period} />
        </div>
      </OverviewRecordPanel>

      <OverviewRecordPanel
        title="Top spenders"
        description="Accounts driving the most render cost in this period."
        action={
          <DashboardLinkButton
            href="/dashboard/budget/account"
            trailingIcon="arrow"
          >
            All accounts
          </DashboardLinkButton>
        }
      >
        <TopAccountsList period={period} limit={5} variant="embedded" />
      </OverviewRecordPanel>
    </div>
  );
}
