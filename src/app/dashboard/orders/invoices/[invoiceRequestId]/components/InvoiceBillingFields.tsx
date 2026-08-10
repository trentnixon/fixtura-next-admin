"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InvoiceEditorValidationErrors } from "@/lib/services/orders/validateInvoiceEditorForm";
import InvoiceFieldError from "./InvoiceFieldError";
import InvoiceFormSection from "./InvoiceFormSection";

interface InvoiceBillingFieldsProps {
  accountName: string;
  billingOrganisationName: string;
  billingContactName: string;
  billingEmail: string;
  errors: InvoiceEditorValidationErrors;
  onChange: (field: "billingOrganisationName" | "billingContactName" | "billingEmail", value: string) => void;
}

export default function InvoiceBillingFields({
  accountName,
  billingOrganisationName,
  billingContactName,
  billingEmail,
  errors,
  onChange,
}: InvoiceBillingFieldsProps) {
  return (
    <InvoiceFormSection
      title="Billing contact"
      description={`Billing details for ${accountName}. These are the requested billing values on the invoice request.`}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="billing-organisation">Billing organisation</Label>
          <Input
            id="billing-organisation"
            value={billingOrganisationName}
            onChange={(event) =>
              onChange("billingOrganisationName", event.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="billing-contact">Contact name</Label>
          <Input
            id="billing-contact"
            value={billingContactName}
            onChange={(event) =>
              onChange("billingContactName", event.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="billing-email">Billing email</Label>
          <Input
            id="billing-email"
            type="email"
            value={billingEmail}
            onChange={(event) => onChange("billingEmail", event.target.value)}
            aria-invalid={errors.billingEmail ? true : undefined}
            aria-describedby={
              errors.billingEmail ? "billing-email-error" : undefined
            }
          />
          <InvoiceFieldError
            id="billing-email-error"
            message={errors.billingEmail}
          />
        </div>
      </div>
    </InvoiceFormSection>
  );
}
