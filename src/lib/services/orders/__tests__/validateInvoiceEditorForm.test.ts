import { describe, expect, it } from "vitest";
import { NO_STATUS_CHANGE } from "@/lib/services/orders/buildAdminInvoicePatch";
import { validateInvoiceEditorForm } from "@/lib/services/orders/validateInvoiceEditorForm";
import { makeAggregate } from "@/lib/services/orders/__tests__/fixtures/adminInvoiceFixtures";

describe("validateInvoiceEditorForm", () => {
  const baseline = makeAggregate();

  it("accepts valid form values", () => {
    const result = validateInvoiceEditorForm({
      form: baselineForm(baseline),
      nextStatus: NO_STATUS_CHANGE,
      baseline,
      allowedNextStatuses: ["invoice_created", "declined", "cancelled"],
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("rejects invalid email", () => {
    const result = validateInvoiceEditorForm({
      form: {
        ...baselineForm(baseline),
        billingEmail: "not-an-email",
      },
      nextStatus: NO_STATUS_CHANGE,
      baseline,
      allowedNextStatuses: [],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.billingEmail).toMatch(/valid email/i);
  });

  it("rejects unsupported URL schemes", () => {
    const result = validateInvoiceEditorForm({
      form: {
        ...baselineForm(baseline),
        hostedInvoiceUrl: "ftp://example.com/invoice",
      },
      nextStatus: NO_STATUS_CHANGE,
      baseline,
      allowedNextStatuses: [],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.hostedInvoiceUrl).toMatch(/http/i);
  });

  it("rejects relative URLs", () => {
    const result = validateInvoiceEditorForm({
      form: {
        ...baselineForm(baseline),
        invoicePdfUrl: "/invoices/INV-1.pdf",
      },
      nextStatus: NO_STATUS_CHANGE,
      baseline,
      allowedNextStatuses: [],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.invoicePdfUrl).toMatch(/http/i);
  });

  it("rejects negative amounts", () => {
    const result = validateInvoiceEditorForm({
      form: {
        ...baselineForm(baseline),
        requestedAmount: "-5",
      },
      nextStatus: NO_STATUS_CHANGE,
      baseline,
      allowedNextStatuses: [],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.requestedAmount).toMatch(/negative/i);
  });

  it("rejects invalid currency codes", () => {
    const result = validateInvoiceEditorForm({
      form: {
        ...baselineForm(baseline),
        currency: "AU",
      },
      nextStatus: NO_STATUS_CHANGE,
      baseline,
      allowedNextStatuses: [],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.currency).toMatch(/three-letter/i);
  });

  it("rejects requested start after end", () => {
    const result = validateInvoiceEditorForm({
      form: {
        ...baselineForm(baseline),
        requestedStartDate: "2027-08-01",
        requestedEndDate: "2026-08-01",
      },
      nextStatus: NO_STATUS_CHANGE,
      baseline,
      allowedNextStatuses: [],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.requestedDateRange).toMatch(/start date/i);
  });

  it("rejects order start after end", () => {
    const result = validateInvoiceEditorForm({
      form: {
        ...baselineForm(baseline),
        startAt: "2027-08-01",
        endAt: "2026-08-01",
      },
      nextStatus: NO_STATUS_CHANGE,
      baseline,
      allowedNextStatuses: [],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.orderDateRange).toMatch(/start date/i);
  });

  it("allows empty nullable fields on ordinary save", () => {
    const result = validateInvoiceEditorForm({
      form: {
        ...baselineForm(baseline),
        requestedAmount: "",
        requestedStartDate: "",
        requestedEndDate: "",
        hostedInvoiceUrl: "",
        invoicePdfUrl: "",
      },
      nextStatus: NO_STATUS_CHANGE,
      baseline,
      allowedNextStatuses: [],
    });

    expect(result.isValid).toBe(true);
  });

  describe("create/send gate", () => {
    it("accepts hosted-only URL", () => {
      const result = validateInvoiceEditorForm({
        form: {
          ...baselineForm(baseline),
          hostedInvoiceUrl: "https://example.com/hosted",
          invoicePdfUrl: "",
        },
        nextStatus: "invoice_created",
        baseline,
        allowedNextStatuses: ["invoice_created"],
      });
      expect(result.isValid).toBe(true);
    });

    it("accepts PDF-only URL", () => {
      const result = validateInvoiceEditorForm({
        form: {
          ...baselineForm(baseline),
          hostedInvoiceUrl: "",
          invoicePdfUrl: "https://example.com/inv.pdf",
        },
        nextStatus: "invoice_created",
        baseline,
        allowedNextStatuses: ["invoice_created"],
      });
      expect(result.isValid).toBe(true);
    });

    it("accepts both URLs", () => {
      const result = validateInvoiceEditorForm({
        form: baselineForm(baseline),
        nextStatus: "invoice_created",
        baseline,
        allowedNextStatuses: ["invoice_created"],
      });
      expect(result.isValid).toBe(true);
    });

    it("rejects neither URL", () => {
      const result = validateInvoiceEditorForm({
        form: {
          ...baselineForm(baseline),
          hostedInvoiceUrl: "",
          invoicePdfUrl: "",
        },
        nextStatus: "invoice_created",
        baseline,
        allowedNextStatuses: ["invoice_created"],
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.hostedInvoiceUrl).toMatch(/at least one/i);
    });

    it("rejects empty billing email", () => {
      const result = validateInvoiceEditorForm({
        form: {
          ...baselineForm(baseline),
          billingEmail: "   ",
        },
        nextStatus: "invoice_created",
        baseline,
        allowedNextStatuses: ["invoice_created"],
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.billingEmail).toMatch(/required/i);
    });

    it("rejects missing linked order", () => {
      const noOrder = makeAggregate({ order: null });
      const result = validateInvoiceEditorForm({
        form: baselineForm(noOrder),
        nextStatus: "invoice_created",
        baseline: noOrder,
        allowedNextStatuses: ["invoice_created"],
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.linkedOrder).toMatch(/linked order/i);
    });

    it("accepts existing URL with status-only create transition", () => {
      const result = validateInvoiceEditorForm({
        form: baselineForm(baseline),
        nextStatus: "invoice_created",
        baseline,
        allowedNextStatuses: ["invoice_created"],
      });
      expect(result.isValid).toBe(true);
    });
  });
});

function baselineForm(baseline: ReturnType<typeof makeAggregate>) {
  return {
    billingOrganisationName: baseline.invoiceRequest.billingOrganisationName,
    billingContactName: baseline.invoiceRequest.billingContactName,
    billingEmail: baseline.invoiceRequest.billingEmail,
    requestNotes: baseline.invoiceRequest.requestNotes ?? "",
    requestedStartDate: baseline.invoiceRequest.requestedStartDate ?? "",
    requestedEndDate: baseline.invoiceRequest.requestedEndDate ?? "",
    requestedAmount: baseline.invoiceRequest.requestedAmount?.toString() ?? "",
    currency: baseline.invoiceRequest.currency ?? "",
    invoiceNumber: baseline.order?.invoiceNumber ?? "",
    invoiceDueDate: baseline.order?.invoiceDueDate ?? "",
    hostedInvoiceUrl: baseline.order?.hostedInvoiceUrl ?? "",
    invoicePdfUrl: baseline.order?.invoicePdfUrl ?? "",
    orderTotal: baseline.order?.total?.toString() ?? "",
    orderCurrency: baseline.order?.currency ?? "",
    startAt: baseline.order?.startAt ?? "",
    endAt: baseline.order?.endAt ?? "",
  };
}
