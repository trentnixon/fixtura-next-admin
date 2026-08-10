import { describe, expect, it } from "vitest";
import {
  aggregateToFormValues,
  buildAdminInvoicePatch,
  NO_STATUS_CHANGE,
} from "@/lib/services/orders/buildAdminInvoicePatch";
import { makeAggregate } from "@/lib/services/orders/__tests__/fixtures/adminInvoiceFixtures";

describe("buildAdminInvoicePatch", () => {
  const baseline = makeAggregate();

  it("returns empty when nothing changed", () => {
    const form = aggregateToFormValues(baseline);
    const result = buildAdminInvoicePatch({
      baseline,
      form,
      nextStatus: NO_STATUS_CHANGE,
    });
    expect(result).toEqual({ kind: "empty" });
  });

  it("builds invoice-request-only update", () => {
    const form = {
      ...aggregateToFormValues(baseline),
      billingContactName: "Updated Name",
    };
    const result = buildAdminInvoicePatch({
      baseline,
      form,
      nextStatus: NO_STATUS_CHANGE,
    });
    expect(result.kind).toBe("ready");
    if (result.kind === "ready") {
      expect(result.payload.invoiceRequest?.billingContactName).toBe(
        "Updated Name"
      );
      expect(result.payload.order).toBeUndefined();
    }
  });

  it("builds order-only update", () => {
    const form = {
      ...aggregateToFormValues(baseline),
      invoiceNumber: "INV-9999",
    };
    const result = buildAdminInvoicePatch({ baseline, form, nextStatus: NO_STATUS_CHANGE });
    expect(result.kind).toBe("ready");
    if (result.kind === "ready") {
      expect(result.payload.order?.invoiceNumber).toBe("INV-9999");
    }
  });

  it("builds status-only update", () => {
    const form = aggregateToFormValues(baseline);
    const result = buildAdminInvoicePatch({
      baseline,
      form,
      nextStatus: "invoice_created",
    });
    expect(result.kind).toBe("ready");
    if (result.kind === "ready") {
      expect(result.payload.invoiceRequest?.status).toBe("invoice_created");
      expect(result.payload.order).toBeUndefined();
      expect(result.payload.expectedOrderUpdatedAt).toBe(
        baseline.order!.updatedAt
      );
      expect(result.payload.order).toBeUndefined();
      expect(
        (result.payload.order as Record<string, unknown> | undefined)
          ?.checkoutStatus
      ).toBeUndefined();
    }
  });

  it("builds mark-paid status-only payload without CMS-owned order flags", () => {
    const created = makeAggregate({
      invoiceRequest: { status: "invoice_created" },
    });
    const result = buildAdminInvoicePatch({
      baseline: created,
      form: aggregateToFormValues(created),
      nextStatus: "paid",
    });
    expect(result.kind).toBe("ready");
    if (result.kind === "ready") {
      expect(result.payload).toEqual({
        invoiceRequest: { status: "paid" },
        expectedInvoiceRequestUpdatedAt: created.invoiceRequest.updatedAt,
        expectedOrderUpdatedAt: created.order!.updatedAt,
      });
    }
  });

  it("normalizes blank optional URLs to null", () => {
    const form = {
      ...aggregateToFormValues(baseline),
      hostedInvoiceUrl: "   ",
    };
    const result = buildAdminInvoicePatch({
      baseline,
      form,
      nextStatus: NO_STATUS_CHANGE,
    });
    expect(result.kind).toBe("ready");
    if (result.kind === "ready") {
      expect(result.payload.order?.hostedInvoiceUrl).toBeNull();
    }
  });

  it("omits unchanged status and fields", () => {
    const form = aggregateToFormValues(baseline);
    const result = buildAdminInvoicePatch({
      baseline,
      form,
      nextStatus: "invoice_received",
    });
    expect(result).toEqual({ kind: "empty" });
  });

  it("sends null for cleared nullable fields", () => {
    const form = {
      ...aggregateToFormValues(baseline),
      requestNotes: "",
    };
    const result = buildAdminInvoicePatch({
      baseline,
      form,
      nextStatus: NO_STATUS_CHANGE,
    });
    expect(result.kind).toBe("ready");
    if (result.kind === "ready") {
      expect(result.payload.invoiceRequest?.requestNotes).toBeNull();
    }
  });

  it("blocks when invoice-request timestamp missing", () => {
    const missingTs = makeAggregate({
      invoiceRequest: { updatedAt: null },
    });
    const result = buildAdminInvoicePatch({
      baseline: missingTs,
      form: {
        ...aggregateToFormValues(missingTs),
        billingEmail: "new@example.com",
      },
      nextStatus: NO_STATUS_CHANGE,
    });
    expect(result).toEqual({ kind: "blocked", reason: "missing_concurrency" });
  });

  it("blocks when linked-order timestamp missing", () => {
    const order = makeAggregate().order!;
    const missingOrderTs = makeAggregate({
      order: { ...order, updatedAt: null },
    });
    const result = buildAdminInvoicePatch({
      baseline: missingOrderTs,
      form: {
        ...aggregateToFormValues(missingOrderTs),
        invoiceNumber: "INV-0001",
      },
      nextStatus: NO_STATUS_CHANGE,
    });
    expect(result).toEqual({ kind: "blocked", reason: "missing_concurrency" });
  });

  it("blocks issuance without linked order", () => {
    const noOrder = makeAggregate({ order: null });
    const result = buildAdminInvoicePatch({
      baseline: noOrder,
      form: aggregateToFormValues(noOrder),
      nextStatus: "invoice_created",
    });
    expect(result).toEqual({ kind: "blocked", reason: "issuance_requires_order" });
  });

  it("includes both concurrency timestamps for linked-order save", () => {
    const form = {
      ...aggregateToFormValues(baseline),
      invoiceNumber: "INV-NEW",
    };
    const result = buildAdminInvoicePatch({
      baseline,
      form,
      nextStatus: NO_STATUS_CHANGE,
    });
    expect(result.kind).toBe("ready");
    if (result.kind === "ready") {
      expect(result.payload.expectedInvoiceRequestUpdatedAt).toBe(
        baseline.invoiceRequest.updatedAt
      );
      expect(result.payload.expectedOrderUpdatedAt).toBe(
        baseline.order!.updatedAt
      );
    }
  });

  it("includes only invoice-request timestamp when order is null", () => {
    const noOrder = makeAggregate({ order: null });
    const form = {
      ...aggregateToFormValues(noOrder),
      billingEmail: "changed@example.com",
    };
    const result = buildAdminInvoicePatch({
      baseline: noOrder,
      form,
      nextStatus: NO_STATUS_CHANGE,
    });
    expect(result.kind).toBe("ready");
    if (result.kind === "ready") {
      expect(result.payload.expectedInvoiceRequestUpdatedAt).toBeTruthy();
      expect(result.payload.expectedOrderUpdatedAt).toBeUndefined();
    }
  });
});
