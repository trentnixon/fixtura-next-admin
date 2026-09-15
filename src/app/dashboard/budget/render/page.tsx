"use client";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { useTopAccountsByCost } from "@/hooks/rollups/useTopAccountsByCost";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { useMemo } from "react";

/**
 * Global Render List Page
 *
 * Displays a list of recent renders from top accounts for selection.
 */
export default function RenderListPage() {

  // Get top accounts to aggregate their recent renders
  const {
    isLoading: accountsLoading,
    isError: accountsError,
    error: accountsErr,
  } = useTopAccountsByCost({
    period: "all-time",
    limit: 20, // Get top 20 accounts
    sortBy: "totalCost",
    sortOrder: "desc",
  });

  // For now, show a message that we're aggregating data
  // In a real implementation, we'd fetch account summaries in parallel
  const renders = useMemo(() => {
    // Placeholder - in production, aggregate from account summaries
    return [];
  }, []);

  return (
    <>
      <CreatePageTitle
        title="Render Analytics"
        byLine="Render-specific cost analysis and breakdowns"
        byLineBottom="Select a render to view detailed cost analytics"
      >
        <DashboardLinkButton href="/dashboard/budget" trailingIcon="arrow">
          Budget overview
        </DashboardLinkButton>
        <DashboardLinkButton href="/dashboard/renders" trailingIcon="external">
          Renders
        </DashboardLinkButton>
      </CreatePageTitle>

      <PageContainer padding="xs" spacing="md">
        <OverviewRecordPanel
          title="Select render"
          description="Render list is aggregated from account cost rollups."
        >
          <div className="rounded-md border border-slate-200 bg-white p-4">
              {accountsLoading && (
                <LoadingState message="Loading renders..." />
              )}
              {accountsError && (
                <ErrorState
                  variant="card"
                  title="Unable to load renders"
                  error={accountsErr as Error}
                />
              )}
              {renders.length === 0 && !accountsLoading && !accountsError && (
                <div className="text-sm text-muted-foreground text-center py-8">
                  <p>Renders will be displayed here once data is available.</p>
                  <p className="mt-2 text-xs">
                    Renders are aggregated from account summaries.
                  </p>
                </div>
              )}
          </div>
        </OverviewRecordPanel>
      </PageContainer>
    </>
  );
}

