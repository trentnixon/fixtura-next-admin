import { describe, expect, it } from "vitest";
import {
  canReconcileAccountHealthRun,
  canResumeAccountHealthRun,
  isHealthRunActive,
  isHealthRunCompletedLimbo,
} from "@/lib/account-health/displayRules";
import type { AccountHealthRunStatus } from "@/types/accountHealth";

describe("isHealthRunCompletedLimbo", () => {
  it("is true when status is completed and finalizedAt is null", () => {
    expect(
      isHealthRunCompletedLimbo({ status: "completed", finalizedAt: null })
    ).toBe(true);
  });

  it("is false when status is completed but finalizedAt is set", () => {
    expect(
      isHealthRunCompletedLimbo({
        status: "completed",
        finalizedAt: "2026-08-18T05:30:00.000Z",
      })
    ).toBe(false);
  });

  it("is false for active and other terminal statuses", () => {
    const nonLimbo: AccountHealthRunStatus[] = [
      "pending",
      "queued",
      "running",
      "failed",
      "finalized",
    ];
    for (const status of nonLimbo) {
      expect(
        isHealthRunCompletedLimbo({ status, finalizedAt: null })
      ).toBe(false);
    }
  });
});

describe("completed limbo vs active run gating", () => {
  it("reconcile and abort are mutually exclusive by status", () => {
    const statuses: AccountHealthRunStatus[] = [
      "pending",
      "queued",
      "running",
      "completed",
      "failed",
      "finalized",
    ];

    for (const status of statuses) {
      const run = { status, finalizedAt: null as string | null };
      const reconcile = canReconcileAccountHealthRun(run);
      const abort = isHealthRunActive(status);

      expect(reconcile && abort).toBe(false);
    }
  });

  it("reconcile only in completed limbo", () => {
    expect(
      canReconcileAccountHealthRun({ status: "completed", finalizedAt: null })
    ).toBe(true);
    expect(
      canReconcileAccountHealthRun({
        status: "completed",
        finalizedAt: "2026-08-18T05:30:00.000Z",
      })
    ).toBe(false);
    expect(canReconcileAccountHealthRun({ status: "running", finalizedAt: null })).toBe(
      false
    );
  });

  it("resume on active runs and completed limbo, not finalized or failed", () => {
    expect(canResumeAccountHealthRun({ status: "running", finalizedAt: null })).toBe(
      true
    );
    expect(
      canResumeAccountHealthRun({ status: "completed", finalizedAt: null })
    ).toBe(true);
    expect(canResumeAccountHealthRun({ status: "finalized", finalizedAt: null })).toBe(
      false
    );
    expect(canResumeAccountHealthRun({ status: "failed", finalizedAt: null })).toBe(
      false
    );
  });
});
