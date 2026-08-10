import { describe, expect, it } from "vitest";
import {
  adminInvoiceDetailQueryKey,
  assertNonEmptyPatchPayload,
  assertValidInvoiceRequestId,
  isAdminInvoiceListQueryKey,
  parseAdminInvoiceAggregate,
  parseAdminInvoiceListResponse,
  parseAdminInvoicePatchResponse,
  serializeAdminInvoiceListParams,
} from "@/lib/services/orders/adminInvoicePayloads";
import {
  makeAggregate,
  makeListResponse,
  makePatchResponse,
} from "@/lib/services/orders/__tests__/fixtures/adminInvoiceFixtures";

describe("serializeAdminInvoiceListParams", () => {
  it("serializes all supported query params", () => {
    const params = serializeAdminInvoiceListParams({
      page: 2,
      pageSize: 50,
      search: "Example & Co",
      status: "invoice_received",
      accountId: 123,
      preset: "outstanding",
      outstanding: true,
      sort: "updatedAt",
      sortDir: "asc",
    });
    expect(params.get("page")).toBe("2");
    expect(params.get("pageSize")).toBe("50");
    expect(params.get("search")).toBe("Example & Co");
    expect(params.get("status")).toBe("invoice_received");
    expect(params.get("accountId")).toBe("123");
    expect(params.get("preset")).toBe("outstanding");
    expect(params.get("outstanding")).toBe("true");
    expect(params.get("sort")).toBe("updatedAt");
    expect(params.get("sortDir")).toBe("asc");
  });

  it("includes boolean false and numeric zero", () => {
    const params = serializeAdminInvoiceListParams({
      page: 0,
      outstanding: false,
    });
    expect(params.get("page")).toBe("0");
    expect(params.get("outstanding")).toBe("false");
  });

  it("omits undefined and empty search", () => {
    const params = serializeAdminInvoiceListParams({
      search: "",
    });
    expect(params.has("search")).toBe(false);
    expect(params.has("page")).toBe(false);
  });

  it("URL-encodes search values", () => {
    const params = serializeAdminInvoiceListParams({ search: "a+b=c" });
    expect(params.toString()).toContain("search=a%2Bb%3Dc");
  });
});

describe("assertValidInvoiceRequestId", () => {
  it("accepts positive numeric ids", () => {
    expect(assertValidInvoiceRequestId(89)).toBe(89);
    expect(assertValidInvoiceRequestId("89")).toBe("89");
  });

  it("rejects invalid ids", () => {
    expect(() => assertValidInvoiceRequestId("")).toThrow(/required/i);
    expect(() => assertValidInvoiceRequestId(0)).toThrow(/positive/i);
    expect(() => assertValidInvoiceRequestId(-1)).toThrow(/positive/i);
  });
});

describe("parseAdminInvoiceListResponse", () => {
  it("parses confirmed list response", () => {
    const parsed = parseAdminInvoiceListResponse(makeListResponse());
    expect(parsed.items).toHaveLength(1);
    expect(parsed.meta.total).toBe(1);
  });

  it("parses data envelope", () => {
    const parsed = parseAdminInvoiceListResponse({
      data: makeListResponse(),
    });
    expect(parsed.items[0].invoiceRequestId).toBe(89);
  });

  it("rejects malformed list response", () => {
    expect(() => parseAdminInvoiceListResponse({ items: [] })).toThrow(
      /Invalid admin invoices list/
    );
    expect(() =>
      parseAdminInvoiceListResponse({
        items: [{ invoiceRequestId: "bad" }],
        meta: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
      })
    ).toThrow(/malformed item row/);
  });
});

describe("parseAdminInvoiceAggregate", () => {
  it("parses aggregate with linked order", () => {
    const parsed = parseAdminInvoiceAggregate(makeAggregate());
    expect(parsed.order?.id).toBe(457);
  });

  it("parses aggregate with order null", () => {
    const parsed = parseAdminInvoiceAggregate(makeAggregate({ order: null }));
    expect(parsed.order).toBeNull();
  });

  it("parses data envelope", () => {
    const parsed = parseAdminInvoiceAggregate({ data: makeAggregate() });
    expect(parsed.invoiceRequest.id).toBe(89);
  });

  it("rejects malformed detail response", () => {
    expect(() => parseAdminInvoiceAggregate({ invoiceRequest: {} })).toThrow(
      /Invalid admin invoice detail/
    );
  });
});

describe("parseAdminInvoicePatchResponse", () => {
  it("parses successful PATCH response", () => {
    const parsed = parseAdminInvoicePatchResponse(makePatchResponse());
    expect(parsed.aggregate.invoiceRequest.status).toBe("invoice_created");
    expect(parsed.changedFields).toContain("invoiceRequest.status");
    expect(parsed.emailStatus).toBe("queued");
  });

  it("tolerates missing emailStatus", () => {
    const { aggregate, changedFields } = makePatchResponse();
    const parsed = parseAdminInvoicePatchResponse({ aggregate, changedFields });
    expect(parsed.emailStatus).toBeUndefined();
  });

  it("parses data envelope", () => {
    const parsed = parseAdminInvoicePatchResponse({
      data: makePatchResponse(),
    });
    expect(parsed.changedFields.length).toBeGreaterThan(0);
  });

  it("rejects malformed PATCH response", () => {
    expect(() => parseAdminInvoicePatchResponse({ aggregate: {} })).toThrow(
      /Invalid admin invoice patch/
    );
  });
});

describe("assertNonEmptyPatchPayload", () => {
  it("requires invoiceRequest or order keys", () => {
    expect(() => assertNonEmptyPatchPayload({})).toThrow(/At least one/);
    expect(() =>
      assertNonEmptyPatchPayload({
        invoiceRequest: { billingEmail: "x@example.com" },
      })
    ).not.toThrow();
  });
});

describe("query keys", () => {
  it("builds stable detail key", () => {
    expect(adminInvoiceDetailQueryKey(89)).toEqual([
      "orders",
      "admin-invoices",
      "detail",
      89,
    ]);
  });

  it("identifies list query keys", () => {
    expect(isAdminInvoiceListQueryKey(["orders", "admin-invoices", {}])).toBe(
      true
    );
    expect(
      isAdminInvoiceListQueryKey(["orders", "admin-invoices", "detail", 1])
    ).toBe(false);
  });
});

describe("fetchAdminInvoices endpoint path", () => {
  it("uses single /orders/admin/invoices path without duplicated api prefix", () => {
    const ENDPOINT = "/orders/admin/invoices";
    const qs = serializeAdminInvoiceListParams({ page: 1 }).toString();
    const url = `${ENDPOINT}${qs ? `?${qs}` : ""}`;
    expect(url).toBe("/orders/admin/invoices?page=1");
    expect(url).not.toContain("/api/api");
  });
});
