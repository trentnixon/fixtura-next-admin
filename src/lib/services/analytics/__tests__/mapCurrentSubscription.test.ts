import { describe, expect, it } from "vitest";
import { mapCurrentSubscription } from "../mapCurrentSubscription";

describe("mapCurrentSubscription", () => {
  it("treats a None tier as no subscription", () => {
    expect(
      mapCurrentSubscription({
        tier: "None",
        status: "Active",
        startDate: "2026-01-01",
        endDate: "2026-06-01",
      }),
    ).toBeNull();
  });

  it("treats No active subscription as no subscription", () => {
    expect(
      mapCurrentSubscription({
        tier: "Season Pass",
        status: "No active subscription",
        startDate: "2026-01-01",
        endDate: "2026-06-01",
      }),
    ).toBeNull();
  });

  it("keeps a paid active order as the current subscription", () => {
    expect(
      mapCurrentSubscription({
        tier: "Season Pass",
        status: "Active",
        startDate: "2026-01-01",
        endDate: "2026-06-01",
        cancelAtPeriodEnd: false,
      }),
    ).toEqual({
      tier: "Season Pass",
      status: "Active",
      startDate: "2026-01-01",
      endDate: "2026-06-01",
      isActive: true,
      autoRenew: true,
    });
  });

  it("treats a subscription without an end date as no subscription", () => {
    expect(
      mapCurrentSubscription({
        tier: "Season Pass",
        status: "Active",
        startDate: "2026-01-01",
      }),
    ).toBeNull();
  });
});
