import type {
  AdminInvoiceAggregate,
  InvoiceRequestStatus,
} from "@/types/adminInvoice";
import {
  NO_STATUS_CHANGE,
  type InvoiceEditorFormValues,
} from "@/lib/services/orders/buildAdminInvoicePatch";
import { isIssuanceTransition } from "@/lib/services/orders/adminInvoiceTransitions";

export type InvoiceEditorFieldKey = keyof InvoiceEditorFormValues;

export type InvoiceEditorValidationErrors = Partial<
  Record<InvoiceEditorFieldKey | "requestedDateRange" | "orderDateRange" | "linkedOrder", string>
>;

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateDateField(
  value: string,
  label: string
): string | undefined {
  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }
  if (!DATE_ONLY_PATTERN.test(trimmed)) {
    return `${label} must use YYYY-MM-DD format.`;
  }
  return undefined;
}

function validateAmountField(
  value: string,
  label: string
): string | undefined {
  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return `${label} must be a finite number.`;
  }
  if (parsed < 0) {
    return `${label} must not be negative.`;
  }
  return undefined;
}

function validateCurrencyField(
  value: string,
  label: string
): string | undefined {
  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }
  const normalized = trimmed.toUpperCase();
  if (!CURRENCY_PATTERN.test(normalized)) {
    return `${label} must be a three-letter currency code.`;
  }
  return undefined;
}

function compareDateOnly(start: string, end: string): boolean {
  return start <= end;
}

export type ValidateInvoiceEditorFormInput = {
  form: InvoiceEditorFormValues;
  nextStatus: InvoiceRequestStatus | typeof NO_STATUS_CHANGE;
  baseline: AdminInvoiceAggregate;
  allowedNextStatuses: readonly InvoiceRequestStatus[];
};

export function validateInvoiceEditorForm(
  input: ValidateInvoiceEditorFormInput
): { isValid: boolean; errors: InvoiceEditorValidationErrors } {
  const { form, nextStatus, baseline, allowedNextStatuses } = input;
  const errors: InvoiceEditorValidationErrors = {};

  const email = form.billingEmail.trim();
  if (email && !EMAIL_PATTERN.test(email)) {
    errors.billingEmail = "Enter a valid email address.";
  }

  const hostedUrl = form.hostedInvoiceUrl.trim();
  if (hostedUrl && !isValidHttpUrl(hostedUrl)) {
    errors.hostedInvoiceUrl = "URL must use http:// or https://.";
  }

  const pdfUrl = form.invoicePdfUrl.trim();
  if (pdfUrl && !isValidHttpUrl(pdfUrl)) {
    errors.invoicePdfUrl = "URL must use http:// or https://.";
  }

  const requestedAmountError = validateAmountField(
    form.requestedAmount,
    "Requested amount"
  );
  if (requestedAmountError) {
    errors.requestedAmount = requestedAmountError;
  }

  const orderTotalError = validateAmountField(form.orderTotal, "Order total");
  if (orderTotalError) {
    errors.orderTotal = orderTotalError;
  }

  const currencyError = validateCurrencyField(form.currency, "Currency");
  if (currencyError) {
    errors.currency = currencyError;
  }

  const orderCurrencyError = validateCurrencyField(
    form.orderCurrency,
    "Order currency"
  );
  if (orderCurrencyError) {
    errors.orderCurrency = orderCurrencyError;
  }

  const requestedStartError = validateDateField(
    form.requestedStartDate,
    "Requested start date"
  );
  if (requestedStartError) {
    errors.requestedStartDate = requestedStartError;
  }

  const requestedEndError = validateDateField(
    form.requestedEndDate,
    "Requested end date"
  );
  if (requestedEndError) {
    errors.requestedEndDate = requestedEndError;
  }

  const orderStartError = validateDateField(form.startAt, "Order start date");
  if (orderStartError) {
    errors.startAt = orderStartError;
  }

  const orderEndError = validateDateField(form.endAt, "Order end date");
  if (orderEndError) {
    errors.endAt = orderEndError;
  }

  const invoiceDueDateError = validateDateField(
    form.invoiceDueDate,
    "Invoice due date"
  );
  if (invoiceDueDateError) {
    errors.invoiceDueDate = invoiceDueDateError;
  }

  const reqStart = form.requestedStartDate.trim();
  const reqEnd = form.requestedEndDate.trim();
  if (
    reqStart &&
    reqEnd &&
    DATE_ONLY_PATTERN.test(reqStart) &&
    DATE_ONLY_PATTERN.test(reqEnd) &&
    !compareDateOnly(reqStart, reqEnd)
  ) {
    errors.requestedDateRange =
      "Requested start date must not be after requested end date.";
  }

  const orderStart = form.startAt.trim();
  const orderEnd = form.endAt.trim();
  if (
    orderStart &&
    orderEnd &&
    DATE_ONLY_PATTERN.test(orderStart) &&
    DATE_ONLY_PATTERN.test(orderEnd) &&
    !compareDateOnly(orderStart, orderEnd)
  ) {
    errors.orderDateRange =
      "Order start date must not be after order end date.";
  }

  if (
    nextStatus !== NO_STATUS_CHANGE &&
    !allowedNextStatuses.includes(nextStatus)
  ) {
    // Invalid transition — blocked by action availability; keep form soft-valid.
  }

  // Create/send gate: resulting form state must satisfy CMS preconditions.
  if (nextStatus !== NO_STATUS_CHANGE && isIssuanceTransition(nextStatus)) {
    if (baseline.order == null) {
      errors.linkedOrder =
        "A linked order is required before creating an invoice.";
    }

    if (!email) {
      errors.billingEmail = "Billing email is required before creating an invoice.";
    } else if (!EMAIL_PATTERN.test(email)) {
      errors.billingEmail = "Enter a valid email address.";
    }

    const hasValidHosted = hostedUrl.length > 0 && isValidHttpUrl(hostedUrl);
    const hasValidPdf = pdfUrl.length > 0 && isValidHttpUrl(pdfUrl);
    if (!hasValidHosted && !hasValidPdf) {
      if (!hostedUrl && !pdfUrl) {
        errors.hostedInvoiceUrl =
          "Provide at least one invoice URL (hosted or PDF) before creating.";
        errors.invoicePdfUrl =
          "Provide at least one invoice URL (hosted or PDF) before creating.";
      } else if (hostedUrl && !hasValidHosted && !errors.hostedInvoiceUrl) {
        errors.hostedInvoiceUrl = "URL must use http:// or https://.";
      } else if (pdfUrl && !hasValidPdf && !errors.invoicePdfUrl) {
        errors.invoicePdfUrl = "URL must use http:// or https://.";
      }
    }
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
}

export function normalizeInvoiceEditorCurrency(value: string): string {
  return value.trim().toUpperCase();
}

export function isCreateSendValidationReady(
  form: InvoiceEditorFormValues,
  baseline: AdminInvoiceAggregate
): boolean {
  const result = validateInvoiceEditorForm({
    form,
    nextStatus: "invoice_created",
    baseline,
    allowedNextStatuses: ["invoice_created"],
  });
  return result.isValid;
}
