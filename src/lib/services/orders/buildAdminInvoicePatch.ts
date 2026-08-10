import type {
  AdminInvoiceAggregate,
  AdminInvoicePatchInvoiceRequestFields,
  AdminInvoicePatchOrderFields,
  AdminInvoicePatchPayload,
  InvoiceRequestStatus,
} from "@/types/adminInvoice";
import { isIssuanceTransition } from "@/lib/services/orders/adminInvoiceTransitions";

/** Sentinel value for "no status change" in the editor. */
export const NO_STATUS_CHANGE = "__no_change__" as const;

export type InvoiceEditorFormValues = {
  billingOrganisationName: string;
  billingContactName: string;
  billingEmail: string;
  requestNotes: string;
  requestedStartDate: string;
  requestedEndDate: string;
  requestedAmount: string;
  currency: string;
  invoiceNumber: string;
  invoiceDueDate: string;
  hostedInvoiceUrl: string;
  invoicePdfUrl: string;
  orderTotal: string;
  orderCurrency: string;
  startAt: string;
  endAt: string;
};

export type BuildAdminInvoicePatchInput = {
  baseline: AdminInvoiceAggregate;
  form: InvoiceEditorFormValues;
  nextStatus: InvoiceRequestStatus | typeof NO_STATUS_CHANGE;
};

export type BuildAdminInvoicePatchResult =
  | { kind: "empty" }
  | {
      kind: "ready";
      payload: AdminInvoicePatchPayload;
    }
  | {
      kind: "blocked";
      reason: "missing_concurrency" | "issuance_requires_order";
    };

