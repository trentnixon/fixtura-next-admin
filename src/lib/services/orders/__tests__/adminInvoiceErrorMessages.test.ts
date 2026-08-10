import { describe, expect, it } from "vitest";
import { getAdminInvoiceErrorPresentation } from "@/lib/services/orders/adminInvoiceErrorMessages";
import {
  CmsApiError,
  toCmsApiErrorDTO,
} from "@/lib/services/utils/cms-api-error";

describe("getAdminInvoiceErrorPresentation", () => {
  it("maps stale conflicts to review messaging", () => {
    const presentation = getAdminInvoiceErrorPresentation(
      new CmsApiError({
        message: "stale",
        status: 409,
        cmsCode: "STALE_INVOICE_REQUEST",
      })
    );
    expect(presentation.title).toMatch(/changed/i);
  });

  it("maps LINKED_ORDER_REQUIRED with inline alert", () => {
    const presentation = getAdminInvoiceErrorPresentation(
      new CmsApiError({
        message: "Linked order required",
        status: 409,
        cmsCode: "LINKED_ORDER_REQUIRED",
      })
    );
    expect(presentation.showInlineAlert).toBe(true);
    expect(presentation.description).toMatch(/no linked order/i);
  });

  it("maps LINKED_ORDER_ACCOUNT_MISMATCH", () => {
    const presentation = getAdminInvoiceErrorPresentation(
      new CmsApiError({
        message: "Mismatch",
        status: 409,
        cmsCode: "LINKED_ORDER_ACCOUNT_MISMATCH",
      })
    );
    expect(presentation.severity).toBe("error");
    expect(presentation.showInlineAlert).toBe(true);
  });

  it("maps 403 with Strapi token guidance", () => {
    const presentation = getAdminInvoiceErrorPresentation(
      new CmsApiError({
        message: "Forbidden",
        status: 403,
      })
    );
    expect(presentation.title).toMatch(/Permission denied/i);
    expect(presentation.description).toMatch(/adminInvoicesUpdate/i);
  });

  it("does not fall back to generic unexpected for known CMS codes", () => {
    const dto = toCmsApiErrorDTO(
      new CmsApiError({
        message: "No patch keys",
        status: 400,
        cmsCode: "EMPTY_PATCH",
      })
    );
    const presentation = getAdminInvoiceErrorPresentation(dto);
    expect(presentation.title).not.toBe("An unexpected error occurred.");
    expect(presentation.title).toMatch(/Nothing to save/i);
  });
});
