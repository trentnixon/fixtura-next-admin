"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { useRerenderRequestsData } from "@/hooks/rerender-request/useRerenderRequests";
import RerenderRequestTable from "./components/RerenderRequestTable";
import RerenderRequestStats from "./components/RerenderRequestStats";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

/**
 * ReRender Requests Page
 *
 * View and manage re-render requests from the CMS.
 */
export default function ReRenderRequestsPage() {
  const { data, total, isLoading, isError, error, refetch, isFetching } =
    useRerenderRequestsData();

  return (
    <>
      <CreatePageTitle
        title="ReRender Requests"
        byLine="Render Re-Request Management"
        byLineBottom="View and manage re-render requests from the CMS"
      />

      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="ReRender Requests"
          description={
            !isLoading && !isError
              ? `${total} total request${total !== 1 ? "s" : ""}`
              : "View and manage re-render requests from the CMS"
          }
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh rerender requests"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          }
        >
          {isLoading && (
            <LoadingState
              variant="skeleton"
              message="Loading rerender requests..."
            />
          )}

          {isError && (
            <ErrorState
              variant="card"
              error={error}
              title="Error Loading ReRender Requests"
              description="Failed to fetch rerender requests. Please try again."
              onRetry={refetch}
            />
          )}

          {!isLoading && !isError && data.length === 0 && (
            <EmptyState
              variant="card"
              title="No ReRender Requests"
              description="There are no rerender requests to display at this time."
            />
          )}

          {!isLoading && !isError && data.length > 0 && (
            <RerenderRequestTable requests={data} />
          )}
        </SectionContainer>

        {/* Stats Section */}
        {!isLoading && !isError && data.length > 0 && (
          <SectionContainer
            title="Statistics & Insights"
            description="Overview metrics for rerender requests"
          >
            <RerenderRequestStats requests={data} />
          </SectionContainer>
        )}
      </PageContainer>
    </>
  );
}

