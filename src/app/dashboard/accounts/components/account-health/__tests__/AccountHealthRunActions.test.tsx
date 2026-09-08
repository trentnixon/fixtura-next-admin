import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AccountHealthRunActions from "@/app/dashboard/accounts/components/account-health/AccountHealthRunActions";

vi.mock(
  "@/app/dashboard/accounts/components/account-health/ReconcileAccountHealthRunButton",
  () => ({
    default: () => <button type="button">Reconcile</button>,
  })
);

vi.mock(
  "@/app/dashboard/accounts/components/account-health/ResumeAccountHealthRunButton",
  () => ({
    default: () => <button type="button">Resume</button>,
  })
);

vi.mock(
  "@/app/dashboard/accounts/components/account-health/AbortAccountHealthRunButton",
  () => ({
    default: () => <button type="button">Abort</button>,
  })
);

describe("AccountHealthRunActions", () => {
  it("shows reconcile and resume but not abort in completed limbo", () => {
    render(
      <AccountHealthRunActions
        runId={949}
        accountId={932}
        runStatus="completed"
        finalizedAt={null}
      />
    );

    expect(screen.getByRole("button", { name: /^Reconcile$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Resume$/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Abort$/i })).not.toBeInTheDocument();
  });

  it("shows abort and resume but not reconcile for active runs", () => {
    render(
      <AccountHealthRunActions
        runId={475}
        accountId={701}
        runStatus="running"
        finalizedAt={null}
      />
    );

    expect(screen.queryByRole("button", { name: /^Reconcile$/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Resume$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Abort$/i })).toBeInTheDocument();
  });

  it("renders nothing for terminal finalized runs", () => {
    const { container } = render(
      <AccountHealthRunActions
        runId={475}
        accountId={701}
        runStatus="finalized"
        finalizedAt="2026-08-18T05:30:00.000Z"
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("shows recovery label in group layout when actions exist", () => {
    render(
      <AccountHealthRunActions
        runId={475}
        accountId={701}
        runStatus="running"
        finalizedAt={null}
        layout="group"
      />
    );

    expect(screen.getByText("Recovery")).toBeInTheDocument();
  });
});
