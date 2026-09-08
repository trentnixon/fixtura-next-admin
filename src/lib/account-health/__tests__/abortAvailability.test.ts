import { describe, expect, it } from "vitest";
import {
  ABORT_INACTIVE_RUN_TOOLTIP,
  canAbortAccountHealthRun,
} from "@/lib/account-health/abortAvailability";

describe("canAbortAccountHealthRun", () => {
  it("allows abort for active statuses", () => {
    expect(canAbortAccountHealthRun("pending")).toBe(true);
    expect(canAbortAccountHealthRun("queued")).toBe(true);
    expect(canAbortAccountHealthRun("running")).toBe(true);
  });

  it("disallows abort for completed and other terminal statuses", () => {
    expect(canAbortAccountHealthRun("completed")).toBe(false);
    expect(canAbortAccountHealthRun("finalized")).toBe(false);
    expect(canAbortAccountHealthRun("failed")).toBe(false);
    expect(canAbortAccountHealthRun(undefined)).toBe(false);
  });

  it("documents why inactive runs cannot abort", () => {
    expect(ABORT_INACTIVE_RUN_TOOLTIP).toMatch(/Reconcile or Resume/);
  });
});
