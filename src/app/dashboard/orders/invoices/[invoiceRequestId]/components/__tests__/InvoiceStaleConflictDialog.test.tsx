import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InvoiceStaleConflictDialog from "@/app/dashboard/orders/invoices/[invoiceRequestId]/components/InvoiceStaleConflictDialog";
import { formatInvoiceTimestamp } from "@/app/dashboard/orders/invoices/utils/invoiceQueueFormatters";
import { makeAggregate } from "@/lib/services/orders/__tests__/fixtures/adminInvoiceFixtures";

describe("InvoiceStaleConflictDialog", () => {
  it("offers discard, keep, and cancel actions", async () => {
    const user = userEvent.setup();
    const onDiscard = vi.fn();
    const onKeepChanges = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <InvoiceStaleConflictDialog
        open
        onOpenChange={onOpenChange}
        staleCode="STALE_INVOICE_REQUEST"
        serverSnapshot={makeAggregate()}
        onDiscard={onDiscard}
        onKeepChanges={onKeepChanges}
      />
    );

    await user.click(screen.getByRole("button", { name: /Keep my changes/i }));
    expect(onKeepChanges).toHaveBeenCalledTimes(1);

    await user.click(
      screen.getByRole("button", { name: /Discard local changes/i })
    );
    expect(onDiscard).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /^Cancel$/i }));
    expect(onOpenChange).toHaveBeenCalled();
  });

  it("formats the latest server timestamp with the shared formatter", () => {
    const aggregate = makeAggregate();
    const expected = formatInvoiceTimestamp(
      aggregate.invoiceRequest.updatedAt
    );

    render(
      <InvoiceStaleConflictDialog
        open
        onOpenChange={vi.fn()}
        staleCode="STALE_INVOICE_REQUEST"
        serverSnapshot={aggregate}
        onDiscard={vi.fn()}
        onKeepChanges={vi.fn()}
      />
    );

    expect(screen.getByText(expected)).toBeInTheDocument();
    expect(
      screen.queryByText(aggregate.invoiceRequest.updatedAt)
    ).not.toBeInTheDocument();
  });

  it("shows an em dash when the server timestamp is missing", () => {
    render(
      <InvoiceStaleConflictDialog
        open
        onOpenChange={vi.fn()}
        staleCode="STALE_INVOICE_REQUEST"
        serverSnapshot={makeAggregate({
          invoiceRequest: { updatedAt: null },
        })}
        onDiscard={vi.fn()}
        onKeepChanges={vi.fn()}
      />
    );

    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
