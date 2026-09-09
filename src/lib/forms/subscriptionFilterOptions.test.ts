import { describe, expect, it } from "vitest";
import { buildSubscriptionFilterOptions } from "./subscriptionFilterOptions";

describe("buildSubscriptionFilterOptions", () => {
  it("includes all, active, and inactive when hideAllFilter is false", () => {
    expect(buildSubscriptionFilterOptions(false)).toEqual([
      { value: "all", label: "All" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ]);
  });

  it("omits all when hideAllFilter is true", () => {
    expect(buildSubscriptionFilterOptions(true)).toEqual([
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ]);
  });
});
