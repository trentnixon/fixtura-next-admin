import { describe, expect, it } from "vitest";
import {
  buildNotificationIssuesHref,
  parseNotificationIssuesSearchParams,
} from "./notificationIssuesUrl";

describe("notificationIssuesUrl", () => {
  it("builds links under the dedicated notifications route", () => {
    expect(
      buildNotificationIssuesHref(
        { days: 14 },
        { step: "post_extraction_validation", scope: "fixtures" },
      ),
    ).toBe(
      "/dashboard/notifications/issues?days=14&step=post_extraction_validation&scope=fixtures",
    );
  });

  it("passes card-context filters into the issues request", () => {
    const result = parseNotificationIssuesSearchParams({
      days: "30",
      service: "scraper",
      scope: "fixtures",
      queueName: "fixture-results",
      step: "navigate",
      tone: "failure",
    });

    expect(result.params).toMatchObject({
      mode: "preset",
      days: 30,
      scope: "fixtures",
      step: "navigate",
    });
    expect(result.cardTone).toBe("failure");
  });

  it("trims search to match the message shown on cards", () => {
    const result = parseNotificationIssuesSearchParams({
      days: "7",
      search: "  Eastern Eagles  ",
    });

    expect(result.params).toMatchObject({
      mode: "preset",
      days: 7,
      search: "Eastern Eagles",
    });
  });

  it("falls back to seven days when the days query is empty", () => {
    const result = parseNotificationIssuesSearchParams({ days: "" });

    expect(result.params).toMatchObject({ mode: "preset", days: 7 });
    expect(result.queryEnabled).toBe(true);
  });
});
