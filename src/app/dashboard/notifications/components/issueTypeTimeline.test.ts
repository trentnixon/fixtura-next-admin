import { describe, expect, it } from "vitest";
import type { NotificationIssueRow } from "@/types/notificationIssues";
import {
  buildIssueTypeTimeline,
  classifyIssueTypeTrend,
  dailyIssueTotals,
  issueTypeKey,
  ISSUE_TYPE_SERIES_LIMIT,
  toDailyIssueShare,
} from "./issueTypeTimeline";

function row(input: {
  step: string | null;
  severity: string;
  createdAt: string;
  message?: string;
  id?: number;
}): NotificationIssueRow {
  return {
    issueIndex: 0,
    step: input.step,
    severity: input.severity,
    message: input.message ?? "message",
    url: null,
    issueScope: null,
    retryable: false,
    selectorDriftSignal: false,
    fixtureKey: null,
    extra: {},
    artifacts: [],
    notification: {
      id: input.id ?? 1,
      jobId: "job-1",
      runId: "run-1",
      service: "python-scraper",
      scope: "grades_comps",
      queueName: null,
      kind: null,
      fatal: false,
      errorRate: null,
      createdAt: input.createdAt,
      scraperLogId: null,
    },
  };
}

describe("classifyIssueTypeTrend", () => {
  it("marks a type that has gone quiet as fixed", () => {
    expect(classifyIssueTypeTrend([4, 3, 2, 0, 0, 0])).toBe("fixed");
  });

  it("marks a type that rises in the second half as growing", () => {
    expect(classifyIssueTypeTrend([1, 1, 1, 4, 4, 4])).toBe("growing");
  });

  it("marks a type that stays in band as steady", () => {
    expect(classifyIssueTypeTrend([2, 2, 3, 2, 2, 3])).toBe("steady");
  });

  it("marks a type that drops but is still present as falling", () => {
    expect(classifyIssueTypeTrend([8, 8, 8, 2, 2, 1])).toBe("falling");
  });
});

