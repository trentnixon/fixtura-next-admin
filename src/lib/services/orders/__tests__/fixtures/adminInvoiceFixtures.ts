import type {
  AdminInvoiceAggregate,
  AdminInvoiceListResponse,
  AdminInvoicePatchResponse,
} from "@/types/adminInvoice";

export function makeInvoiceRequest(
  overrides: Partial<AdminInvoiceAggregate["invoiceRequest"]> = {}
): AdminInvoiceAggregate["invoiceRequest"] {
  return {
    id: 89,
    status: "invoice_received",
    billingOrganisationName: "Example Football Club",
    billingContactName: "Jane Smith",
    billingEmail: "accounts@example.com",
    requestNotes: "Awaiting invoice",
    requestedStartDate: "2026-08-01",
    requestedEndDate: "2027-08-01",
    requestedAmount: 650,
    currency: "AUD",
    submittedAt: "2026-07-22T01:00:00.000Z",
    updatedAt: "2026-07-22T03:00:00.000Z",
    selectedPlanName: "Club Pass",
    selectedPlanId: 3,
    ...overrides,
  };
}

export function makeAccount(
  overrides: Partial<AdminInvoiceAggregate["account"]> = {}
): AdminInvoiceAggregate["account"] {
  return {
    id: 123,
    name: "Example Football Club",
    type: "Club",
    email: "accounts@example.com",
    ...overrides,
  };
}

export function makeOrder(
  overrides: Partial<NonNullable<AdminInvoiceAggregate["order"]>> = {}
): NonNullable<AdminInvoiceAggregate["order"]> {
  return {
    id: 457,
    checkoutStatus: "invoice_issued",
    paymentStatus: "unpaid",
    orderPaid: false,
    isActive: false,
    paymentChannel: "invoice",
    invoiceNumber: "INV-0042",
    invoiceDueDate: "2026-08-22",
    invoicePdfUrl: "https://example.com/invoices/INV-0042.pdf",
    hostedInvoiceUrl: "https://example.com/invoices/INV-0042",
    total: 650,
    currency: "AUD",
    startAt: "2026-08-01",
    endAt: "2027-08-01",
    updatedAt: "2026-07-22T03:00:00.000Z",
    ...overrides,
  };
}

export function makeAggregate(
  overrides: Partial<{
    invoiceRequest: Partial<AdminInvoiceAggregate["invoiceRequest"]>;
    account: Partial<AdminInvoiceAggregate["account"]>;
    order: AdminInvoiceAggregate["order"];
  }> = {}
): AdminInvoiceAggregate {
  return {
    invoiceRequest: makeInvoiceRequest(overrides.invoiceRequest),
    account: makeAccount(overrides.account),
    order:
      overrides.order === undefined
        ? makeOrder()
        : overrides.order,
  };
}

export function makeListResponse(): AdminInvoiceListResponse {
  return {
    items: [
      {
        invoiceRequestId: 89,
        status: "invoice_received",
        organisationName: "Example Football Club",
        billingContactName: "Jane Smith",
        billingEmail: "accounts@example.com",
        requestedAmount: 650,
        currency: "AUD",
        selectedPlanName: "Club Pass",
        linkedOrderId: 457,
        orderCheckoutStatus: "incomplete",
        orderPaymentStatus: "unpaid",
        invoiceNumber: null,
        submittedAt: "2026-07-22T01:00:00.000Z",
        invoiceDueDate: null,
        hasInvoicePdfUrl: false,
        hasHostedInvoiceUrl: false,
        updatedAt: "2026-07-22T03:00:00.000Z",
        accountId: 123,
      },
    ],
    meta: {
      page: 1,
      pageSize: 25,
      total: 1,
      totalPages: 1,
    },
  };
}

export function makePatchResponse(): AdminInvoicePatchResponse {
  const aggregate = makeAggregate({
    invoiceRequest: {
      status: "invoice_created",
      updatedAt: "2026-07-22T04:00:00.000Z",
    },
  });
  return {
    aggregate,
    changedFields: ["invoiceRequest.status", "order.checkoutStatus"],
    emailStatus: "queued",
  };
}
