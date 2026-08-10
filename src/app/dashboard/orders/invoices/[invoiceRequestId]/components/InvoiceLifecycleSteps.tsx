"use client";

import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InvoiceRequestStatusValue } from "@/types/adminInvoice";
import {
  formatInvoiceLifecycleStepStateLabel,
  getInvoiceLifecycleStepStates,
  type InvoiceLifecycleStepState,
} from "@/lib/services/orders/invoiceLifecycleSteps";
import { formatInvoiceRequestStatusLabel } from "../../utils/invoiceQueueFormatters";

interface InvoiceLifecycleStepsProps {
  currentStatus: InvoiceRequestStatusValue;
}

function stepTileClassName(state: InvoiceLifecycleStepState): string {
  switch (state) {
    case "current":
      return "border-brandPrimary-300 bg-brandPrimary-50 text-brandPrimary-800";
    case "complete":
      return "border-slate-200 bg-white text-slate-800";
    case "abandoned":
      return "border-slate-200 bg-slate-50 text-slate-400";
    case "upcoming":
    default:
      return "border-slate-200 text-slate-700";
  }
}

/**
 * Read-only happy-path workflow strip — Received → Created → Paid
 */
export default function InvoiceLifecycleSteps({
  currentStatus,
}: InvoiceLifecycleStepsProps) {
  const { steps, terminalOverride } = getInvoiceLifecycleStepStates(
    currentStatus
  );

  const displaySteps = terminalOverride
    ? [
        ...steps,
        {
          status: terminalOverride,
          state: "current" as const,
        },
      ]
    : steps;

  return (
    <div
      className="grid grid-cols-1 gap-2 sm:grid-cols-3"
      data-testid="invoice-lifecycle-steps"
      aria-label="Invoice request lifecycle"
    >
      {displaySteps.map((step, index) => {
        const isLast = index === displaySteps.length - 1;
        const label = formatInvoiceRequestStatusLabel(step.status);
        const stateLabel = formatInvoiceLifecycleStepStateLabel(step.state);

        return (
          <div
            className={cn(
              "flex items-center gap-3 rounded-md border px-3 py-2",
              stepTileClassName(step.state)
            )}
            key={`${step.status}-${step.state}-${index}`}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-800 shadow-sm">
              {step.state === "complete" ? (
                <Check className="h-3.5 w-3.5" aria-hidden />
              ) : (
                index + 1
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{label}</div>
              <div className="text-xs opacity-75">{stateLabel}</div>
            </div>
            {!isLast && (
              <ChevronRight className="hidden h-4 w-4 shrink-0 text-slate-400 sm:block" />
            )}
          </div>
        );
      })}
    </div>
  );
}