describe("buildIssueTypeTimeline", () => {
  const window = {
    fromMs: Date.parse("2026-10-01T00:00:00.000Z"),
    toMs: Date.parse("2026-10-03T12:00:00.000Z"),
  };

  it("splits failure steps and warning steps onto separate lanes", () => {
    const issues = [
      row({
        step: "page_not_found",
        severity: "ERROR",
        message: "Page not found",
        createdAt: "2026-10-01T08:00:00.000Z",
      }),
      row({
        step: "validation_failed",
        severity: "WARN",
        message: "Validation failed",
        createdAt: "2026-10-02T08:00:00.000Z",
      }),
      row({
        step: "slow_response",
        severity: "WARN",
        message: "Slow response",
        createdAt: "2026-10-02T09:00:00.000Z",
      }),
    ];

    const errors = buildIssueTypeTimeline(issues, "error", window);
    const warnings = buildIssueTypeTimeline(issues, "warning", window);

    expect(errors.series.map((series) => series.label)).toEqual([
      "Page not found",
      "Validation failed",
    ]);
    expect(warnings.series.map((series) => series.label)).toEqual([
      "Slow response",
    ]);
    expect(errors.total).toBe(2);
    expect(warnings.total).toBe(1);
  });

  it("fills missing UTC days with zero so a stop is visible", () => {
    const issues = [
      row({
        step: "scrape_failed",
        severity: "ERROR",
        message: "Ingest rejected the payload",
        createdAt: "2026-10-02T23:30:00.000Z",
      }),
    ];

    const timeline = buildIssueTypeTimeline(issues, "error", window);

    expect(timeline.points.map((point) => point.bucket)).toEqual([
      "2026-10-01T00:00:00.000Z",
      "2026-10-02T00:00:00.000Z",
      "2026-10-03T00:00:00.000Z",
    ]);
    expect(timeline.points.map((point) => point.s0)).toEqual([0, 1, 0]);
    expect(timeline.series[0]?.trend).toBe("fixed");
  });

  it("keeps the busiest steps and rolls the rest into Other", () => {
    const issues: NotificationIssueRow[] = [];
    for (let index = 0; index < ISSUE_TYPE_SERIES_LIMIT + 2; index += 1) {
      const count = ISSUE_TYPE_SERIES_LIMIT + 2 - index;
      for (let copy = 0; copy < count; copy += 1) {
        issues.push(
          row({
            step: "scrape_failed",
            severity: "ERROR",
            message: `Type ${index} failed`,
            createdAt: "2026-10-02T01:00:00.000Z",
            id: issues.length + 1,
          }),
        );
      }
    }

    const timeline = buildIssueTypeTimeline(issues, "error", window);
    const labels = timeline.series.map((series) => series.label);

    expect(labels).toHaveLength(ISSUE_TYPE_SERIES_LIMIT + 1);
    expect(labels[0]).toBe("Type 0 failed");
    expect(labels.at(-1)).toBe("Other");
    expect(timeline.series.at(-1)?.total).toBe(1 + 2);
  });

  it("counts the same network error on different pages as one type", () => {
    expect(
      issueTypeKey(
        "net::ERR_EMPTY_RESPONSE at https://www.playhq.com/cricket-australia/org/brisbane-womens-cricket/brisbane-womens-competition-summer-202627/0ea20ff4",
        "scrape_failed",
      ),
    ).toBe("net::ERR_EMPTY_RESPONSE");

    const issues = [
      row({
        step: "scrape_failed",
        severity: "ERROR",
        message:
          "net::ERR_EMPTY_RESPONSE at https://www.playhq.com/cricket-australia/org/brisbane-womens-cricket/a",
        createdAt: "2026-10-01T08:00:00.000Z",
        id: 1,
      }),
      row({
        step: "scrape_failed",
        severity: "ERROR",
        message:
          "net::ERR_EMPTY_RESPONSE at https://www.playhq.com/cricket-australia/org/another-club/b",
        createdAt: "2026-10-02T08:00:00.000Z",
        id: 2,
      }),
    ];

    const timeline = buildIssueTypeTimeline(issues, "error", window);

    expect(timeline.series.map((series) => series.label)).toEqual([
      "net::ERR_EMPTY_RESPONSE",
    ]);
    expect(timeline.series[0]?.total).toBe(2);
  });

  it("turns a day's counts into a share of that day's errors and warnings", () => {
    const errors = buildIssueTypeTimeline(
      [
        row({
          step: "scrape_failed",
          severity: "ERROR",
          message: "net::ERR_EMPTY_RESPONSE at https://www.playhq.com/a",
          createdAt: "2026-10-01T08:00:00.000Z",
          id: 1,
        }),
        row({
          step: "scrape_failed",
          severity: "ERROR",
          message: "net::ERR_EMPTY_RESPONSE at https://www.playhq.com/b",
          createdAt: "2026-10-01T09:00:00.000Z",
          id: 2,
        }),
      ],
      "error",
      window,
    );
    const warnings = buildIssueTypeTimeline(
      [
        row({
          step: "content_wait",
          severity: "WARN",
          message: "Content still loading",
          createdAt: "2026-10-01T10:00:00.000Z",
          id: 3,
        }),
        row({
          step: "content_wait",
          severity: "WARN",
          message: "Content still loading",
          createdAt: "2026-10-01T11:00:00.000Z",
          id: 4,
        }),
      ],
      "warning",
      window,
    );

    const totals = dailyIssueTotals([errors, warnings]);
    const shared = toDailyIssueShare(errors, totals);
    const firstDay = shared.points[0];

    expect(totals.get("2026-10-01T00:00:00.000Z")).toBe(4);
    expect(firstDay?.s0).toBe(50);
    expect(firstDay?.s0Count).toBe(2);
    expect(shared.series[0]?.total).toBe(2);
  });
});
