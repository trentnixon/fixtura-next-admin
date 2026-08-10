import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InvoiceEditor from "@/app/dashboard/orders/invoices/[invoiceRequestId]/components/InvoiceEditor";
import {
  makeAggregate,
  makePatchResponse,
} from "@/lib/services/orders/__tests__/fixtures/adminInvoiceFixtures";
import { toCmsApiErrorDTO, CmsApiError } from "@/lib/services/utils/cms-api-error";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    message: vi.fn(),
  },
}));

const mutateAsync = vi.fn();
vi.mock("@/hooks/orders/useAdminInvoiceUpdate", () => ({
  useAdminInvoiceUpdate: () => ({
    mutateAsync,
    isPending: false,
  }),
}));

describe("InvoiceEditor", () => {
  beforeEach(() => {
    mutateAsync.mockReset();
    vi.mocked(toast.error).mockClear();
    vi.mocked(toast.info).mockClear();
    vi.mocked(toast.success).mockClear();
  });

  it("shows repair banner when order is null", () => {
    render(
      <InvoiceEditor
        initialAggregate={makeAggregate({ order: null })}
        refetch={vi.fn()}
      />
    );
    expect(
      screen.getByText(/Requires repair — no linked order/i)
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/Invoice number/i)).not.toBeInTheDocument();
  });

  it("shows dedicated lifecycle actions instead of a status dropdown", () => {
    render(
      <InvoiceEditor initialAggregate={makeAggregate()} refetch={vi.fn()} />
    );
    expect(
      screen.getByRole("button", { name: /Create \/ send invoice/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Decline/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Cancel request/i })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/Next status/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Request notes/i)).toBeInTheDocument();
  });

  it("renders three-step lifecycle workflow strip", () => {
    render(
      <InvoiceEditor initialAggregate={makeAggregate()} refetch={vi.fn()} />
    );
    expect(screen.getByTestId("invoice-lifecycle-steps")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
    expect(screen.getAllByText(/Invoice received/i).length).toBeGreaterThan(0);
  });

  it("shows terminal lifecycle message for paid requests", () => {
    render(
      <InvoiceEditor
        initialAggregate={makeAggregate({
          invoiceRequest: { status: "paid" },
        })}
        refetch={vi.fn()}
      />
    );
    expect(
      screen.getByText(/No further status transitions are available/i)
    ).toBeInTheDocument();
  });

  it("renders unknown legacy status safely without create actions", () => {
    render(
      <InvoiceEditor
        initialAggregate={makeAggregate({
          invoiceRequest: { status: "submitted" },
        })}
        refetch={vi.fn()}
      />
    );
    expect(screen.getAllByText(/Submitted/i).length).toBeGreaterThan(0);
    expect(
      screen.queryByRole("button", { name: /Create \/ send invoice/i })
    ).not.toBeInTheDocument();
  });

  it("disables save when nothing changed", () => {
    render(
      <InvoiceEditor initialAggregate={makeAggregate()} refetch={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: /Save changes/i })).toBeDisabled();
  });

  it("shows unsaved changes after edit", async () => {
    const user = userEvent.setup();
    render(
      <InvoiceEditor initialAggregate={makeAggregate()} refetch={vi.fn()} />
    );

    await user.type(screen.getByLabelText(/Contact name/i), "X");
    expect(screen.getByText(/Unsaved changes/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save changes/i })).toBeEnabled();
  });

  it("blocks save for invalid email", async () => {
    const user = userEvent.setup();
    render(
      <InvoiceEditor initialAggregate={makeAggregate()} refetch={vi.fn()} />
    );

    const emailInput = screen.getByLabelText(/Billing email/i);
    await user.clear(emailInput);
    await user.type(emailInput, "bad-email");

    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save changes/i })).toBeDisabled();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("submits request-only patch via Save changes", async () => {
    const user = userEvent.setup();
    mutateAsync.mockResolvedValue(makePatchResponse());

    render(
      <InvoiceEditor initialAggregate={makeAggregate()} refetch={vi.fn()} />
    );

    await user.clear(screen.getByLabelText(/Contact name/i));
    await user.type(screen.getByLabelText(/Contact name/i), "Saved Contact");
    await user.click(screen.getByRole("button", { name: /Save changes/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledTimes(1);
    });

    const payload = mutateAsync.mock.calls[0][0].payload;
    expect(payload.invoiceRequest?.billingContactName).toBe("Saved Contact");
    expect(payload.invoiceRequest?.status).toBeUndefined();
    expect(payload.order).toBeUndefined();
  });

  it("opens create/send confirmation", async () => {
    const user = userEvent.setup();
    render(
      <InvoiceEditor initialAggregate={makeAggregate()} refetch={vi.fn()} />
    );

    await user.click(
      screen.getByRole("button", { name: /Create \/ send invoice/i })
    );

    expect(
      screen.getByRole("dialog", { name: /Create and send invoice/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Queue the customer invoice email/i)
    ).toBeInTheDocument();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("confirms create/send once with invoice_created payload", async () => {
    const user = userEvent.setup();
    mutateAsync.mockResolvedValue(makePatchResponse());

    render(
      <InvoiceEditor initialAggregate={makeAggregate()} refetch={vi.fn()} />
    );

    await user.click(
      screen.getByRole("button", { name: /Create \/ send invoice/i })
    );
    await user.click(
      screen.getByRole("button", { name: /Confirm create \/ send/i })
    );

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledTimes(1);
    });

    expect(mutateAsync.mock.calls[0][0].payload.invoiceRequest?.status).toBe(
      "invoice_created"
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Invoice created",
      expect.objectContaining({
        description: expect.stringMatching(/queued/i),
      })
    );
  });

  it("opens mark-paid confirmation from invoice_created", async () => {
    const user = userEvent.setup();
    render(
      <InvoiceEditor
        initialAggregate={makeAggregate({
          invoiceRequest: { status: "invoice_created" },
        })}
        refetch={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /Mark paid/i }));
    expect(
      screen.getByRole("dialog", { name: /Mark invoice paid/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Checkout status becomes Active/i)
    ).toBeInTheDocument();
  });

  it("confirms mark paid without CMS-owned order flags", async () => {
    const user = userEvent.setup();
    mutateAsync.mockResolvedValue({
      ...makePatchResponse(),
      aggregate: makeAggregate({
        invoiceRequest: { status: "paid" },
        order: {
          ...makeAggregate().order!,
          checkoutStatus: "active",
          paymentStatus: "paid",
          orderPaid: true,
          isActive: true,
        },
      }),
      emailStatus: "not_applicable",
    });

    render(
      <InvoiceEditor
        initialAggregate={makeAggregate({
          invoiceRequest: { status: "invoice_created" },
        })}
        refetch={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /Mark paid/i }));
    await user.click(screen.getByRole("button", { name: /Confirm mark paid/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledTimes(1);
    });

    const payload = mutateAsync.mock.calls[0][0].payload;
    expect(payload).toEqual({
      invoiceRequest: { status: "paid" },
      expectedInvoiceRequestUpdatedAt: expect.any(String),
      expectedOrderUpdatedAt: expect.any(String),
    });
    expect(toast.success).toHaveBeenCalledWith(
      "Invoice marked paid",
      expect.any(Object)
    );
  });

  it("blocks create/send when URLs are missing", async () => {
    const user = userEvent.setup();
    render(
      <InvoiceEditor
        initialAggregate={makeAggregate({
          order: {
            ...makeAggregate().order!,
            hostedInvoiceUrl: null,
            invoicePdfUrl: null,
          },
        })}
        refetch={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /Create \/ send invoice/i })
    );

    expect(toast.error).toHaveBeenCalledWith(
      "Fix validation errors",
      expect.any(Object)
    );
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("hides create/send when order is null", () => {
    render(
      <InvoiceEditor
        initialAggregate={makeAggregate({
          order: null,
        })}
        refetch={vi.fn()}
      />
    );

    expect(
      screen.queryByRole("button", { name: /Create \/ send invoice/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Decline/i })).toBeInTheDocument();
  });

  it("opens cancellation confirmation", async () => {
    const user = userEvent.setup();
    render(
      <InvoiceEditor initialAggregate={makeAggregate()} refetch={vi.fn()} />
    );

    await user.click(screen.getByRole("button", { name: /Cancel request/i }));
    expect(
      screen.getByRole("dialog", { name: /Cancel invoice request/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Incomplete expired/i)
    ).toBeInTheDocument();
  });

  it("opens stale conflict dialog on serialized stale error", async () => {
    const user = userEvent.setup();
    const refetch = vi.fn().mockResolvedValue({
      data: makeAggregate({
        invoiceRequest: {
          requestNotes: "Server note",
          updatedAt: "2026-07-22T05:00:00.000Z",
        },
      }),
    });

    mutateAsync.mockRejectedValue(
      toCmsApiErrorDTO(
        new CmsApiError({
          message: "Stale",
          status: 409,
          cmsCode: "STALE_INVOICE_REQUEST",
        })
      )
    );

    render(
      <InvoiceEditor initialAggregate={makeAggregate()} refetch={refetch} />
    );

    await user.clear(screen.getByLabelText(/Contact name/i));
    await user.type(screen.getByLabelText(/Contact name/i), "Edited Contact");
    await user.click(screen.getByRole("button", { name: /Save changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/Stale update detected/i)).toBeInTheDocument();
    });
    expect(refetch).toHaveBeenCalled();
  });

  it("shows LINKED_ORDER_REQUIRED inline alert", async () => {
    const user = userEvent.setup();
    mutateAsync.mockRejectedValue(
      toCmsApiErrorDTO(
        new CmsApiError({
          message: "Linked order required",
          status: 400,
          cmsCode: "LINKED_ORDER_REQUIRED",
        })
      )
    );

    render(
      <InvoiceEditor initialAggregate={makeAggregate()} refetch={vi.fn()} />
    );

    await user.type(screen.getByLabelText(/Contact name/i), "Edited");
    await user.click(screen.getByRole("button", { name: /Save changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/Linked order required/i)).toBeInTheDocument();
    });
  });

  it("resets dirty state after successful save", async () => {
    const user = userEvent.setup();
    mutateAsync.mockResolvedValue(makePatchResponse());

    render(
      <InvoiceEditor initialAggregate={makeAggregate()} refetch={vi.fn()} />
    );

    await user.clear(screen.getByLabelText(/Contact name/i));
    await user.type(screen.getByLabelText(/Contact name/i), "Saved Contact");
    await user.click(screen.getByRole("button", { name: /Save changes/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByText(/Unsaved changes/i)).not.toBeInTheDocument();
  });

  it("reverts local changes on reset", async () => {
    const user = userEvent.setup();
    render(
      <InvoiceEditor initialAggregate={makeAggregate()} refetch={vi.fn()} />
    );

    const contactInput = screen.getByLabelText(/Contact name/i);
    await user.clear(contactInput);
    await user.type(contactInput, "Temporary");
    await user.click(screen.getByRole("button", { name: /Reset changes/i }));

    expect(contactInput).toHaveValue("Jane Smith");
    expect(screen.queryByText(/Unsaved changes/i)).not.toBeInTheDocument();
  });
});
