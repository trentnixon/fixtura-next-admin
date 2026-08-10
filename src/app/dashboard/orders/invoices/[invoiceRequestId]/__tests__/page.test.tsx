import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminInvoiceDetailPage from "@/app/dashboard/orders/invoices/[invoiceRequestId]/page";
import { makeAggregate } from "@/lib/services/orders/__tests__/fixtures/adminInvoiceFixtures";
import { CmsApiError } from "@/lib/services/utils/cms-api-error";

const refetch = vi.fn();
const useAdminInvoiceDetailMock = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: () => ({ invoiceRequestId: "89" }),
}));

vi.mock("@/hooks/orders/useAdminInvoiceDetail", () => ({
  useAdminInvoiceDetail: (...args: unknown[]) =>
    useAdminInvoiceDetailMock(...args),
}));

vi.mock(
  "@/app/dashboard/orders/invoices/[invoiceRequestId]/components/InvoiceEditor",
  () => ({
    default: () => <div data-testid="invoice-editor">Editor</div>,
  })
);

function mockDetailState(overrides: Record<string, unknown> = {}) {
  useAdminInvoiceDetailMock.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    refetch,
    ...overrides,
  });
}

describe("AdminInvoiceDetailPage", () => {
  beforeEach(() => {
    refetch.mockReset();
    mockDetailState();
  });

  it("renders loading state", () => {
    mockDetailState({ isLoading: true });
    render(<AdminInvoiceDetailPage />);
    expect(screen.getByText("Invoice Request #89")).toBeInTheDocument();
    expect(screen.getAllByText(/Loading invoice/i).length).toBeGreaterThan(0);
  });

  it("uses md PageContainer padding aligned with order detail", () => {
    mockDetailState({ isLoading: true });
    const { container } = render(<AdminInvoiceDetailPage />);
    expect(container.querySelector(".px-6.py-6")).toBeInTheDocument();
  });

  it("renders error state with retry", async () => {
    const user = userEvent.setup();
    mockDetailState({
      isError: true,
      error: new CmsApiError({
        message: "Server exploded",
        status: 500,
      }),
    });

    render(<AdminInvoiceDetailPage />);
    expect(
      screen.getAllByText(/Error loading invoice/i).length
    ).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: /Retry/i }));
    expect(refetch).toHaveBeenCalled();
  });

  it("renders not-found state for 404", () => {
    mockDetailState({
      isError: true,
      error: new CmsApiError({
        message: "Not found",
        status: 404,
      }),
    });

    render(<AdminInvoiceDetailPage />);
    expect(
      screen.getAllByText(/Invoice request not found/i).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(/Invoice request #89 could not be located/i)
    ).toBeInTheDocument();
  });

  it("renders aggregate summary and editor when loaded", () => {
    mockDetailState({ data: makeAggregate() });
    render(<AdminInvoiceDetailPage />);
    expect(screen.getByText(/Request overview/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Invoice received/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("invoice-editor")).toBeInTheDocument();
  });

  it("sets page title and byline from aggregate org name and status", () => {
    mockDetailState({ data: makeAggregate() });
    render(<AdminInvoiceDetailPage />);

    expect(
      screen.getByRole("heading", { name: "Example Football Club" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Invoice received").length).toBeGreaterThan(0);
    expect(screen.getByText("Invoice request #89")).toBeInTheDocument();
  });

  it("shows back link on all states", () => {
    mockDetailState({ isLoading: true });
    render(<AdminInvoiceDetailPage />);
    expect(
      screen.getByRole("link", { name: /Back to queue/i })
    ).toHaveAttribute("href", "/dashboard/orders/invoices");
  });

  it("shows View account and View order when aggregate is loaded", () => {
    mockDetailState({ data: makeAggregate() });
    render(<AdminInvoiceDetailPage />);

    expect(screen.getByRole("link", { name: /View account/i })).toHaveAttribute(
      "href",
      "/dashboard/accounts/club/123"
    );
    expect(screen.getByRole("link", { name: /View order/i })).toHaveAttribute(
      "href",
      "/dashboard/orders/457"
    );
  });

  it("hides View order when there is no linked order", () => {
    mockDetailState({ data: makeAggregate({ order: null }) });
    render(<AdminInvoiceDetailPage />);

    expect(screen.getByRole("link", { name: /View account/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /View order/i })
    ).not.toBeInTheDocument();
  });

  it("routes View account to association path for Association accounts", () => {
    mockDetailState({
      data: makeAggregate({ account: { type: "Association" } }),
    });
    render(<AdminInvoiceDetailPage />);

    expect(screen.getByRole("link", { name: /View account/i })).toHaveAttribute(
      "href",
      "/dashboard/accounts/association/123"
    );
  });

  it("renders breadcrumb trail Dashboard → Orders → Invoices → Request #id", () => {
    mockDetailState({ isLoading: true });
    render(<AdminInvoiceDetailPage />);

    expect(screen.getByRole("link", { name: /Dashboard/i })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByRole("link", { name: /^Orders$/i })).toHaveAttribute(
      "href",
      "/dashboard/orders"
    );
    expect(screen.getByRole("link", { name: /^Invoices$/i })).toHaveAttribute(
      "href",
      "/dashboard/orders/invoices"
    );
    expect(screen.getByText("Request #89")).toBeInTheDocument();
  });
});
