import { describe, expect, it, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { useAdminInvoiceDetail } from "@/hooks/orders/useAdminInvoiceDetail";
import { useAdminInvoices } from "@/hooks/orders/useAdminInvoices";
import { useAdminInvoiceUpdate } from "@/hooks/orders/useAdminInvoiceUpdate";
import {
  adminInvoiceDetailQueryKey,
  ADMIN_INVOICES_QUERY_PREFIX,
} from "@/lib/services/orders/adminInvoicePayloads";
import {
  makeAggregate,
  makeListResponse,
  makePatchResponse,
} from "@/lib/services/orders/__tests__/fixtures/adminInvoiceFixtures";
import { toCmsApiErrorDTO, CmsApiError } from "@/lib/services/utils/cms-api-error";

vi.mock("@/lib/services/orders/fetchAdminInvoices", () => ({
  fetchAdminInvoices: vi.fn(),
}));
vi.mock("@/lib/services/orders/fetchAdminInvoiceDetail", () => ({
  fetchAdminInvoiceDetail: vi.fn(),
}));
vi.mock("@/lib/services/orders/updateAdminInvoice", () => ({
  updateAdminInvoice: vi.fn(),
}));

import { fetchAdminInvoices } from "@/lib/services/orders/fetchAdminInvoices";
import { fetchAdminInvoiceDetail } from "@/lib/services/orders/fetchAdminInvoiceDetail";
import { updateAdminInvoice } from "@/lib/services/orders/updateAdminInvoice";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return {
    queryClient,
    Wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  };
}

describe("useAdminInvoiceDetail", () => {
  it("is disabled without a valid id", () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useAdminInvoiceDetail(undefined), {
      wrapper: Wrapper,
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(fetchAdminInvoiceDetail).not.toHaveBeenCalled();
  });
});

describe("useAdminInvoices query keys", () => {
  it("uses stable list keys and different params create different keys", async () => {
    vi.mocked(fetchAdminInvoices).mockResolvedValue(makeListResponse());
    const { Wrapper, queryClient } = createWrapper();

    renderHook(() => useAdminInvoices({ preset: "new" }), { wrapper: Wrapper });
    renderHook(() => useAdminInvoices({ preset: "closed" }), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(fetchAdminInvoices).toHaveBeenCalledTimes(2);
    });

    const keys = queryClient
      .getQueryCache()
      .getAll()
      .map((query) => query.queryKey);
    expect(keys).toContainEqual([...ADMIN_INVOICES_QUERY_PREFIX, { preset: "new" }]);
    expect(keys).toContainEqual([
      ...ADMIN_INVOICES_QUERY_PREFIX,
      { preset: "closed" },
    ]);
  });
});

describe("useAdminInvoiceUpdate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets detail cache and invalidates list variants on success", async () => {
    const patchResponse = makePatchResponse();
    vi.mocked(updateAdminInvoice).mockResolvedValue(patchResponse);

    const { Wrapper, queryClient } = createWrapper();
    const detailKey = adminInvoiceDetailQueryKey(89);
    const listKey = [...ADMIN_INVOICES_QUERY_PREFIX, { preset: "outstanding" }];
    queryClient.setQueryData(detailKey, makeAggregate());
    queryClient.setQueryData(listKey, makeListResponse());

    const { result } = renderHook(() => useAdminInvoiceUpdate(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({
      invoiceRequestId: 89,
      payload: { invoiceRequest: { billingEmail: "x@example.com" } },
    });

    expect(queryClient.getQueryData(detailKey)).toEqual(patchResponse.aggregate);
    const listState = queryClient.getQueryState(listKey);
    expect(listState?.isInvalidated).toBe(true);
  });

  it("leaves cached detail intact on failed mutation", async () => {
    vi.mocked(updateAdminInvoice).mockRejectedValue(
      toCmsApiErrorDTO(
        new CmsApiError({
          message: "Validation",
          status: 400,
          cmsCode: "INVALID_EMAIL",
        })
      )
    );

    const { Wrapper, queryClient } = createWrapper();
    const detailKey = adminInvoiceDetailQueryKey(89);
    const cached = makeAggregate();
    queryClient.setQueryData(detailKey, cached);

    const { result } = renderHook(() => useAdminInvoiceUpdate(), {
      wrapper: Wrapper,
    });

    await expect(
      result.current.mutateAsync({
        invoiceRequestId: 89,
        payload: { invoiceRequest: { billingEmail: "bad" } },
      })
    ).rejects.toMatchObject({ cmsCode: "INVALID_EMAIL" });

    expect(queryClient.getQueryData(detailKey)).toEqual(cached);
  });

  it("does not auto-retry stale conflicts", async () => {
    vi.mocked(updateAdminInvoice).mockRejectedValue(
      toCmsApiErrorDTO(
        new CmsApiError({
          message: "Stale",
          status: 409,
          cmsCode: "STALE_INVOICE_REQUEST",
        })
      )
    );

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useAdminInvoiceUpdate(), {
      wrapper: Wrapper,
    });

    await expect(
      result.current.mutateAsync({
        invoiceRequestId: 89,
        payload: { invoiceRequest: { billingEmail: "x@example.com" } },
      })
    ).rejects.toMatchObject({ cmsCode: "STALE_INVOICE_REQUEST" });

    expect(updateAdminInvoice).toHaveBeenCalledTimes(1);
  });
});
