import type {
  AdminInvoiceAggregate,
  AdminInvoiceEmailStatus,
  AdminInvoiceListResponse,
  AdminInvoicePatchPayload,
  AdminInvoicePatchResponse,
  FetchAdminInvoicesParams,
} from "@/types/adminInvoice";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isStringOrNull(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function serializeAdminInvoiceListParams(
  params: FetchAdminInvoicesParams
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.page != null) {
    searchParams.set("page", String(params.page));
  }
  if (params.pageSize != null) {
    searchParams.set("pageSize", String(params.pageSize));
  }
  if (params.search != null && params.search !== "") {
    searchParams.set("search", params.search);
  }
  if (params.status != null) {
    searchParams.set("status", params.status);
  }
  if (params.accountId != null) {
    searchParams.set("accountId", String(params.accountId));
  }
  if (params.preset != null) {
    searchParams.set("preset", params.preset);
  }
  if (params.outstanding != null) {
    searchParams.set("outstanding", String(params.outstanding));
  }
  if (params.sort != null) {
    searchParams.set("sort", params.sort);
  }
  if (params.sortDir != null) {
    searchParams.set("sortDir", params.sortDir);
  }

  return searchParams;
}

export function assertValidInvoiceRequestId(
  invoiceRequestId: number | string
): number | string {
  if (invoiceRequestId === "" || invoiceRequestId == null) {
    throw new Error("Invoice request id is required.");
  }

  if (typeof invoiceRequestId === "string" && invoiceRequestId.trim() === "") {
    throw new Error("Invoice request id is required.");
  }

  if (
    typeof invoiceRequestId === "number" &&
    (!Number.isFinite(invoiceRequestId) || invoiceRequestId <= 0)
  ) {
    throw new Error("Invoice request id must be a positive number.");
  }

  return invoiceRequestId;
}

export function assertNonEmptyPatchPayload(
  payload: AdminInvoicePatchPayload
): void {
  const hasInvoiceRequest =
    payload.invoiceRequest != null &&
    Object.keys(payload.invoiceRequest).length > 0;
  const hasOrder =
    payload.order != null && Object.keys(payload.order).length > 0;

  if (!hasInvoiceRequest && !hasOrder) {
    throw new Error("At least one invoiceRequest or order field must be provided.");
  }
}

function isAdminInvoiceListMeta(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isFiniteNumber(value.page) &&
    isFiniteNumber(value.pageSize) &&
    isFiniteNumber(value.total) &&
    isFiniteNumber(value.totalPages)
  );
}

function isAdminInvoiceListRow(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isFiniteNumber(value.invoiceRequestId) &&
    typeof value.status === "string" &&
    typeof value.organisationName === "string" &&
    typeof value.billingContactName === "string" &&
    typeof value.billingEmail === "string" &&
    (value.requestedAmount === null || isFiniteNumber(value.requestedAmount)) &&
    isStringOrNull(value.currency) &&
    isStringOrNull(value.selectedPlanName) &&
    (value.linkedOrderId === null || isFiniteNumber(value.linkedOrderId)) &&
    isStringOrNull(value.orderCheckoutStatus) &&
    isStringOrNull(value.orderPaymentStatus) &&
    isStringOrNull(value.invoiceNumber) &&
    isStringOrNull(value.submittedAt) &&
    isStringOrNull(value.invoiceDueDate) &&
    isBoolean(value.hasInvoicePdfUrl) &&
    isBoolean(value.hasHostedInvoiceUrl) &&
    isStringOrNull(value.updatedAt) &&
    isFiniteNumber(value.accountId)
  );
}

export function parseAdminInvoiceListResponse(
  payload: unknown
): AdminInvoiceListResponse {
  const direct = unwrapDataEnvelope(payload);

  if (
    !isRecord(direct) ||
    !Array.isArray(direct.items) ||
    !isAdminInvoiceListMeta(direct.meta)
  ) {
    throw new Error("Invalid admin invoices list response.");
  }

  if (!direct.items.every(isAdminInvoiceListRow)) {
    throw new Error("Invalid admin invoices list response: malformed item row.");
  }

  return direct as unknown as AdminInvoiceListResponse;
}

