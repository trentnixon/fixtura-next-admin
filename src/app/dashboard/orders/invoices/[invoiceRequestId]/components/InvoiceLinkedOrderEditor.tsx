"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminInvoiceOrderDto } from "@/types/adminInvoice";
import type { InvoiceEditorValidationErrors } from "@/lib/services/orders/validateInvoiceEditorForm";
import InvoiceFieldError from "./InvoiceFieldError";
import InvoiceFormSection from "./InvoiceFormSection";

interface InvoiceLinkedOrderEditorProps {
  order: AdminInvoiceOrderDto;
  invoiceNumber: string;
  invoiceDueDate: string;
  hostedInvoiceUrl: string;
  invoicePdfUrl: string;
  orderTotal: string;
  orderCurrency: string;
  startAt: string;
  endAt: string;
  errors: InvoiceEditorValidationErrors;
  onChange: (
    field:
      | "invoiceNumber"
      | "invoiceDueDate"
      | "hostedInvoiceUrl"
      | "invoicePdfUrl"
      | "orderTotal"
      | "orderCurrency"
      | "startAt"
      | "endAt",
    value: string
  ) => void;
}

export default function InvoiceLinkedOrderEditor({
  order,
  invoiceNumber,
  invoiceDueDate,
  hostedInvoiceUrl,
  invoicePdfUrl,
  orderTotal,
  orderCurrency,
  startAt,
  endAt,
  errors,
  onChange,
}: InvoiceLinkedOrderEditorProps) {
  return (
    <>
      <InvoiceFormSection
        title="Linked order — invoice metadata"
        description={`Editable invoice metadata for order #${order.id}.`}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="invoice-number">Invoice number</Label>
            <Input
              id="invoice-number"
              value={invoiceNumber}
              onChange={(event) =>
                onChange("invoiceNumber", event.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoice-due-date">Invoice due date</Label>
            <Input
              id="invoice-due-date"
              type="date"
              value={invoiceDueDate}
              onChange={(event) =>
                onChange("invoiceDueDate", event.target.value)
              }
              aria-invalid={errors.invoiceDueDate ? true : undefined}
              aria-describedby={
                errors.invoiceDueDate ? "invoice-due-date-error" : undefined
              }
            />
            <InvoiceFieldError
              id="invoice-due-date-error"
              message={errors.invoiceDueDate}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="hosted-invoice-url">Hosted invoice URL</Label>
            <Input
              id="hosted-invoice-url"
              value={hostedInvoiceUrl}
              onChange={(event) =>
                onChange("hostedInvoiceUrl", event.target.value)
              }
              className="min-w-0 break-all"
              aria-invalid={errors.hostedInvoiceUrl ? true : undefined}
              aria-describedby={
                errors.hostedInvoiceUrl
                  ? "hosted-invoice-url-error"
                  : undefined
              }
            />
            <InvoiceFieldError
              id="hosted-invoice-url-error"
              message={errors.hostedInvoiceUrl}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="invoice-pdf-url">Invoice PDF URL</Label>
            <Input
              id="invoice-pdf-url"
              value={invoicePdfUrl}
              onChange={(event) =>
                onChange("invoicePdfUrl", event.target.value)
              }
              className="min-w-0 break-all"
              aria-invalid={errors.invoicePdfUrl ? true : undefined}
              aria-describedby={
                errors.invoicePdfUrl ? "invoice-pdf-url-error" : undefined
              }
            />
            <InvoiceFieldError
              id="invoice-pdf-url-error"
              message={errors.invoicePdfUrl}
            />
          </div>
        </div>
      </InvoiceFormSection>

      <InvoiceFormSection
        title="Final order terms"
        description="Final total, currency, and service dates on the linked order. These may differ from requested values on the invoice request."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="order-total">Order total</Label>
            <Input
              id="order-total"
              inputMode="decimal"
              value={orderTotal}
              onChange={(event) => onChange("orderTotal", event.target.value)}
              aria-invalid={errors.orderTotal ? true : undefined}
              aria-describedby={
                errors.orderTotal ? "order-total-error" : undefined
              }
            />
            <InvoiceFieldError
              id="order-total-error"
              message={errors.orderTotal}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order-currency">Order currency</Label>
            <Input
              id="order-currency"
              value={orderCurrency}
              onChange={(event) => onChange("orderCurrency", event.target.value)}
              aria-invalid={errors.orderCurrency ? true : undefined}
              aria-describedby={
                errors.orderCurrency ? "order-currency-error" : undefined
              }
            />
            <InvoiceFieldError
              id="order-currency-error"
              message={errors.orderCurrency}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order-start">Order start date</Label>
            <Input
              id="order-start"
              type="date"
              value={startAt}
              onChange={(event) => onChange("startAt", event.target.value)}
              aria-invalid={
                errors.startAt || errors.orderDateRange ? true : undefined
              }
              aria-describedby={
                errors.startAt || errors.orderDateRange
                  ? "order-start-error"
                  : undefined
              }
            />
            <InvoiceFieldError
              id="order-start-error"
              message={errors.startAt ?? errors.orderDateRange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order-end">Order end date</Label>
            <Input
              id="order-end"
              type="date"
              value={endAt}
              onChange={(event) => onChange("endAt", event.target.value)}
              aria-invalid={
                errors.endAt || errors.orderDateRange ? true : undefined
              }
              aria-describedby={
                errors.endAt || errors.orderDateRange
                  ? "order-end-error"
                  : undefined
              }
            />
            <InvoiceFieldError
              id="order-end-error"
              message={
                errors.endAt ??
                (errors.orderDateRange && !errors.startAt
                  ? errors.orderDateRange
                  : undefined)
              }
            />
          </div>
        </div>
      </InvoiceFormSection>
    </>
  );
}
