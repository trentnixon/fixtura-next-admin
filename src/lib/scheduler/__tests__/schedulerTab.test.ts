import { describe, expect, it } from "vitest";
import {
  buildSchedulerTabHref,
  parseSchedulerTab,
} from "@/lib/scheduler/schedulerTab";

describe("parseSchedulerTab", () => {
  it("opens Live Queue when the query is live", () => {
    expect(parseSchedulerTab("live")).toBe("live");
    expect(buildSchedulerTabHref("live")).toBe("/dashboard/schedulers?tab=live");
  });

  it("opens Analytics when the query is analytics", () => {
    expect(parseSchedulerTab("analytics")).toBe("analytics");
    expect(buildSchedulerTabHref("analytics")).toBe(
      "/dashboard/schedulers?tab=analytics",
    );
  });

  it("opens Schedule when the query is missing, schedule, or unknown", () => {
    expect(parseSchedulerTab(null)).toBe("schedule");
    expect(parseSchedulerTab(undefined)).toBe("schedule");
    expect(parseSchedulerTab("schedule")).toBe("schedule");
    expect(parseSchedulerTab("queue")).toBe("schedule");
    expect(buildSchedulerTabHref("schedule")).toBe(
      "/dashboard/schedulers?tab=schedule",
    );
  });
});
