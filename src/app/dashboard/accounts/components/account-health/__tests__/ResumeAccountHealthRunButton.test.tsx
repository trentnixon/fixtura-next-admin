import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResumeAccountHealthRunButton from "@/app/dashboard/accounts/components/account-health/ResumeAccountHealthRunButton";

const mutateAsync = vi.fn();

vi.mock("@/hooks/account-health/useResumeAccountHealthRun", () => ({
  useResumeAccountHealthRun: () => ({
    mutateAsync,
    isPending: false,
  }),
}));

describe("ResumeAccountHealthRunButton", () => {
  it("shows resume effects and confirms once", async () => {
    mutateAsync.mockResolvedValue({
      data: { status: "resumed", runId: 949, itemId: 1655 },
    });
    const user = userEvent.setup();

    render(<ResumeAccountHealthRunButton runId={949} accountId={932} />);

    await user.click(screen.getByRole("button", { name: /^Resume$/i }));

    expect(screen.getByText(/Resume run #949/i)).toBeInTheDocument();
    expect(
      screen.getByText(/resumes the workflow from the first health item/i)
    ).toBeInTheDocument();

    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: /^Resume$/i,
      })
    );
    expect(mutateAsync).toHaveBeenCalledTimes(1);
    expect(mutateAsync).toHaveBeenCalledWith({ runId: 949, accountId: 932 });
  });

  it("does not resume when cancelled", async () => {
    mutateAsync.mockClear();
    const user = userEvent.setup();

    render(<ResumeAccountHealthRunButton runId={949} accountId={932} />);

    await user.click(screen.getByRole("button", { name: /^Resume$/i }));
    await user.click(screen.getByRole("button", { name: /^Cancel$/i }));
    expect(mutateAsync).not.toHaveBeenCalled();
  });
});
