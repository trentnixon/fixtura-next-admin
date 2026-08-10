import { describe, expect, it } from "vitest";
import {
  formatAdminInvoiceEmailStatus,
  formatInvoiceAmount,
  formatInvoiceAvailabilityLabel,
  formatInvoiceDueDate,
  formatInvoiceRequestStatusLabel,
  getInvoiceStatusBadgeVariant,
  parsePositiveAccountId,
} from "@/app/dashboard/orders/invoices/utils/invoiceQueueFormatters";
import {
  buildInvoiceQueueParams,
  createDefaultInvoiceQueueFilters,
  isUnfilteredInvoiceQueue,
} from "@/app/dashboard/orders/invoices/utils/invoiceQueueParams";

describe("invoiceQueueFormatters", () => {
  it("formats status labels", () => {
    expect(formatInvoiceRequestStatusLabel("invoice_received")).toBe(
      "Invoice received"
    );
    expect(formatInvoiceRequestStatusLabel("invoice_created")).toBe(
      "Invoice created"
    );
    expect(formatInvoiceRequestStatusLabel("under_review")).toBe("Under review");
    expect(formatInvoiceRequestStatusLabel("mystery_status")).toBe(
      "Mystery Status"
    );
  });

  it("maps status badge variants by lifecycle group", () => {
    expect(getInvoiceStatusBadgeVariant("invoice_received")).toBe("new");
    expect(getInvoiceStatusBadgeVariant("invoice_created")).toBe("issued");
    expect(getInvoiceStatusBadgeVariant("paid")).toBe("paid");
    expect(getInvoiceStatusBadgeVariant("declined")).toBe("terminal");
    expect(getInvoiceStatusBadgeVariant("submitted")).toBe("new");
    expect(getInvoiceStatusBadgeVariant("under_review")).toBe("outstanding");
    expect(getInvoiceStatusBadgeVariant("weird")).toBe("unknown");
  });

  it("formats email status messaging", () => {
    expect(formatAdminInvoiceEmailStatus("queued")).toMatch(/queued/i);
    expect(formatAdminInvoiceEmailStatus("not_applicable")).toMatch(/no invoice email/i);
    expect(formatAdminInvoiceEmailStatus("sent")).toBeNull();
  });

  it("formats invoice amounts in major units", () => {
    expect(formatInvoiceAmount(650, "AUD")).toMatch(/650/);
    expect(formatInvoiceAmount(null, "AUD")).toBe("—");
  });

  it("formats due dates without timezone day shift", () => {
    expect(formatInvoiceDueDate("2026-08-22")).toBe("22 Aug 2026");
    expect(formatInvoiceDueDate(null)).toBe("—");
  });

  it("describes hosted and pdf availability", () => {
    expect(formatInvoiceAvailabilityLabel(true, true)).toBe(
      "Hosted invoice and PDF available"
    );
    expect(formatInvoiceAvailabilityLabel(false, false)).toBe("Neither available");
  });

  it("validates positive account IDs", () => {
    expect(parsePositiveAccountId("123")).toBe(123);
    expect(parsePositiveAccountId("0")).toBeUndefined();
    expect(parsePositiveAccountId("-1")).toBeUndefined();
    expect(parsePositiveAccountId("abc")).toBeUndefined();
    expect(parsePositiveAccountId("")).toBeUndefined();
  });
});

describe("invoiceQueueParams", () => {
  it("defaults to outstanding preset and submittedAt desc", () => {
    const filters = createDefaultInvoiceQueueFilters();
    const params = buildInvoiceQueueParams(filters, "");

    expect(params).toEqual({
      page: 1,
      pageSize: 25,
      sort: "submittedAt",
      sortDir: "desc",
      preset: "outstanding",
    });
  });

  it("omits preset when explicit status is selected", () => {
    const filters = {
      ...createDefaultInvoiceQueueFilters(),
      preset: "all" as const,
      status: "invoice_created" as const,
    };

    const params = buildInvoiceQueueParams(filters, "");
    expect(params.status).toBe("invoice_created");
    expect(params.preset).toBeUndefined();
  });

  it("omits preset for all-status preset mode", () => {
    const filters = {
      ...createDefaultInvoiceQueueFilters(),
      preset: "all" as const,
    };

    expect(buildInvoiceQueueParams(filters, "")).not.toHaveProperty("preset");
  });

  it("never sends preset and status together", () => {
    const filters = {
      ...createDefaultInvoiceQueueFilters(),
      preset: "new" as const,
      status: "invoice_received" as const,
    };

    const params = buildInvoiceQueueParams(filters, "");
    expect(params.status).toBe("invoice_received");
    expect(params.preset).toBeUndefined();
  });

  it("trims search and ignores invalid account IDs", () => {
    const filters = {
      ...createDefaultInvoiceQueueFilters(),
      accountIdInput: "abc",
    };

    expect(buildInvoiceQueueParams(filters, "  Example  ")).toMatchObject({
      search: "Example",
    });
    expect(buildInvoiceQueueParams(filters, "Example").accountId).toBeUndefined();
  });

  it("sends sort, direction, page size, and account ID params", () => {
    const filters = {
      ...createDefaultInvoiceQueueFilters(),
      accountIdInput: "123",
      sort: "requestedAmount" as const,
      sortDir: "asc" as const,
      pageSize: 50,
    };

    expect(buildInvoiceQueueParams(filters, "")).toMatchObject({
      accountId: 123,
      sort: "requestedAmount",
      sortDir: "asc",
      pageSize: 50,
    });
  });

  it("detects unfiltered queue state", () => {
    const filters = createDefaultInvoiceQueueFilters();
    expect(isUnfilteredInvoiceQueue(filters, "")).toBe(true);
    expect(isUnfilteredInvoiceQueue(filters, "club")).toBe(false);
  });
});
