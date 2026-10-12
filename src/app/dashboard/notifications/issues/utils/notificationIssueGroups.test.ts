import { describe, expect, it } from "vitest";
import type { NotificationIssueRow } from "@/types/notificationIssues";
import {
  groupNotificationIssues,
  isFailureSignatureRow,
  isWarningRow,
  normalizeIssueSeverity,
} from "./notificationIssueGroups";

function row(
  partial: Partial<NotificationIssueRow> & {
    notification: Partial<NotificationIssueRow["notification"]> & {
      id: number;
    };
  },
): NotificationIssueRow {
  return {
    issueIndex: partial.issueIndex ?? 0,
    step: partial.step ?? "request_timeout",
    severity: partial.severity ?? "ERROR",
    message: partial.message ?? "Timed out",
    url: partial.url ?? null,
    issueScope: partial.issueScope ?? null,
    retryable: partial.retryable ?? false,
    selectorDriftSignal: partial.selectorDriftSignal ?? false,
    fixtureKey: partial.fixtureKey ?? null,
    extra: partial.extra ?? {},
    artifacts: partial.artifacts ?? [],
    notification: {
      id: partial.notification.id,
      jobId: partial.notification.jobId ?? "job-1",
      runId: partial.notification.runId ?? "run-1",
      service: partial.notification.service ?? "python-scraper",
      scope: partial.notification.scope ?? "grades_comps",
      queueName: partial.notification.queueName ?? null,
      kind: partial.notification.kind ?? null,
      fatal: partial.notification.fatal ?? false,
      errorRate: partial.notification.errorRate ?? null,
      createdAt: partial.notification.createdAt ?? "2026-10-01T12:00:00.000Z",
      scraperLogId: partial.notification.scraperLogId ?? null,
    },
  };
}

describe("notificationIssueGroups", () => {
  it("normalizes severity for failure and warning detection", () => {
    expect(normalizeIssueSeverity("warn")).toBe("WARN");
    expect(normalizeIssueSeverity("WARNING")).toBe("WARN");
    expect(normalizeIssueSeverity("ERROR")).toBe("ERROR");
    expect(isFailureSignatureRow(row({ severity: "FATAL", notification: { id: 1 } }))).toBe(
      true,
    );
    expect(isWarningRow(row({ severity: "WARN", notification: { id: 1 } }))).toBe(true);
  });

  it("groups ERROR rows by step and message", () => {
    const issues = [
      row({
        message: "404",
        notification: { id: 1, jobId: "a", runId: "r1", createdAt: "2026-10-02T00:00:00.000Z" },
      }),
      row({
        message: "404",
        notification: { id: 2, jobId: "b", runId: "r2", createdAt: "2026-10-03T00:00:00.000Z" },
      }),
    ];

    const grouped = groupNotificationIssues(issues);
    expect(grouped.failures).toHaveLength(1);
    expect(grouped.failures[0]?.otherRuns).toHaveLength(1);
    expect(grouped.failures[0]?.primaryRun.notificationId).toBe(2);
  });

  it("nests warnings on failed runs inside the failure card", () => {
    const issues = [
      row({
        step: "navigate",
        severity: "ERROR",
        message: "Failed",
        issueIndex: 0,
        notification: { id: 10, fatal: true },
      }),
      row({
        step: "navigate",
        severity: "WARN",
        message: "Slow selector",
        issueIndex: 1,
        notification: { id: 10, fatal: true },
      }),
    ];

    const grouped = groupNotificationIssues(issues);
    expect(grouped.failures).toHaveLength(1);
    expect(grouped.failures[0]?.nestedWarnings).toHaveLength(1);
    expect(grouped.warnings).toHaveLength(0);
  });

  it("puts standalone warnings in the warnings section", () => {
    const issues = [
      row({
        step: "navigate",
        severity: "WARN",
        message: "Noise",
        notification: { id: 5, fatal: false },
      }),
    ];

    const grouped = groupNotificationIssues(issues);
    expect(grouped.failures).toHaveLength(0);
    expect(grouped.warnings).toHaveLength(1);
  });

  it("treats WARN on validation steps as failures", () => {
    const issues = [
      row({
        step: "post_extraction_validation",
        severity: "WARN",
        message: "Fixture count mismatch",
        notification: { id: 3, fatal: false },
      }),
    ];

    const grouped = groupNotificationIssues(issues);
    expect(grouped.failures).toHaveLength(1);
    expect(grouped.warnings).toHaveLength(0);
  });

  it("groups every row as failure when stepFocus is set", () => {
    const issues = [
      row({
        step: "post_extraction_validation",
        severity: "WARN",
        message: "A",
        notification: { id: 1 },
      }),
      row({
        step: "post_extraction_validation",
        severity: "WARN",
        message: "B",
        notification: { id: 2 },
      }),
    ];

    const grouped = groupNotificationIssues(issues, {
      stepFocus: "post_extraction_validation",
    });
    expect(grouped.failures).toHaveLength(2);
    expect(grouped.warnings).toHaveLength(0);
  });

  it("creates a failure card for fatal-only runs using warning text", () => {
    const issues = [
      row({
        severity: "WARN",
        message: "Only warning on fatal run",
        notification: { id: 7, fatal: true },
      }),
    ];

    const grouped = groupNotificationIssues(issues);
    expect(grouped.failures).toHaveLength(1);
    expect(grouped.failures[0]?.message).toBe("Only warning on fatal run");
    expect(grouped.warnings).toHaveLength(0);
  });
});
