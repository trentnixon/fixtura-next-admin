"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import AccountCostWidget from "../../components/AccountCostWidget";
import AccountMonthlyTrendChart from "../../components/AccountMonthlyTrendChart";
import AccountSummary from "../../components/AccountSummary";

/**
 * Account Analytics Page
 *
 * Displays detailed cost analytics for a specific account.
 */
export default function AccountAnalyticsPage() {
  const params = useParams<{ accountId: string }>();
  const accountId = useMemo(() => {
    const id = params?.accountId;
    return id ? parseInt(id as string, 10) : null;
  }, [params?.accountId]);

  return (
    <>
      <CreatePageTitle
        title={
          accountId ? `Account #${accountId} Analytics` : "Account Analytics"
        }
        byLine="Account-specific cost analysis and trends"
        byLineBottom="View detailed cost breakdown and trends for this account"
      >
        <DashboardLinkButton href="/dashboard/budget/account" trailingIcon="arrow">
          All accounts
        </DashboardLinkButton>
        <DashboardLinkButton href="/dashboard/budget" trailingIcon="arrow">
          Budget overview
        </DashboardLinkButton>
      </CreatePageTitle>

      <PageContainer padding="xs" spacing="md">
        {accountId && (
          <OverviewRecordPanel
            title="Account cost analytics"
            description="Widget breakdown, monthly trend, and summary for this account."
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AccountCostWidget accountId={accountId} />
                <AccountMonthlyTrendChart accountId={accountId} />
              </div>
              <AccountSummary accountId={accountId} />
            </div>
          </OverviewRecordPanel>
        )}

        {!accountId && (
          <OverviewRecordPanel title="Account analytics" description="Invalid account ID">
            <div className="flex flex-col items-center gap-3 py-8 text-sm text-muted-foreground">
              <p>Select an account from the account list.</p>
              <DashboardLinkButton href="/dashboard/budget/account" trailingIcon="arrow">
                Account list
              </DashboardLinkButton>
            </div>
          </OverviewRecordPanel>
        )}
      </PageContainer>
    </>
  );
}
