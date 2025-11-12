"use client";

import { useParams } from "next/navigation";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import DisplayDownload from "./components";
import DownloadHeader from "./components/DownloadHeader";
import { useDownloadQuery } from "@/hooks/downloads/useDownloadsQuery";
import { formatDate } from "@/lib/utils";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";

export default function DownloadPage() {
  const { downloadID } = useParams();
  const {
    data: download,
    isLoading,
    isError,
    error,
    isFetching,
    refetch: refetchDownload,
  } = useDownloadQuery(downloadID as string);

  // Build page title with download name
  const pageTitle = download?.attributes?.Name
    ? `Download - ${download.attributes.Name}`
    : "Download Details";

  // Build byLine with Download ID
  const byLine = downloadID ? `Download ID: ${downloadID}` : "";

  // Build byLineBottom with category and last updated date
  const byLineBottomParts = [];
  if (download?.attributes?.grouping_category) {
    byLineBottomParts.push(download.attributes.grouping_category);
  }
  if (download?.attributes?.updatedAt) {
    byLineBottomParts.push(
      `Last Updated: ${formatDate(download.attributes.updatedAt)}`
    );
  }
  const byLineBottom = byLineBottomParts.join(" · ");

  // UI: Loading State - Show loading if query is loading and no data
  if (isLoading && !download) {
    return (
      <>
        <CreatePageTitle
          title="Download Details"
          byLine={byLine}
          byLineBottom="Loading download information..."
        />
        <PageContainer padding="md" spacing="lg">
          <LoadingState message="Loading download..." />
        </PageContainer>
      </>
    );
  }

  // UI: Error State - Show error if query has error
  if (isError) {
    return (
      <>
        <CreatePageTitle
          title="Download Details"
          byLine={byLine}
          byLineBottom="Error loading download"
        />
        <PageContainer padding="md" spacing="lg">
          <ErrorState
            variant="card"
            title="Unable to load download"
            error={error as Error}
            onRetry={() => refetchDownload()}
          />
        </PageContainer>
      </>
    );
  }

  // UI: Empty State - Show empty if no download data
  if (!download) {
    return (
      <>
        <CreatePageTitle
          title="Download Details"
          byLine={byLine}
          byLineBottom="Download not found"
        />
        <PageContainer padding="md" spacing="lg">
          <EmptyState
            variant="card"
            title="Download not found"
            description="The requested download could not be located."
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
        {isFetching && download && (
          <LoadingState variant="minimal" message="Refreshing download..." />
        )}

        {/* Action Buttons Header */}
        <div className="mb-6">
          <DownloadHeader download={download} />
        </div>

        {/* Main Content */}
        <DisplayDownload download={download} />
      </PageContainer>
    </>
  );
}
