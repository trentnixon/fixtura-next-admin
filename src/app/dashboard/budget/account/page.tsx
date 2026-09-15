"use client";

import { useRouter } from "next/navigation";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { useTopAccountsByCost } from "@/hooks/rollups/useTopAccountsByCost";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils/chart-formatters";
import { getAccountAnalyticsUrl } from "../components/_utils/navigation";

/**
 * Account Analytics List Page
 *
 * Displays a list of accounts for selection to view detailed analytics.
 */
export default function AccountAnalyticsListPage() {
  const router = useRouter();

  // Fetch list of accounts for selection
  const {
    data: accountsData,
    isLoading: accountsLoading,
    isError: accountsError,
    error: accountsErr,
  } = useTopAccountsByCost({
    period: "all-time",
    limit: 100,
    sortBy: "totalCost",
    sortOrder: "desc",
  });

  return (
    <>
      <CreatePageTitle
        title="Account Analytics"
        byLine="Account-specific cost analysis and trends"
        byLineBottom="Select an account to view detailed analytics"
      >
        <DashboardLinkButton href="/dashboard/budget" trailingIcon="arrow">
          Budget overview
        </DashboardLinkButton>
      </CreatePageTitle>

      <PageContainer padding="xs" spacing="md">
        <OverviewRecordPanel
          title="Select account"
          description="Accounts ranked by all-time render cost."
        >
          <div className="rounded-md border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-900">Accounts</h3>
            </div>
            <div className="p-4">
              {accountsLoading && (
                <LoadingState message="Loading accounts..." />
              )}
              {accountsError && (
                <ErrorState
                  variant="card"
                  title="Unable to load accounts"
                  error={accountsErr as Error}
                />
              )}
              {accountsData?.data && accountsData.data.length > 0 && (
                <ul className="space-y-2">
                  {accountsData.data.map((account) => (
                    <li
                      key={account.accountId}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-brandPrimary-300 hover:bg-brandPrimary-50/50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (account.accountId) {
                          router.push(getAccountAnalyticsUrl(account.accountId));
                        }
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">
                            {account.accountName ?? `Account #${account.accountId}`}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Renders: {account.totalRenders ?? 0} • Avg/Render:{" "}
                          {account.averageCostPerRender != null
                            ? formatCurrency(account.averageCostPerRender)
                            : "-"}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-sm">
                          {account.totalCost != null
                            ? formatCurrency(account.totalCost)
                            : "-"}
                        </div>
                        {typeof account.percentageOfTotal === "number" && (
                          <div className="text-xs text-muted-foreground">
                            {account.percentageOfTotal.toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </li>
                  ))}
                </ul>
              )}
              {accountsData?.data && accountsData.data.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No accounts found
                </div>
              )}
            </div>
          </div>
        </OverviewRecordPanel>
      </PageContainer>
    </>
  );
}

