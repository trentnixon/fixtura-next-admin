"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { useContactFormSubmissionsData } from "@/hooks/contact-form/useContactFormSubmissions";
import ContactFormTable from "./components/ContactFormTable";
import ContactFormStats from "./components/ContactFormStats";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";

/**
 * Contact Forms Page
 *
 * View and manage contact form submissions from the CMS.
 */
export default function ContactPage() {
  const { data, total, isLoading, isError, error, refetch } =
    useContactFormSubmissionsData();

  return (
    <>
      <CreatePageTitle
        title="Contact Forms"
        byLine="CMS Contact Form Submissions"
        byLineBottom="View and manage contact form submissions from the CMS"
      />

      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Contact Form Submissions"
          description={
            !isLoading && !isError
              ? `${total} total submission${total !== 1 ? "s" : ""}`
              : "View and manage contact form submissions from the CMS"
          }
        >
          {isLoading && (
            <LoadingState
              variant="skeleton"
              message="Loading contact form submissions..."
            />
          )}

          {isError && (
            <ErrorState
              variant="card"
              error={error}
              title="Error Loading Contact Forms"
              description="Failed to fetch contact form submissions. Please try again."
              onRetry={refetch}
            />
          )}

          {!isLoading && !isError && data.length === 0 && (
            <EmptyState
              variant="card"
              title="No Contact Form Submissions"
              description="There are no contact form submissions to display at this time."
            />
          )}

          {!isLoading && !isError && data.length > 0 && (
            <>
              <ContactFormTable submissions={data} />
            </>
          )}
        </SectionContainer>

        {/* Stats and Charts Section */}
        {!isLoading && !isError && data.length > 0 && (
          <SectionContainer
            title="Statistics & Insights"
            description="Overview metrics and visualizations for contact form submissions"
          >
            <ContactFormStats submissions={data} />
          </SectionContainer>
        )}
      </PageContainer>
    </>
  );
}
