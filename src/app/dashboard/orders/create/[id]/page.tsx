"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreateInvoiceForm from "./components/CreateInvoiceForm";

/**
 * Create Invoice Page
 *
 * Allows admins to create manual invoice orders for a specific account.
 * The account ID is passed via the route parameter [id].
 *
 * This page displays a form to create an invoice order with:
 * - Account ID (pre-filled from route)
 * - Subscription tier selection
 * - Amount and currency
 * - Start date, end date, due date
 * - Days until due (auto-calculated)
 * - Description
 */
export default function CreateInvoicePage() {
  const params = useParams<{ id: string }>();
  const accountId = useMemo(() => {
    const id = params?.id ?? "";
    return id ? parseInt(id, 10) : 0;
  }, [params]);

  if (!accountId || isNaN(accountId)) {
    return (
      <>
        <CreatePageTitle title="Create Invoice" byLine="Invalid account ID" />
        <PageContainer padding="md" spacing="lg">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Invalid account ID. Please navigate from an account page.
            </p>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <CreatePageTitle
        title="Create Invoice"
        byLine={`Create a new invoice order for account #${accountId}`}
      />

      <PageContainer padding="md" spacing="lg">
        <CreateInvoiceForm accountId={accountId} />
      </PageContainer>
    </>
  );
}