function isAdminInvoiceRequestDto(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isFiniteNumber(value.id) &&
    typeof value.status === "string" &&
    typeof value.billingOrganisationName === "string" &&
    typeof value.billingContactName === "string" &&
    typeof value.billingEmail === "string" &&
    isStringOrNull(value.requestNotes) &&
    isStringOrNull(value.requestedStartDate) &&
    isStringOrNull(value.requestedEndDate) &&
    (value.requestedAmount === null || isFiniteNumber(value.requestedAmount)) &&
    isStringOrNull(value.currency) &&
    isStringOrNull(value.submittedAt) &&
    isStringOrNull(value.updatedAt) &&
    isStringOrNull(value.selectedPlanName) &&
    (value.selectedPlanId === null || isFiniteNumber(value.selectedPlanId))
  );
}

function isAdminInvoiceAccountDto(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isFiniteNumber(value.id) &&
    typeof value.name === "string" &&
    isStringOrNull(value.type) &&
    isStringOrNull(value.email)
  );
}

function isAdminInvoiceOrderDto(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isFiniteNumber(value.id) &&
    isStringOrNull(value.checkoutStatus) &&
    isStringOrNull(value.paymentStatus) &&
    isBoolean(value.orderPaid) &&
    isBoolean(value.isActive) &&
    isStringOrNull(value.paymentChannel) &&
    isStringOrNull(value.invoiceNumber) &&
    isStringOrNull(value.invoiceDueDate) &&
    isStringOrNull(value.invoicePdfUrl) &&
    isStringOrNull(value.hostedInvoiceUrl) &&
    (value.total === null || isFiniteNumber(value.total)) &&
    isStringOrNull(value.currency) &&
    isStringOrNull(value.startAt) &&
    isStringOrNull(value.endAt) &&
    isStringOrNull(value.updatedAt)
  );
}

export function parseAdminInvoiceAggregate(payload: unknown): AdminInvoiceAggregate {
  const direct = unwrapDataEnvelope(payload);

  if (!isRecord(direct)) {
    throw new Error("Invalid admin invoice detail response.");
  }

  if (
    !isAdminInvoiceRequestDto(direct.invoiceRequest) ||
    !isAdminInvoiceAccountDto(direct.account) ||
    !(direct.order === null || isAdminInvoiceOrderDto(direct.order))
  ) {
    throw new Error("Invalid admin invoice detail response: malformed aggregate.");
  }

  return direct as unknown as AdminInvoiceAggregate;
}

function parseEmailStatus(value: unknown): AdminInvoiceEmailStatus | undefined {
  if (value === "queued" || value === "not_applicable") {
    return value;
  }
  return undefined;
}

export function parseAdminInvoicePatchResponse(
  payload: unknown
): AdminInvoicePatchResponse {
  const direct = unwrapDataEnvelope(payload);

  if (!isRecord(direct) || !("aggregate" in direct)) {
    throw new Error("Invalid admin invoice patch response.");
  }

  if (
    !Array.isArray(direct.changedFields) ||
    !direct.changedFields.every((field) => typeof field === "string")
  ) {
    throw new Error("Invalid admin invoice patch response: malformed changedFields.");
  }

  const aggregate = parseAdminInvoiceAggregate(direct.aggregate);
  const emailStatus = parseEmailStatus(direct.emailStatus);

  return {
    aggregate,
    changedFields: direct.changedFields,
    ...(emailStatus ? { emailStatus } : {}),
  };
}

function unwrapDataEnvelope(payload: unknown): unknown {
  if (
    isRecord(payload) &&
    "data" in payload &&
    payload.data != null &&
    !("items" in payload) &&
    !("invoiceRequest" in payload) &&
    !("aggregate" in payload)
  ) {
    return payload.data;
  }
  return payload;
}

/** React Query key prefix for admin invoice list queries. */
export const ADMIN_INVOICES_QUERY_PREFIX = ["orders", "admin-invoices"] as const;

export function adminInvoiceDetailQueryKey(
  invoiceRequestId: number | string
): readonly ["orders", "admin-invoices", "detail", number | string] {
  return ["orders", "admin-invoices", "detail", invoiceRequestId];
}

export function isAdminInvoiceListQueryKey(
  queryKey: readonly unknown[]
): boolean {
  return (
    queryKey.length >= 2 &&
    queryKey[0] === "orders" &&
    queryKey[1] === "admin-invoices" &&
    queryKey[2] !== "detail"
  );
}