function hasTimestamp(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeNullableString(value: string): string | null {
  return value.trim() === "" ? null : value;
}

function normalizeNullableNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function diffInvoiceRequestFields(
  baseline: AdminInvoiceAggregate,
  form: InvoiceEditorFormValues,
  nextStatus: InvoiceRequestStatus | typeof NO_STATUS_CHANGE
): AdminInvoicePatchInvoiceRequestFields {
  const patch: AdminInvoicePatchInvoiceRequestFields = {};
  const request = baseline.invoiceRequest;

  if (
    nextStatus !== NO_STATUS_CHANGE &&
    nextStatus !== request.status
  ) {
    patch.status = nextStatus;
  }

  if (form.billingOrganisationName !== request.billingOrganisationName) {
    patch.billingOrganisationName = form.billingOrganisationName;
  }
  if (form.billingContactName !== request.billingContactName) {
    patch.billingContactName = form.billingContactName;
  }
  if (form.billingEmail !== request.billingEmail) {
    patch.billingEmail = form.billingEmail;
  }

  const formNotes = normalizeNullableString(form.requestNotes);
  if (formNotes !== request.requestNotes) {
    patch.requestNotes = formNotes;
  }

  const formStart = normalizeNullableString(form.requestedStartDate);
  if (formStart !== request.requestedStartDate) {
    patch.requestedStartDate = formStart;
  }

  const formEnd = normalizeNullableString(form.requestedEndDate);
  if (formEnd !== request.requestedEndDate) {
    patch.requestedEndDate = formEnd;
  }

  const formAmount = normalizeNullableNumber(form.requestedAmount);
  if (formAmount !== request.requestedAmount) {
    patch.requestedAmount = formAmount;
  }

  const formCurrency = normalizeNullableString(form.currency);
  if (formCurrency !== request.currency) {
    patch.currency = formCurrency;
  }

  return patch;
}

function diffOrderFields(
  baseline: AdminInvoiceAggregate,
  form: InvoiceEditorFormValues
): AdminInvoicePatchOrderFields {
  const patch: AdminInvoicePatchOrderFields = {};
  const order = baseline.order;

  if (!order) {
    return patch;
  }

  const formInvoiceNumber = normalizeNullableString(form.invoiceNumber);
  if (formInvoiceNumber !== order.invoiceNumber) {
    patch.invoiceNumber = formInvoiceNumber;
  }

  const formDueDate = normalizeNullableString(form.invoiceDueDate);
  if (formDueDate !== order.invoiceDueDate) {
    patch.invoiceDueDate = formDueDate;
  }

  const formHostedUrl = normalizeNullableString(form.hostedInvoiceUrl);
  if (formHostedUrl !== order.hostedInvoiceUrl) {
    patch.hostedInvoiceUrl = formHostedUrl;
  }

  const formPdfUrl = normalizeNullableString(form.invoicePdfUrl);
  if (formPdfUrl !== order.invoicePdfUrl) {
    patch.invoicePdfUrl = formPdfUrl;
  }

  const formTotal = normalizeNullableNumber(form.orderTotal);
  if (formTotal !== order.total) {
    patch.total = formTotal;
  }

  const formOrderCurrency = normalizeNullableString(form.orderCurrency);
  if (formOrderCurrency !== order.currency) {
    patch.currency = formOrderCurrency;
  }

  const formStartAt = normalizeNullableString(form.startAt);
  if (formStartAt !== order.startAt) {
    patch.startAt = formStartAt;
  }

  const formEndAt = normalizeNullableString(form.endAt);
  if (formEndAt !== order.endAt) {
    patch.endAt = formEndAt;
  }

  return patch;
}

export function aggregateToFormValues(
  aggregate: AdminInvoiceAggregate
): InvoiceEditorFormValues {
  return {
    billingOrganisationName: aggregate.invoiceRequest.billingOrganisationName,
    billingContactName: aggregate.invoiceRequest.billingContactName,
    billingEmail: aggregate.invoiceRequest.billingEmail,
    requestNotes: aggregate.invoiceRequest.requestNotes ?? "",
    requestedStartDate: aggregate.invoiceRequest.requestedStartDate ?? "",
    requestedEndDate: aggregate.invoiceRequest.requestedEndDate ?? "",
    requestedAmount: aggregate.invoiceRequest.requestedAmount?.toString() ?? "",
    currency: aggregate.invoiceRequest.currency ?? "",
    invoiceNumber: aggregate.order?.invoiceNumber ?? "",
    invoiceDueDate: aggregate.order?.invoiceDueDate ?? "",
    hostedInvoiceUrl: aggregate.order?.hostedInvoiceUrl ?? "",
    invoicePdfUrl: aggregate.order?.invoicePdfUrl ?? "",
    orderTotal: aggregate.order?.total?.toString() ?? "",
    orderCurrency: aggregate.order?.currency ?? "",
    startAt: aggregate.order?.startAt ?? "",
    endAt: aggregate.order?.endAt ?? "",
  };
}

export function buildAdminInvoicePatch(
  input: BuildAdminInvoicePatchInput
): BuildAdminInvoicePatchResult {
  const { baseline, form, nextStatus } = input;

  if (!hasTimestamp(baseline.invoiceRequest.updatedAt)) {
    return { kind: "blocked", reason: "missing_concurrency" };
  }

  if (baseline.order && !hasTimestamp(baseline.order.updatedAt)) {
    return { kind: "blocked", reason: "missing_concurrency" };
  }

  if (
    nextStatus !== NO_STATUS_CHANGE &&
    isIssuanceTransition(nextStatus) &&
    baseline.order === null
  ) {
    return { kind: "blocked", reason: "issuance_requires_order" };
  }

  const invoiceRequest = diffInvoiceRequestFields(baseline, form, nextStatus);
  const order =
    baseline.order != null ? diffOrderFields(baseline, form) : undefined;

  const hasInvoiceRequest =
    Object.keys(invoiceRequest).length > 0;
  const hasOrder = order != null && Object.keys(order).length > 0;

  if (!hasInvoiceRequest && !hasOrder) {
    return { kind: "empty" };
  }

  const payload: AdminInvoicePatchPayload = {
    expectedInvoiceRequestUpdatedAt: baseline.invoiceRequest.updatedAt,
  };

  if (hasInvoiceRequest) {
    payload.invoiceRequest = invoiceRequest;
  }

  if (hasOrder && order) {
    payload.order = order;
  }

  if (baseline.order != null) {
    payload.expectedOrderUpdatedAt = baseline.order.updatedAt!;
  }

  return { kind: "ready", payload };
}
