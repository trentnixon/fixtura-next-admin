/** Permanent CMS invoice-request statuses (simplified lifecycle). */
export type InvoiceRequestStatus =
  | "invoice_received"
  | "invoice_created"
  | "paid"
  | "declined"
  | "cancelled";

/** Legacy statuses that may still appear during migration / leftover rows. */
export type LegacyInvoiceRequestStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "sent"
  | "expired";

/** Any status string the CMS may return; unknown values render safely. */
export type InvoiceRequestStatusValue =
  | InvoiceRequestStatus
  | LegacyInvoiceRequestStatus
  | (string & {});

export type AdminInvoiceEmailStatus = "queued" | "not_applicable";

export interface AdminInvoiceRequestDto {
  id: number;
  status: InvoiceRequestStatusValue;
  billingOrganisationName: string;
  billingContactName: string;
  billingEmail: string;
  requestNotes: string | null;
  requestedStartDate: string | null;
  requestedEndDate: string | null;
  requestedAmount: number | null;
  currency: string | null;
  submittedAt: string | null;
  updatedAt: string | null;
  selectedPlanName: string | null;
  selectedPlanId: number | null;
}

export interface AdminInvoiceAccountDto {
  id: number;
  name: string;
  type: string | null;
  email: string | null;
}

export interface AdminInvoiceOrderDto {
  id: number;
  checkoutStatus: string | null;
  paymentStatus: string | null;
  orderPaid: boolean;
  isActive: boolean;
  paymentChannel: string | null;
  invoiceNumber: string | null;
  invoiceDueDate: string | null;
  invoicePdfUrl: string | null;
  hostedInvoiceUrl: string | null;
  total: number | null;
  currency: string | null;
  startAt: string | null;
  endAt: string | null;
  updatedAt: string | null;
}

export interface AdminInvoiceAggregate {
  invoiceRequest: AdminInvoiceRequestDto;
  account: AdminInvoiceAccountDto;
  order: AdminInvoiceOrderDto | null;
}

export interface AdminInvoiceListRow {
  invoiceRequestId: number;
  status: InvoiceRequestStatusValue;
  organisationName: string;
  billingContactName: string;
  billingEmail: string;
  requestedAmount: number | null;
  currency: string | null;
  selectedPlanName: string | null;
  linkedOrderId: number | null;
  orderCheckoutStatus: string | null;
  orderPaymentStatus: string | null;
  invoiceNumber: string | null;
  submittedAt: string | null;
  invoiceDueDate: string | null;
  hasInvoicePdfUrl: boolean;
  hasHostedInvoiceUrl: boolean;
  updatedAt: string | null;
  accountId: number;
}

export interface AdminInvoiceListResponse {
  items: AdminInvoiceListRow[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface FetchAdminInvoicesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: InvoiceRequestStatus;
  accountId?: number;
  preset?: "new" | "outstanding" | "closed";
  outstanding?: boolean;
  sort?: "submittedAt" | "updatedAt" | "requestedAmount" | "status";
  sortDir?: "asc" | "desc";
}

export interface AdminInvoicePatchPayload {
  invoiceRequest?: AdminInvoicePatchInvoiceRequestFields;
  order?: AdminInvoicePatchOrderFields;
  expectedInvoiceRequestUpdatedAt?: string | null;
  expectedOrderUpdatedAt?: string | null;
}

export interface AdminInvoicePatchResponse {
  aggregate: AdminInvoiceAggregate;
  changedFields: string[];
  emailStatus?: AdminInvoiceEmailStatus;
}

/** Known CMS error codes returned by admin invoice endpoints. */
export type AdminInvoiceKnownCmsErrorCode =
  | "EMPTY_PATCH"
  | "STALE_INVOICE_REQUEST"
  | "STALE_ORDER"
  | "LINKED_ORDER_ACCOUNT_MISMATCH"
  | "LINKED_ORDER_REQUIRED"
  | "INVOICE_URL_REQUIRED"
  | "INVALID_INVOICEPDFURL"
  | "INVALID_HOSTEDINVOICEURL"
  | "BILLING_EMAIL_REQUIRED"
  | "INVALID_BILLING_EMAIL";

export type AdminInvoiceCmsErrorCode =
  | AdminInvoiceKnownCmsErrorCode
  | `UNSUPPORTED_FIELD:${string}`
  | `INVALID_${string}`
  | `INVALID_INVOICE_REQUEST_TRANSITION:${string}`;

/** PATCH payload keys allowed by the CMS allowlist. */
export type AdminInvoicePatchInvoiceRequestFields = Partial<
  Pick<
    AdminInvoiceRequestDto,
    | "status"
    | "billingContactName"
    | "billingEmail"
    | "billingOrganisationName"
    | "requestNotes"
    | "requestedStartDate"
    | "requestedEndDate"
    | "requestedAmount"
    | "currency"
  >
> & {
  status?: InvoiceRequestStatus;
};

export type AdminInvoicePatchOrderFields = Partial<
  Pick<
    AdminInvoiceOrderDto,
    | "invoiceNumber"
    | "invoiceDueDate"
    | "invoicePdfUrl"
    | "hostedInvoiceUrl"
    | "total"
    | "currency"
    | "startAt"
    | "endAt"
  >
>;
