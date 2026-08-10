import { formatCurrency, formatDate } from "@/utils/chart-formatters";
import type {
  InvoiceRequestStatus,
  InvoiceRequestStatusValue,
} from "@/types/adminInvoice";

export const INVOICE_QUEUE_DEFAULTS = {
  preset: "outstanding" as const,
  page: 1,
  pageSize: 25,
  sort: "submittedAt" as const,
  sortDir: "desc" as const,
};

export type InvoiceQueuePreset =
  | "new"
  | "outstanding"
  | "closed"
  | "all";

const STATUS_LABELS: Record<string, string> = {
  invoice_received: "Invoice received",
  invoice_created: "Invoice created",
  paid: "Paid",
  declined: "Declined",
  cancelled: "Cancelled",
  // Legacy compatibility labels
  submitted: "Submitted",
  under_review: "Under review",
  approved: "Approved",
  sent: "Sent",
  expired: "Expired",
};

export function formatInvoiceRequestStatusLabel(
  status: InvoiceRequestStatusValue
): string {
  if (STATUS_LABELS[status]) {
    return STATUS_LABELS[status];
  }
  return status
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export type InvoiceStatusBadgeVariant =
  | "new"
  | "outstanding"
  | "issued"
  | "paid"
  | "terminal"
  | "unknown";

export function getInvoiceStatusBadgeVariant(
  status: InvoiceRequestStatusValue
): InvoiceStatusBadgeVariant {
  if (status === "invoice_received" || status === "submitted") {
    return "new";
  }
  if (
    status === "under_review" ||
    status === "approved" ||
    status === "sent"
  ) {
    return "outstanding";
  }
  if (status === "invoice_created") {
    return "issued";
  }
  if (status === "paid") {
    return "paid";
  }
  if (
    status === "declined" ||
    status === "cancelled" ||
    status === "expired"
  ) {
    return "terminal";
  }
  return "unknown";
}

export function getInvoiceStatusBadgeClassName(
  variant: InvoiceStatusBadgeVariant
): string {
  switch (variant) {
    case "new":
      return "rounded-full bg-sky-500 text-white border-0";
    case "outstanding":
      return "rounded-full bg-amber-500 text-white border-0";
    case "issued":
      return "rounded-full bg-indigo-500 text-white border-0";
    case "paid":
      return "rounded-full bg-emerald-500 text-white border-0";
    case "terminal":
      return "rounded-full bg-slate-500 text-white border-0";
    case "unknown":
      return "rounded-full bg-slate-300 text-slate-800 border-0";
    default:
      return "rounded-full";
  }
}

export function formatInvoiceAmount(
  amount: number | null | undefined,
  currency: string | null | undefined
): string {
  if (amount == null || !Number.isFinite(amount)) {
    return "—";
  }

  return formatCurrency(amount, currency ?? "AUD");
}

export function formatInvoiceTimestamp(
  value: string | null | undefined
): string {
  if (!value) {
    return "—";
  }

  return formatDate(value, "—");
}

/** Date-only CMS field (YYYY-MM-DD) without timezone day shift. */
export function formatInvoiceDueDate(
  value: string | null | undefined
): string {
  if (!value) {
    return "—";
  }

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  return formatDate(value, "—");
}

export function formatInvoiceAvailabilityLabel(
  hasHostedInvoiceUrl: boolean,
  hasInvoicePdfUrl: boolean
): string {
  if (hasHostedInvoiceUrl && hasInvoicePdfUrl) {
    return "Hosted invoice and PDF available";
  }
  if (hasHostedInvoiceUrl) {
    return "Hosted invoice available";
  }
  if (hasInvoicePdfUrl) {
    return "PDF available";
  }
  return "Neither available";
}

export function parsePositiveAccountId(
  value: string
): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

export function hasActiveInvoiceQueueFilters(input: {
  preset: InvoiceQueuePreset;
  search: string;
  status?: InvoiceRequestStatus;
  accountIdInput: string;
  sort: FetchAdminInvoicesSort;
  sortDir: FetchAdminInvoicesSortDir;
  pageSize: number;
}): boolean {
  return (
    input.preset !== INVOICE_QUEUE_DEFAULTS.preset ||
    input.search.trim().length > 0 ||
    input.status != null ||
    parsePositiveAccountId(input.accountIdInput) != null ||
    input.sort !== INVOICE_QUEUE_DEFAULTS.sort ||
    input.sortDir !== INVOICE_QUEUE_DEFAULTS.sortDir ||
    input.pageSize !== INVOICE_QUEUE_DEFAULTS.pageSize
  );
}

export type FetchAdminInvoicesSort =
  | "submittedAt"
  | "updatedAt"
  | "requestedAmount"
  | "status";

export type FetchAdminInvoicesSortDir = "asc" | "desc";

/** Human-readable order checkout/payment/channel labels (matches queue table). */
export function formatInvoiceOrderStatusLabel(
  value: string | null | undefined
): string {
  if (!value) {
    return "—";
  }

  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function formatBooleanLabel(value: boolean): string {
  return value ? "Yes" : "No";
}

export function formatAdminInvoiceEmailStatus(
  status: string | null | undefined
): string | null {
  if (status === "queued") {
    return "Invoice email queued for delivery.";
  }
  if (status === "not_applicable") {
    return "No invoice email was queued for this save.";
  }
  return null;
}
