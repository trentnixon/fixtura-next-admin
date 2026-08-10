"use client";

import { useParams } from "next/navigation";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { useAdminInvoiceDetail } from "@/hooks/orders/useAdminInvoiceDetail";
import { isCmsApiError } from "@/lib/services/utils/cms-api-error";
import { getInvoiceDetailPageTitleCopy } from "../utils/invoiceDetailPageTitle";
import InvoiceEditor from "./components/InvoiceEditor";
import InvoiceAggregateSummary from "./components/InvoiceAggregateSummary";
import InvoiceBreadcrumbHeader from "./components/InvoiceBreadcrumbHeader";
import InvoiceDetailToolbar from "./components/InvoiceDetailToolbar";

export default function AdminInvoiceDetailPage() {
  const params = useParams<{ invoiceRequestId: string }>();
  const invoiceRequestId = params.invoiceRequestId;
  const { data, isLoading, isError, error, refetch } =
    useAdminInvoiceDetail(invoiceRequestId);

  const isNotFound = isError && isCmsApiError(error) && error.status === 404;
  const titleCopy = getInvoiceDetailPageTitleCopy({
    invoiceRequestId,
    data,
    isLoading,
    isNotFound,
    isError,
  });

  return (
    <>
      <CreatePageTitle
        title={titleCopy.title}
        byLine={titleCopy.byLine}
        byLineBottom={titleCopy.byLineBottom}
      />
      <PageContainer padding="md" spacing="lg">
        <InvoiceBreadcrumbHeader invoiceRequestId={invoiceRequestId} />
        <InvoiceDetailToolbar
          accountId={data?.account.id}
          accountType={data?.account.type}
          orderId={data?.order?.id ?? null}
        />

        {isLoading && (
          <LoadingState variant="skeleton" message="Loading invoice…" />
        )}

        {isNotFound && (
          <EmptyState
            variant="card"
            title="Invoice request not found"
            description={`Invoice request #${invoiceRequestId} could not be located.`}
          />
        )}

        {isError && !isNotFound && (
          <ErrorState
            variant="card"
            error={error}
            title="Error loading invoice"
            onRetry={refetch}
          />
        )}

        {data && (
          <div className="grid gap-6">
            <InvoiceAggregateSummary aggregate={data} />
            <InvoiceEditor
              key={invoiceRequestId}
              initialAggregate={data}
              refetch={refetch}
            />
          </div>
        )}
      </PageContainer>
    </>
  );
}
