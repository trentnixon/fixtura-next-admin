import { describe, expect, it } from "vitest";
import {
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
  const cases: Array<{
    status: AccountHealthRunStatus;
    finalizedAt: string | null;
  }> = [
    { status: "completed", finalizedAt: null },
    { status: "completed", finalizedAt: "2026-08-18T05:30:00.000Z" },
    { status: "running", finalizedAt: null },
    { status: "finalized", finalizedAt: "2026-08-18T05:30:00.000Z" },
    { status: "failed", finalizedAt: null },
  ];

  it("never allows both reconcile and abort visibility predicates", () => {
    for (const run of cases) {
      const showReconcile = isHealthRunCompletedLimbo(run);
      const showAbort = isHealthRunActive(run.status);
      expect(showReconcile && showAbort).toBe(false);
    }
  });
});
