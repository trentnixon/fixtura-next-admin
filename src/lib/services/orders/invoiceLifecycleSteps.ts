import type {
  InvoiceRequestStatus,
  InvoiceRequestStatusValue,
} from "@/types/adminInvoice";
import { isTerminalInvoiceStatus } from "@/lib/services/orders/adminInvoiceTransitions";

/** Linear happy-path statuses for the lifecycle workflow strip. */
export const INVOICE_HAPPY_PATH_STEPS = [
  "invoice_received",
  "invoice_created",
  "paid",
] as const satisfies readonly InvoiceRequestStatus[];

export type InvoiceHappyPathStatus = (typeof INVOICE_HAPPY_PATH_STEPS)[number];

export type InvoiceLifecycleStepState =
  | "complete"
  | "current"
  | "upcoming"
  | "abandoned";

export type InvoiceLifecycleStep = {
  status: InvoiceRequestStatus;
  state: InvoiceLifecycleStepState;
};

export type InvoiceLifecycleStepModel = {
  steps: InvoiceLifecycleStep[];
  /** Branch terminal shown as a trailing Current chip when not on the happy path. */
  terminalOverride: InvoiceRequestStatusValue | null;
};

const BRANCH_TERMINALS: ReadonlySet<string> = new Set([
  "declined",
  "cancelled",
  "expired",
]);

function isHappyPathStatus(
  status: InvoiceRequestStatusValue
): status is InvoiceHappyPathStatus {
  return (INVOICE_HAPPY_PATH_STEPS as readonly string[]).includes(status);
}

/**
 * Derive read-only workflow-step states from the current invoice request status.
 * Branch terminals and unknown/legacy values abandon the happy path.
 */
export function getInvoiceLifecycleStepStates(
  current: InvoiceRequestStatusValue
): InvoiceLifecycleStepModel {
  if (BRANCH_TERMINALS.has(current) || !isHappyPathStatus(current)) {
    return {
      steps: INVOICE_HAPPY_PATH_STEPS.map((status) => ({
        status,
        state: "abandoned" as const,
      })),
      terminalOverride: isTerminalInvoiceStatus(current) ? current : current,
    };
  }

  const currentIndex = INVOICE_HAPPY_PATH_STEPS.indexOf(current);

  return {
    steps: INVOICE_HAPPY_PATH_STEPS.map((status, index) => {
      if (index < currentIndex) {
        return { status, state: "complete" as const };
      }
      if (index === currentIndex) {
        return { status, state: "current" as const };
      }
      return { status, state: "upcoming" as const };
    }),
    terminalOverride: null,
  };
}

export function formatInvoiceLifecycleStepStateLabel(
  state: InvoiceLifecycleStepState
): string {
  switch (state) {
    case "complete":
      return "Complete";
    case "current":
      return "Current";
    case "upcoming":
      return "Upcoming";
    case "abandoned":
      return "Abandoned";
  }
}
