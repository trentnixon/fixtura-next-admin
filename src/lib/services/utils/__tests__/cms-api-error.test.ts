import { describe, expect, it } from "vitest";
import {
  CmsApiError,
  cmsCodeMatchesPrefix,
  isCmsApiError,
  isStaleConflict,
  throwSerializableCmsApiError,
  toCmsApiError,
  toCmsApiErrorDTO,
} from "@/lib/services/utils/cms-api-error";

describe("CmsApiError normalization", () => {
  it("preserves HTTP status, cms code, message, details, and network state", () => {
    const error = toCmsApiError({
      status: 409,
      message: "Conflict",
      data: {
        error: {
          message: "STALE_INVOICE_REQUEST",
          details: { field: "updatedAt" },
        },
      },
    });

    expect(error.status).toBe(409);
    expect(error.cmsCode).toBe("STALE_INVOICE_REQUEST");
    expect(error.details).toEqual({ field: "updatedAt" });
    expect(error.isNetworkError).toBe(false);
    expect(error.message).toBe("STALE_INVOICE_REQUEST");
  });

  it("prefers dedicated code over user-facing message", () => {
    const error = toCmsApiError({
      status: 400,
      data: {
        code: "INVOICE_URL_REQUIRED",
        message: "Provide at least one invoice URL.",
      },
    });

    expect(error.cmsCode).toBe("INVOICE_URL_REQUIRED");
    expect(error.message).toBe("Provide at least one invoice URL.");
  });

  it("reads nested code when present alongside message", () => {
    const error = toCmsApiError({
      status: 400,
      data: {
        error: {
          code: "BILLING_EMAIL_REQUIRED",
          message: "Billing email is required.",
        },
      },
    });

    expect(error.cmsCode).toBe("BILLING_EMAIL_REQUIRED");
    expect(error.message).toBe("Billing email is required.");
  });

  it("detects network errors from interceptor shape", () => {
    const error = toCmsApiError({
      status: null,
      message: "timeout",
      isNetworkError: true,
    });
    expect(error.isNetworkError).toBe(true);
    expect(error.message).toMatch(/Network error/i);
  });

  it("maps 403, 404, and 500 to specific messages", () => {
    expect(toCmsApiError({ status: 403, message: "Forbidden" }).message).toMatch(
      /permission/i
    );
    expect(toCmsApiError({ status: 404, message: "Not found" }).message).toMatch(
      /not found/i
    );
    expect(toCmsApiError({ status: 500, message: "Boom" }).message).toMatch(
      /server error/i
    );
  });
});

describe("known CMS error codes", () => {
  const cases: Array<{ code: string; status?: number }> = [
    { code: "EMPTY_PATCH", status: 400 },
    { code: "UNSUPPORTED_FIELD:invoiceRequest.foo", status: 400 },
    { code: "INVALID_EMAIL", status: 400 },
    { code: "INVALID_INVOICE_REQUEST_TRANSITION:submitted->paid", status: 400 },
    { code: "STALE_INVOICE_REQUEST", status: 409 },
    { code: "STALE_ORDER", status: 409 },
    { code: "LINKED_ORDER_ACCOUNT_MISMATCH", status: 409 },
    { code: "LINKED_ORDER_REQUIRED", status: 409 },
  ];

  it.each(cases)("does not collapse $code to generic unexpected error", ({ code, status }) => {
    const error = toCmsApiError({
      status: status ?? 400,
      data: { error: { message: code } },
    });
    expect(error.cmsCode).toBe(code);
    expect(error.message).not.toBe("An unexpected error occurred.");
  });
});

describe("isCmsApiError duck typing", () => {
  it("accepts CmsApiError instances", () => {
    expect(isCmsApiError(new CmsApiError({ message: "x" }))).toBe(true);
  });

  it("accepts serialized DTO from server actions", () => {
    const dto = toCmsApiErrorDTO(
      new CmsApiError({
        message: "Stale",
        status: 409,
        cmsCode: "STALE_INVOICE_REQUEST",
      })
    );
    expect(isCmsApiError(dto)).toBe(true);
    expect(isStaleConflict(dto)).toBe(true);
  });
});

describe("isStaleConflict", () => {
  it("returns true for stale invoice request and order", () => {
    expect(
      isStaleConflict(
        new CmsApiError({
          message: "stale",
          status: 409,
          cmsCode: "STALE_INVOICE_REQUEST",
        })
      )
    ).toBe(true);
    expect(
      isStaleConflict(
        new CmsApiError({
          message: "stale",
          status: 409,
          cmsCode: "STALE_ORDER",
        })
      )
    ).toBe(true);
  });

  it("returns false for non-409 and unrelated codes", () => {
    expect(
      isStaleConflict(
        new CmsApiError({
          message: "mismatch",
          status: 409,
          cmsCode: "LINKED_ORDER_REQUIRED",
        })
      )
    ).toBe(false);
  });
});

describe("cmsCodeMatchesPrefix", () => {
  it("matches prefix patterns", () => {
    expect(cmsCodeMatchesPrefix("INVALID_EMAIL", "INVALID_")).toBe(true);
    expect(cmsCodeMatchesPrefix("UNSUPPORTED_FIELD:x", "UNSUPPORTED_FIELD:")).toBe(
      true
    );
  });
});

describe("throwSerializableCmsApiError", () => {
  it("throws plain serializable object", () => {
    try {
      throwSerializableCmsApiError(
        { status: 409, data: { error: { message: "STALE_ORDER" } } },
        "Failed"
      );
    } catch (error) {
      expect(isCmsApiError(error)).toBe(true);
      expect((error as { name: string }).name).toBe("CmsApiError");
    }
  });
});
