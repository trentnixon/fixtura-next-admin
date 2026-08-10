import type {
  InvoiceRequestStatus,
  InvoiceRequestStatusValue,
  LegacyInvoiceRequestStatus,
} from "@/types/adminInvoice";

/** Permanent statuses used for staff filters and the simplified FSM. */
export const INVOICE_REQUEST_STATUSES = [
  "invoice_received",
  "invoice_created",
  "paid",
  "declined",
  "cancelled",
] as const satisfies readonly InvoiceRequestStatus[];

/** Legacy statuses kept only for safe labels / compatibility rendering. */
export const LEGACY_INVOICE_REQUEST_STATUSES = [
  "submitted",
  "under_review",
  "approved",
  "sent",
  "expired",
] as const satisfies readonly LegacyInvoiceRequestStatus[];

const PERMANENT_STATUS_SET: ReadonlySet<string> = new Set(
  INVOICE_REQUEST_STATUSES
);
const LEGACY_STATUS_SET: ReadonlySet<string> = new Set(
  LEGACY_INVOICE_REQUEST_STATUSES
);

/** Forward-only CMS FSM for the simplified lifecycle. */
const ALLOWED_NEXT: Record<InvoiceRequestStatus, readonly InvoiceRequestStatus[]> =
  {
    invoice_received: ["invoice_created", "declined", "cancelled"],
    invoice_created: ["paid", "cancelled"],
    paid: [],
    declined: [],
    cancelled: [],
  };

const TERMINAL_STATUSES: ReadonlySet<string> = new Set([
  "paid",
  "declined",
  "cancelled",
  "expired",
]);

export function isPermanentInvoiceStatus(
  status: string
): status is InvoiceRequestStatus {
  return PERMANENT_STATUS_SET.has(status);
}

export function isLegacyInvoiceStatus(
  status: string
): status is LegacyInvoiceRequestStatus {
  return LEGACY_STATUS_SET.has(status);
}

export function isKnownInvoiceStatus(
  status: string
): status is InvoiceRequestStatus | LegacyInvoiceRequestStatus {
  return isPermanentInvoiceStatus(status) || isLegacyInvoiceStatus(status);
}

/** Allowed forward-only next statuses. Unknown/legacy → empty (no invented transitions). */
export function getAllowedNextStatuses(
  current: InvoiceRequestStatusValue
): readonly InvoiceRequestStatus[] {
  if (!isPermanentInvoiceStatus(current)) {
    return [];
  }
  return ALLOWED_NEXT[current] ?? [];
}

/** Whether a proposed transition is valid (same status is always invalid). */
export function isValidTransition(
  from: InvoiceRequestStatusValue,
  to: InvoiceRequestStatusValue
): boolean {
  if (from === to || !isPermanentInvoiceStatus(to)) {
    return false;
  }
  return getAllowedNextStatuses(from).includes(to);
}

/** Whether the status has no further lifecycle transitions. */
export function isTerminalInvoiceStatus(
  status: InvoiceRequestStatusValue
): boolean {
  return TERMINAL_STATUSES.has(status);
}

/** Whether transitioning to this status triggers invoice issuance side effects. */
export function isIssuanceTransition(
  status: InvoiceRequestStatusValue
): boolean {
  return status === "invoice_created";
}

export function isMarkPaidTransition(
  status: InvoiceRequestStatusValue
): boolean {
  return status === "paid";
}

export function isExitTransition(status: InvoiceRequestStatusValue): boolean {
  return status === "declined" || status === "cancelled";
}

/** Allowed next statuses, excluding issuance/paid when no linked order exists. */
export function getAllowedNextStatusesForAggregate(
  current: InvoiceRequestStatusValue,
  hasLinkedOrder: boolean
): readonly InvoiceRequestStatus[] {
  const allowed = getAllowedNextStatuses(current);
  if (hasLinkedOrder) {
    return allowed;
  }
  return allowed.filter(
    (status) => !isIssuanceTransition(status) && !isMarkPaidTransition(status)
  );
}

export function canCreateSendInvoice(
  current: InvoiceRequestStatusValue,
  hasLinkedOrder: boolean
): boolean {
  return (
    hasLinkedOrder &&
    isPermanentInvoiceStatus(current) &&
    isValidTransition(current, "invoice_created")
  );
}

export function canMarkInvoicePaid(
  current: InvoiceRequestStatusValue,
  hasLinkedOrder: boolean
): boolean {
  return (
    hasLinkedOrder &&
    isPermanentInvoiceStatus(current) &&
    isValidTransition(current, "paid")
  );
}

export function canDeclineInvoice(
  current: InvoiceRequestStatusValue
): boolean {
  return isValidTransition(current, "declined");
}

export function canCancelInvoice(current: InvoiceRequestStatusValue): boolean {
  return isValidTransition(current, "cancelled");
}
