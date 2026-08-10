import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InvoiceIssuanceConfirmDialog from "@/app/dashboard/orders/invoices/[invoiceRequestId]/components/InvoiceIssuanceConfirmDialog";

describe("InvoiceIssuanceConfirmDialog", () => {
  it("shows create/send effects and confirms once", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <InvoiceIssuanceConfirmDialog
        open
        onOpenChange={vi.fn()}
        invoiceRequestId={89}
        orderId={457}
        isPending={false}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText(/Create and send invoice/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Invoice created/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Set checkout status to Invoice issued/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Keep the order unpaid and inactive/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Queue the customer invoice email/i)
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /Confirm create \/ send/i })
    );
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("does not confirm when cancelled", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <InvoiceIssuanceConfirmDialog
        open
        onOpenChange={vi.fn()}
        invoiceRequestId={89}
        orderId={457}
        isPending={false}
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByRole("button", { name: /^Cancel$/i }));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
