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
        { service: "scraper", queueName: "grades" },
      ),
    ).toBe(
      "/dashboard/notifications/issues?days=14&service=scraper&queueName=grades",
    );
  });

  it("passes health breakdown dimensions into the issues request", () => {
    const result = parseNotificationIssuesSearchParams({
      days: "30",
      service: "scraper",
      scope: "fixtures",
      queueName: "fixture-results",
      kind: "job.completed",
      issueScope: "fixture",
    });

    expect(result.params).toMatchObject({
      mode: "preset",
      days: 30,
      service: "scraper",
      scope: "fixtures",
      queueName: "fixture-results",
      kind: "job.completed",
      issueScope: "fixture",
    });
  });

  it("keeps global search distinct from the legacy message filter", () => {
    const result = parseNotificationIssuesSearchParams({
      days: "7",
      search: "  Eastern Eagles  ",
      message: "timeout",
    });

    expect(result.params).toMatchObject({
      mode: "preset",
      days: 7,
      search: "Eastern Eagles",
      message: "timeout",
    });
  });

  it("falls back to seven days when the days query is empty", () => {
    const result = parseNotificationIssuesSearchParams({ days: "" });

    expect(result.params).toMatchObject({ mode: "preset", days: 7 });
    expect(result.queryEnabled).toBe(true);
  });
});
