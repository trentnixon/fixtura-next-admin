import type { AdminInvoiceAggregate } from "@/types/adminInvoice";
import { formatInvoiceRequestStatusLabel } from "./invoiceQueueFormatters";

function fallbackRequestTitle(invoiceRequestId: string): string {
  return `Invoice Request #${invoiceRequestId}`;
}

/**
 * Prefer billing organisation name, then account name, then request id title.
 */
export function getInvoiceDetailOrganisationName(
  aggregate: AdminInvoiceAggregate,
  invoiceRequestId: string
): string {
  const billingOrg = aggregate.invoiceRequest.billingOrganisationName?.trim();
  if (billingOrg) {
    return billingOrg;
  }

  const accountName = aggregate.account.name?.trim();
  if (accountName) {
    return accountName;
  }

  return fallbackRequestTitle(invoiceRequestId);
}

export function getInvoiceDetailPageTitleCopy(args: {
  invoiceRequestId: string;
  data?: AdminInvoiceAggregate;
  isLoading: boolean;
  isNotFound: boolean;
  isError: boolean;
}): { title: string; byLine: string; byLineBottom?: string } {
  const { invoiceRequestId, data, isLoading, isNotFound, isError } = args;
  const requestTitle = fallbackRequestTitle(invoiceRequestId);

  if (data) {
    return {
      title: getInvoiceDetailOrganisationName(data, invoiceRequestId),
      byLine: formatInvoiceRequestStatusLabel(data.invoiceRequest.status),
      byLineBottom: `Invoice request #${invoiceRequestId}`,
    };
  }

  if (isLoading) {
    return {
      title: requestTitle,
      byLine: "Loading invoice…",
    };
  }

  if (isNotFound) {
    return {
      title: requestTitle,
      byLine: "Invoice request not found",
    };
  }

  if (isError) {
    return {
      title: requestTitle,
      byLine: "Error loading invoice",
    };
  }

  return {
    title: requestTitle,
    byLine: "Invoice editor",
  };
}
