"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { EmptyState } from "@/components/ui-library";

/**
 * Create Invoice Index Page
 *
 * This page should redirect to account-specific invoice creation.
 * For now, it shows an empty state indicating an account ID is required.
 */
export default function CreateInvoiceIndexPage() {
  return (
    <PageContainer>
      <SectionContainer title="Create Invoice">
        <EmptyState
          title="Create Invoice"
          description="Please navigate to an account page to create an invoice. An account ID is required to create an invoice."
          variant="card"
        />
      </SectionContainer>
    </PageContainer>
  );
}
