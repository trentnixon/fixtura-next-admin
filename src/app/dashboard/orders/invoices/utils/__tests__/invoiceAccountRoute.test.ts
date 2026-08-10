import { describe, expect, it } from "vitest";
import { getInvoiceAccountRoute } from "@/app/dashboard/orders/invoices/utils/invoiceAccountRoute";

describe("getInvoiceAccountRoute", () => {
  it("routes Club accounts to club detail", () => {
    expect(getInvoiceAccountRoute(123, "Club")).toBe(
      "/dashboard/accounts/club/123"
    );
  });

  it("routes Association accounts to association detail", () => {
    expect(getInvoiceAccountRoute(456, "Association")).toBe(
      "/dashboard/accounts/association/456"
    );
  });

  it("is case-insensitive for Association", () => {
    expect(getInvoiceAccountRoute(7, " ASSOCIATION ")).toBe(
      "/dashboard/accounts/association/7"
    );
  });

  it("falls back to club when type is null", () => {
    expect(getInvoiceAccountRoute(99, null)).toBe(
      "/dashboard/accounts/club/99"
    );
  });

  it("falls back to club for unrecognized types", () => {
    expect(getInvoiceAccountRoute(99, "Unknown")).toBe(
      "/dashboard/accounts/club/99"
    );
  });
});
