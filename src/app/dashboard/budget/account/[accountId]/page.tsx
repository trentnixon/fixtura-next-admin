"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
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
      />

      <PageContainer padding="xs" spacing="lg">
        {accountId && (
          <SectionContainer
            title="Account Analytics"
            description="Detailed cost analysis and trends for this account"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AccountCostWidget accountId={accountId} />
                <AccountMonthlyTrendChart accountId={accountId} />
              </div>
              <AccountSummary accountId={accountId} />
            </div>
          </SectionContainer>
        )}

        {!accountId && (
          <SectionContainer
            title="Account Analytics"
            description="Invalid account ID"
          >
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">
                Please select an account from the account list page.
              </p>
            </div>
          </SectionContainer>
        )}
      </PageContainer>
    </>
  );
}
