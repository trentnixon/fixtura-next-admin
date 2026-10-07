import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountAnalyticsCards from "../AccountAnalyticsCards";

const mutateAsync = vi.fn();

const analyticsState = vi.hoisted(() => ({
  current: {
    data: undefined as unknown,
    isLoading: false,
    error: new Error("analytics down") as Error | null,
  },
}));

vi.mock("@/hooks/analytics/useAccountAnalytics", () => ({
  useAccountAnalytics: () => analyticsState.current,
}));

vi.mock("@/hooks/free-trial/useWipeFreeTrial", () => ({
  useWipeFreeTrial: () => ({
    mutateAsync,
    isPending: false,
  }),
}));

function renderTrialsTab() {
  return render(<AccountAnalyticsCards accountId={42} />);
}

describe("AccountAnalyticsCards free trial", () => {
  beforeEach(() => {
    mutateAsync.mockReset();
    mutateAsync.mockResolvedValue({ ok: true, outcome: "wiped" });
    analyticsState.current = {
      data: undefined,
      isLoading: false,
      error: new Error("analytics down"),
    };
  });

  it("offers Remove free trial on Trials when analytics fails", async () => {
    const user = userEvent.setup();
    renderTrialsTab();

    await user.click(screen.getByRole("tab", { name: /Trials/i }));

    expect(
      screen.getByRole("button", { name: /Remove free trial/i }),
    ).toBeInTheDocument();
  });

  it("offers Remove free trial on Trials while analytics is loading", async () => {
    analyticsState.current = {
      data: undefined,
      isLoading: true,
      error: null,
    };
    const user = userEvent.setup();
    renderTrialsTab();

    await user.click(screen.getByRole("tab", { name: /Trials/i }));

    expect(
      screen.getByRole("button", { name: /Remove free trial/i }),
    ).toBeInTheDocument();
  });

  it("offers Remove free trial on Trials when analytics is empty", async () => {
    analyticsState.current = {
      data: undefined,
      isLoading: false,
      error: null,
    };
    const user = userEvent.setup();
    renderTrialsTab();

    await user.click(screen.getByRole("tab", { name: /Trials/i }));

    expect(
      screen.getByRole("button", { name: /Remove free trial/i }),
    ).toBeInTheDocument();
  });

  it("explains the free trial removal before it runs", async () => {
    const user = userEvent.setup();
    renderTrialsTab();

    await user.click(screen.getByRole("tab", { name: /Trials/i }));
    await user.click(screen.getByRole("button", { name: /Remove free trial/i }));

    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: "Remove this free trial?" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        /including a trial record stored on another client of the same organisation/i,
      ),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/The no-charge trialing order is deleted/i),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/loses access immediately/i),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/The client is not emailed/i),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/Older trial orders can remain/i),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/only when billing already allows it/i),
    ).toBeInTheDocument();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("removes the free trial once the operator confirms", async () => {
    const user = userEvent.setup();
    renderTrialsTab();

    await user.click(screen.getByRole("tab", { name: /Trials/i }));
    await user.click(screen.getByRole("button", { name: /Remove free trial/i }));
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: /^Remove free trial$/i,
      }),
    );

    expect(mutateAsync).toHaveBeenCalledTimes(1);
    expect(mutateAsync).toHaveBeenCalledWith(42);
  });

  it("does not remove the free trial when the operator cancels", async () => {
    const user = userEvent.setup();
    renderTrialsTab();

    await user.click(screen.getByRole("tab", { name: /Trials/i }));
    await user.click(screen.getByRole("button", { name: /Remove free trial/i }));
    await user.click(screen.getByRole("button", { name: /^Cancel$/i }));

    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("still offers Create Invoice when there is no active subscription", () => {
    analyticsState.current = {
      data: { currentSubscription: null },
      isLoading: false,
      error: null,
    };

    renderTrialsTab();

    expect(
      screen.getByRole("link", { name: /Create Invoice/i }),
    ).toBeInTheDocument();
  });

  it("offers Remove free trial when this client has no trial record", async () => {
    analyticsState.current = {
      data: {
        currentSubscription: null,
        orderHistory: { orders: [] },
        trialUsage: {
          hasActiveTrial: false,
          trialInstance: null,
          trialHistory: [],
        },
      },
      isLoading: false,
      error: null,
    };
    const user = userEvent.setup();
    renderTrialsTab();

    await user.click(screen.getByRole("tab", { name: /Trials/i }));

    expect(
      screen.getByRole("button", { name: /Remove free trial/i }),
    ).toBeInTheDocument();
  });

  it("hides Remove free trial when the client id is missing", async () => {
    const user = userEvent.setup();
    render(<AccountAnalyticsCards accountId={Number.NaN} />);

    await user.click(screen.getByRole("tab", { name: /Trials/i }));

    expect(
      screen.queryByRole("button", { name: /Remove free trial/i }),
    ).not.toBeInTheDocument();
  });
});
