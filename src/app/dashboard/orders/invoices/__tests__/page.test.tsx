import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminInvoicesPage from "@/app/dashboard/orders/invoices/page";
import { makeListResponse } from "@/lib/services/orders/__tests__/fixtures/adminInvoiceFixtures";
import { CmsApiError } from "@/lib/services/utils/cms-api-error";

const refetch = vi.fn();
const useAdminInvoicesDataMock = vi.fn();

vi.mock("@/hooks/orders/useAdminInvoices", () => ({
  useAdminInvoicesData: (...args: unknown[]) => useAdminInvoicesDataMock(...args),
}));

function mockQueueState(overrides: Record<string, unknown> = {}) {
  useAdminInvoicesDataMock.mockReturnValue({
    items: [],
    total: 0,
    meta: { page: 1, pageSize: 25, total: 0, totalPages: 1 },
    isLoading: false,
    isError: false,
    error: null,
    refetch,
    isFetching: false,
    ...overrides,
  });
}

describe("AdminInvoicesPage", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    refetch.mockReset();
    mockQueueState();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders loading state", () => {
    mockQueueState({ isLoading: true });
    render(<AdminInvoicesPage />);
    expect(screen.getByText(/Loading invoices/i)).toBeInTheDocument();
  });

  it("renders error state with retry and 403 guidance", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    mockQueueState({
      isError: true,
      error: new CmsApiError({
        message: "Forbidden",
        status: 403,
      }),
    });

    render(<AdminInvoicesPage />);
    expect(screen.getByText(/Error loading invoices/i)).toBeInTheDocument();
    expect(
      screen.getByText(/adminInvoicesList, adminInvoicesDetail, and adminInvoicesUpdate/i)
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Retry/i }));
    expect(refetch).toHaveBeenCalled();
  });

  it("renders empty unfiltered state", () => {
    mockQueueState();
    render(<AdminInvoicesPage />);
    expect(screen.getByText(/^No invoice requests$/i)).toBeInTheDocument();
    expect(
      screen.getByText(/There are no invoice requests in the queue yet/i)
    ).toBeInTheDocument();
  });

  it("renders empty filtered state with clear action", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    mockQueueState();

    render(<AdminInvoicesPage />);
    await user.click(screen.getByRole("tab", { name: "New" }));

    await waitFor(() => {
      const lastCall =
        useAdminInvoicesDataMock.mock.calls[
          useAdminInvoicesDataMock.mock.calls.length - 1
        ][0];
      expect(lastCall.preset).toBe("new");
      expect(lastCall.page).toBe(1);
    });

    expect(screen.getByText(/No matching invoice requests/i)).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Clear filters/i }).length
    ).toBeGreaterThan(0);
  });

  it("defaults to outstanding preset", () => {
    mockQueueState({
      items: makeListResponse().items,
      total: 1,
      meta: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
    });

    render(<AdminInvoicesPage />);
    expect(useAdminInvoicesDataMock.mock.calls[0][0]).toMatchObject({
      preset: "outstanding",
      sort: "submittedAt",
      sortDir: "desc",
      page: 1,
      pageSize: 25,
    });
    expect(screen.getByRole("tab", { name: "Outstanding" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("switches closed preset and clears conflicting status", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    mockQueueState({
      items: makeListResponse().items,
      total: 1,
      meta: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
    });

    render(<AdminInvoicesPage />);
    await user.click(screen.getByRole("tab", { name: "Closed" }));

    await waitFor(() => {
      const lastCall =
        useAdminInvoicesDataMock.mock.calls[
          useAdminInvoicesDataMock.mock.calls.length - 1
        ][0];
      expect(lastCall.preset).toBe("closed");
      expect(lastCall.status).toBeUndefined();
      expect(lastCall.page).toBe(1);
    });
  });

  it("uses all-status preset without CMS preset param", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    mockQueueState({
      items: makeListResponse().items,
      total: 1,
      meta: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
    });

    render(<AdminInvoicesPage />);
    await user.click(screen.getByRole("tab", { name: "All statuses" }));

    await waitFor(() => {
      const lastCall =
        useAdminInvoicesDataMock.mock.calls[
          useAdminInvoicesDataMock.mock.calls.length - 1
        ][0];
      expect(lastCall.preset).toBeUndefined();
      expect(lastCall.page).toBe(1);
    });
  });

  it("paginates and preserves filters on refresh", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    mockQueueState({
      items: makeListResponse().items,
      total: 50,
      meta: { page: 1, pageSize: 25, total: 50, totalPages: 2 },
    });

    render(<AdminInvoicesPage />);
    await user.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      const lastCall =
        useAdminInvoicesDataMock.mock.calls[
          useAdminInvoicesDataMock.mock.calls.length - 1
        ][0];
      expect(lastCall.page).toBe(2);
      expect(lastCall.preset).toBe("outstanding");
    });

    await user.click(screen.getByRole("button", { name: "Refresh invoice queue" }));
    expect(refetch).toHaveBeenCalled();
  });

  it("keeps populated rows visible during background refresh", () => {
    mockQueueState({
      items: makeListResponse().items,
      total: 1,
      meta: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
      isFetching: true,
    });

    render(<AdminInvoicesPage />);
    expect(screen.getByText("Example Football Club")).toBeInTheDocument();
    expect(screen.queryByText(/Loading invoices/i)).not.toBeInTheDocument();
  });

  it("renders populated table", () => {
    mockQueueState({
      items: makeListResponse().items,
      total: 1,
      meta: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
    });

    render(<AdminInvoicesPage />);
    expect(screen.getByText("Example Football Club")).toBeInTheDocument();
  });
});
