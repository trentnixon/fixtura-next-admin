import type { AdminInvoiceAggregate, InvoiceRequestStatus } from "@/types/adminInvoice";
import {
  aggregateToFormValues,
  NO_STATUS_CHANGE,
  type InvoiceEditorFormValues,
} from "@/lib/services/orders/buildAdminInvoicePatch";
import { getAllowedNextStatusesForAggregate } from "@/lib/services/orders/adminInvoiceTransitions";

export type InvoiceEditorDirtyState = {
  dirtyFormKeys: readonly (keyof InvoiceEditorFormValues)[];
  dirtyNextStatus: InvoiceRequestStatus | null;
};

const FORM_KEYS = [
  "billingOrganisationName",
  "billingContactName",
  "billingEmail",
  "requestNotes",
  "requestedStartDate",
  "requestedEndDate",
  "requestedAmount",
  "currency",
  "invoiceNumber",
  "invoiceDueDate",
  "hostedInvoiceUrl",
  "invoicePdfUrl",
  "orderTotal",
  "orderCurrency",
  "startAt",
  "endAt",
] as const satisfies readonly (keyof InvoiceEditorFormValues)[];

/** Snapshot of user-edited fields relative to the baseline at save/conflict time. */
export function collectInvoiceEditorDirtyState(
  baseline: AdminInvoiceAggregate,
  form: InvoiceEditorFormValues,
  nextStatus: InvoiceRequestStatus | typeof NO_STATUS_CHANGE
): InvoiceEditorDirtyState {
  const baselineForm = aggregateToFormValues(baseline);
  const dirtyFormKeys = FORM_KEYS.filter((key) => form[key] !== baselineForm[key]);

  const dirtyNextStatus =
    nextStatus !== NO_STATUS_CHANGE &&
    nextStatus !== baseline.invoiceRequest.status
      ? nextStatus
      : null;

  return { dirtyFormKeys, dirtyNextStatus };
}

/**
 * After a stale conflict, refresh baseline from CMS and reapply only fields
 * the user originally edited. Preserves unrelated server-side changes.
 */
export function reapplyDirtyInvoiceEditorFields(input: {
  serverSnapshot: AdminInvoiceAggregate;
  dirtyState: InvoiceEditorDirtyState;
  userFormAtConflict: InvoiceEditorFormValues;
}): {
  form: InvoiceEditorFormValues;
  nextStatus: InvoiceRequestStatus | typeof NO_STATUS_CHANGE;
} {
  const { serverSnapshot, dirtyState, userFormAtConflict } = input;
  const form = aggregateToFormValues(serverSnapshot);

  for (const key of dirtyState.dirtyFormKeys) {
    form[key] = userFormAtConflict[key];
  }

  let nextStatus: InvoiceRequestStatus | typeof NO_STATUS_CHANGE =
    NO_STATUS_CHANGE;

  if (dirtyState.dirtyNextStatus != null) {
    const allowed = getAllowedNextStatusesForAggregate(
      serverSnapshot.invoiceRequest.status,
      serverSnapshot.order != null
    );
    if (allowed.includes(dirtyState.dirtyNextStatus)) {
      nextStatus = dirtyState.dirtyNextStatus;
    }
  }

  return { form, nextStatus };
}
