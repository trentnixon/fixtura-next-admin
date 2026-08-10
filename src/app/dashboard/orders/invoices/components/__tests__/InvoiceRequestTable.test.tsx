import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import InvoiceRequestTable from "@/app/dashboard/orders/invoices/components/InvoiceRequestTable";
import type { AdminInvoiceListRow } from "@/types/adminInvoice";

function makeRow(overrides: Partial<AdminInvoiceListRow> = {}): AdminInvoiceListRow {
  return {
    invoiceRequestId: 89,
    status: "invoice_received",
    organisationName: "Example Football Club",
    billingContactName: "Jane Smith",
    billingEmail: "accounts@example.com",
    requestedAmount: null,
    currency: null,
    selectedPlanName: "Club Pass",
    linkedOrderId: null,
    orderCheckoutStatus: null,
    orderPaymentStatus: null,
    invoiceNumber: null,
    submittedAt: null,
    invoiceDueDate: null,
    hasInvoicePdfUrl: false,
    hasHostedInvoiceUrl: false,
    updatedAt: null,
    accountId: 123,
    ...overrides,
  };
}

describe("InvoiceRequestTable", () => {
  it("renders populated table with linked and null-order rows", () => {
    render(
      <InvoiceRequestTable
        items={[
          makeRow({
            linkedOrderId: 457,
            orderCheckoutStatus: "invoice_issued",
            orderPaymentStatus: "unpaid",
            requestedAmount: 650,
            currency: "AUD",
            invoiceNumber: "INV-0042",
            submittedAt: "2026-07-22T01:00:00.000Z",
            invoiceDueDate: "2026-08-22",
            hasHostedInvoiceUrl: true,
            hasInvoicePdfUrl: true,
          }),
          makeRow({ invoiceRequestId: 90, linkedOrderId: null }),
        ]}
      />
    );

    expect(screen.getAllByText("Example Football Club")).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Order #457/i })).toHaveAttribute(
      "href",
      "/dashboard/orders/457"
    );
    expect(screen.getByText("Requires repair.")).toBeInTheDocument();
    expect(screen.getByText("INV-0042")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /View \/ Edit/i })).toHaveLength(2);
  });

  it("shows placeholders for null amount and dates", () => {
    render(<InvoiceRequestTable items={[makeRow()]} />);
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("formats status labels and availability text", () => {
    render(
      <InvoiceRequestTable
        items={[
          makeRow({
            status: "invoice_created",
            hasHostedInvoiceUrl: true,
            hasInvoicePdfUrl: false,
          }),
        ]}
      />
    );

    expect(screen.getByText("Invoice created")).toBeInTheDocument();
    expect(screen.getByText("Hosted invoice available")).toBeInTheDocument();
  });

  it("formats currency amounts safely", () => {
    render(
      <InvoiceRequestTable
        items={[makeRow({ requestedAmount: 650, currency: "AUD" })]}
      />
    );

    expect(screen.getByText(/\$650\.00|A\$650\.00|650/)).toBeInTheDocument();
  });

  it("links detail actions to invoice editor route", () => {
    render(<InvoiceRequestTable items={[makeRow()]} />);
    expect(screen.getByRole("link", { name: /View \/ Edit/i })).toHaveAttribute(
      "href",
      "/dashboard/orders/invoices/89"
    );
  });

  it("uses scroll area with wide table for responsive overflow", () => {
    const { container } = render(<InvoiceRequestTable items={[makeRow()]} />);
    expect(
      container.querySelector("[data-radix-scroll-area-viewport]")
    ).toBeTruthy();
    expect(container.querySelector("table.min-w-\\[1200px\\]")).toBeTruthy();
  });
});
