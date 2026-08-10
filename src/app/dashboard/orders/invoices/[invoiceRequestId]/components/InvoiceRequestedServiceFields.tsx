"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InvoiceEditorValidationErrors } from "@/lib/services/orders/validateInvoiceEditorForm";
import InvoiceFieldError from "./InvoiceFieldError";
import InvoiceFormSection from "./InvoiceFormSection";

interface InvoiceRequestedServiceFieldsProps {
  requestedAmount: string;
  currency: string;
  requestedStartDate: string;
  requestedEndDate: string;
  errors: InvoiceEditorValidationErrors;
  onChange: (
    field:
      | "requestedAmount"
      | "currency"
      | "requestedStartDate"
      | "requestedEndDate",
    value: string
  ) => void;
}

export default function InvoiceRequestedServiceFields({
  requestedAmount,
  currency,
  requestedStartDate,
  requestedEndDate,
  errors,
  onChange,
}: InvoiceRequestedServiceFieldsProps) {
  return (
    <InvoiceFormSection
      title="Requested service"
      description="Requested amount, currency, and service dates on the invoice request. Final order terms may differ when a linked order exists."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="requested-amount">Requested amount</Label>
          <Input
            id="requested-amount"
            inputMode="decimal"
            value={requestedAmount}
            onChange={(event) =>
              onChange("requestedAmount", event.target.value)
            }
            aria-invalid={errors.requestedAmount ? true : undefined}
            aria-describedby={
              errors.requestedAmount ? "requested-amount-error" : undefined
            }
          />
          <InvoiceFieldError
            id="requested-amount-error"
            message={errors.requestedAmount}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requested-currency">Currency</Label>
          <Input
            id="requested-currency"
            value={currency}
            onChange={(event) => onChange("currency", event.target.value)}
            aria-invalid={errors.currency ? true : undefined}
            aria-describedby={
              errors.currency ? "requested-currency-error" : undefined
            }
          />
          <InvoiceFieldError
            id="requested-currency-error"
            message={errors.currency}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requested-start">Requested start date</Label>
          <Input
            id="requested-start"
            type="date"
            value={requestedStartDate}
            onChange={(event) =>
              onChange("requestedStartDate", event.target.value)
            }
            aria-invalid={
              errors.requestedStartDate || errors.requestedDateRange
                ? true
                : undefined
            }
            aria-describedby={
              errors.requestedStartDate || errors.requestedDateRange
                ? "requested-start-error"
                : undefined
            }
          />
          <InvoiceFieldError
            id="requested-start-error"
            message={errors.requestedStartDate ?? errors.requestedDateRange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requested-end">Requested end date</Label>
          <Input
            id="requested-end"
            type="date"
            value={requestedEndDate}
            onChange={(event) =>
              onChange("requestedEndDate", event.target.value)
            }
            aria-invalid={
              errors.requestedEndDate || errors.requestedDateRange
                ? true
                : undefined
            }
            aria-describedby={
              errors.requestedEndDate || errors.requestedDateRange
                ? "requested-end-error"
                : undefined
            }
          />
          <InvoiceFieldError
            id="requested-end-error"
            message={
              errors.requestedEndDate ??
              (errors.requestedDateRange && !errors.requestedStartDate
                ? errors.requestedDateRange
                : undefined)
            }
          />
        </div>
      </div>
    </InvoiceFormSection>
  );
}
