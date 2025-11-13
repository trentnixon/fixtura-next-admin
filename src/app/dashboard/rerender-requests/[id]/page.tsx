"use client";

import { useParams } from "next/navigation";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { useRerenderRequestById } from "@/hooks/rerender-request/useRerenderRequestById";
import { formatDate } from "@/lib/utils";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import RerenderRequestDetail from "./components/RerenderRequestDetail";
import RerenderRequestActions from "./components/RerenderRequestActions";

export default function RerenderRequestDetailPage() {
  const { id } = useParams();
  const requestId = id ? parseInt(id as string, 10) : 0;

  const {
    data: request,
    isLoading,
    isError,
    error,
    isFetching,
    refetch: refetchRequest,
  } = useRerenderRequestById(requestId);

  // Build page title
  const pageTitle = request
    ? `Rerender Request #${request.id}`
    : "Rerender Request Details";

  // Build byLine with Request ID
  const byLine = requestId ? `Request ID: ${requestId}` : "";

  // Build byLineBottom with status and last updated date
  const byLineBottomParts = [];
  if (request?.status) {
    byLineBottomParts.push(`Status: ${request.status}`);
  }
  if (request?.updatedAt) {
    byLineBottomParts.push(`Last Updated: ${formatDate(request.updatedAt)}`);
  }
  const byLineBottom = byLineBottomParts.join(" · ");

  // UI: Loading State - Show loading if query is loading and no data
  if (isLoading && !request) {
    return (
      <>
        <CreatePageTitle
          title="Rerender Request Details"
          byLine={byLine}
          byLineBottom="Loading request information..."
        />
        <PageContainer padding="md" spacing="lg">
          <LoadingState message="Loading rerender request..." />
        </PageContainer>
      </>
    );
  }

  // UI: Error State - Show error if query has error
  if (isError) {
    return (
      <>
        <CreatePageTitle
          title="Rerender Request Details"
          byLine={byLine}
          byLineBottom="Error loading request"
        />
        <PageContainer padding="md" spacing="lg">
          <ErrorState
            variant="card"
            title="Unable to load rerender request"
            error={error as Error}
            onRetry={() => refetchRequest()}
          />
        </PageContainer>
      </>
    );
  }

  // UI: Empty State - Show empty if no request data
  if (!request) {
    return (
      <>
        <CreatePageTitle
          title="Rerender Request Details"
          byLine={byLine}
          byLineBottom="Request not found"
        />
        <PageContainer padding="md" spacing="lg">
          <EmptyState
            variant="card"
            title="Rerender request not found"
            description="The requested rerender request could not be located."
          />
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <CreatePageTitle
        title={pageTitle}
        byLine={byLine}
        byLineBottom={byLineBottom}
      />
      <PageContainer padding="md" spacing="lg">
        {/* Show minimal loading state when refetching in background */}
        {isFetching && request && (
          <LoadingState variant="minimal" message="Refreshing request..." />
        )}

        {/* Action Buttons Header */}
        <div className="mb-6">
          <RerenderRequestActions request={request} />
        </div>

        {/* Main Content */}
        <SectionContainer
          title="Request Details"
          description="Complete information about this rerender request"
        >
          <RerenderRequestDetail request={request} />
        </SectionContainer>
      </PageContainer>
    </>
  );
}

