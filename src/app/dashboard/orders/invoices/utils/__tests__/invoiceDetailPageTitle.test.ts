import { describe, expect, it } from "vitest";
import { makeAggregate } from "@/lib/services/orders/__tests__/fixtures/adminInvoiceFixtures";
import {
  getInvoiceDetailOrganisationName,
  getInvoiceDetailPageTitleCopy,
} from "@/app/dashboard/orders/invoices/utils/invoiceDetailPageTitle";

describe("getInvoiceDetailOrganisationName", () => {
  it("prefers billing organisation name", () => {
    expect(getInvoiceDetailOrganisationName(makeAggregate(), "89")).toBe(
      "Example Football Club"
    );
  });

  it("falls back to account name when billing org is blank", () => {
    const aggregate = makeAggregate({
      invoiceRequest: { billingOrganisationName: "   " },
      account: { name: "Fallback Account" },
    });
    expect(getInvoiceDetailOrganisationName(aggregate, "89")).toBe(
      "Fallback Account"
    );
  });

  it("falls back to request title when both names are blank", () => {
    const aggregate = makeAggregate({
      invoiceRequest: { billingOrganisationName: "" },
      account: { name: "" },
    });
    expect(getInvoiceDetailOrganisationName(aggregate, "89")).toBe(
      "Invoice Request #89"
    );
  });
});

describe("getInvoiceDetailPageTitleCopy", () => {
  it("uses org name and status when loaded", () => {
    expect(
      getInvoiceDetailPageTitleCopy({
        invoiceRequestId: "89",
        data: makeAggregate(),
        isLoading: false,
        isNotFound: false,
        isError: false,
      })
    ).toEqual({
      title: "Example Football Club",
      byLine: "Invoice received",
      byLineBottom: "Invoice request #89",
    });
  });

  it("uses loading byline while fetching", () => {
    expect(
      getInvoiceDetailPageTitleCopy({
        invoiceRequestId: "89",
        isLoading: true,
        isNotFound: false,
        isError: false,
      })
    ).toEqual({
      title: "Invoice Request #89",
      byLine: "Loading invoice…",
    });
  });

  it("uses not-found byline for 404", () => {
    expect(
      getInvoiceDetailPageTitleCopy({
        invoiceRequestId: "89",
        isLoading: false,
        isNotFound: true,
        isError: true,
      })
    ).toEqual({
      title: "Invoice Request #89",
      byLine: "Invoice request not found",
    });
  });

  it("uses error byline for non-404 errors", () => {
    expect(
      getInvoiceDetailPageTitleCopy({
        invoiceRequestId: "89",
        isLoading: false,
        isNotFound: false,
        isError: true,
      })
    ).toEqual({
      title: "Invoice Request #89",
      byLine: "Error loading invoice",
    });
  });
});
