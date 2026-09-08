import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReconcileAccountHealthRunButton from "@/app/dashboard/accounts/components/account-health/ReconcileAccountHealthRunButton";

const mutateAsync = vi.fn();

vi.mock("@/hooks/account-health/useReconcileAccountHealthRun", () => ({
  useReconcileAccountHealthRun: () => ({
    mutateAsync,
    isPending: false,
  }),
}));

describe("ReconcileAccountHealthRunButton", () => {
  it("shows reconcile effects and confirms once", async () => {
    mutateAsync.mockResolvedValue({
      data: { status: "reconciled", runId: 444, reconciled: 1, requeued: 0, itemSummaries: [] },
    });
    const user = userEvent.setup();

    render(<ReconcileAccountHealthRunButton runId={444} accountId={136} />);

    await user.click(screen.getByRole("button", { name: /^Reconcile$/i }));

    expect(screen.getByText(/Reconcile run #444/i)).toBeInTheDocument();
    expect(
      screen.getByText(/rechecks fixture-discovery ingest rows/i)
    ).toBeInTheDocument();

    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: /^Reconcile$/i,
      })
    );
    expect(mutateAsync).toHaveBeenCalledTimes(1);
    expect(mutateAsync).toHaveBeenCalledWith({ runId: 444, accountId: 136 });
  });

  it("does not reconcile when cancelled", async () => {
    mutateAsync.mockClear();
    const user = userEvent.setup();

    render(<ReconcileAccountHealthRunButton runId={444} accountId={136} />);

    await user.click(screen.getByRole("button", { name: /^Reconcile$/i }));
    await user.click(screen.getByRole("button", { name: /^Cancel$/i }));
    expect(mutateAsync).not.toHaveBeenCalled();
  });
});
