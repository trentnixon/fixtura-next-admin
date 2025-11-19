"use client";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { useTopAccountsByCost } from "@/hooks/rollups/useTopAccountsByCost";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      />

      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Select Render"
          description="Choose a render to view detailed cost analytics"
        >
          <Card className="bg-white border shadow-none">
            <CardHeader className="p-4">
              <CardTitle>Recent Renders</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
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
            </CardContent>
          </Card>
        </SectionContainer>

        <SectionContainer
          title="Render Analytics"
          description="Select a render from the list above to view analytics"
        >
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">
              Please select a render from the list above to view detailed
              analytics.
            </p>
          </div>
        </SectionContainer>
      </PageContainer>
    </>
  );
}

