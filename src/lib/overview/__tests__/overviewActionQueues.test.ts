import { describe, expect, it } from "vitest";
import type { ContactFormSubmission } from "@/types/contact-form";
import type { NotificationHealthData } from "@/types/notificationHealth";
import type { RerenderRequest } from "@/types/rerender-request";
import {
  countContactFormActionQueue,
  countUnhandledRerenderRequests,
  countUnseenContactSubmissions,
  countVisibleOverviewPanels,
  getContactFormActionQueue,
  getUnhandledRerenderRequests,
  summarizeNotificationHealthAttention,
} from "@/lib/overview/overviewActionQueues";

function rerender(
  overrides: Partial<RerenderRequest> = {}
): RerenderRequest {
  return {
    id: 1,
    accountId: 10,
    accountName: "Club A",
    renderId: 100,
    renderName: "Weekly",
    reason: "Fix logo",
    userEmail: "user@example.com",
    additionalNotes: null,
    status: "Pending",
    hasBeenHandled: false,
    createdAt: "2026-09-08T10:00:00.000Z",
    updatedAt: "2026-09-08T10:00:00.000Z",
    ...overrides,
  };
}

function contact(
  overrides: Partial<ContactFormSubmission> = {}
): ContactFormSubmission {
  return {
    id: 1,
    name: "Pat",
    email: "pat@example.com",
    subject: "Help",
    text: "Need support",
    timestamp: "2026-09-08T09:00:00.000Z",
    status: "New",
    ip: null,
    userAgent: null,
    hasSeen: false,
    Acknowledged: false,
    ...overrides,
  };
}

describe("getUnhandledRerenderRequests", () => {
  it("returns only unhandled requests sorted newest first", () => {
    const items = getUnhandledRerenderRequests([
      rerender({ id: 1, hasBeenHandled: true, createdAt: "2026-09-08T12:00:00.000Z" }),
      rerender({ id: 2, hasBeenHandled: false, createdAt: "2026-09-08T11:00:00.000Z" }),
      rerender({ id: 3, hasBeenHandled: false, createdAt: "2026-09-08T13:00:00.000Z" }),
    ]);

    expect(items.map((item) => item.id)).toEqual([3, 2]);
  });
});

describe("countUnhandledRerenderRequests", () => {
  it("counts unhandled only", () => {
    expect(
      countUnhandledRerenderRequests([
        rerender({ hasBeenHandled: false }),
        rerender({ hasBeenHandled: true }),
      ])
    ).toBe(1);
  });
});

describe("getContactFormActionQueue", () => {
  it("includes unseen or unacknowledged submissions", () => {
    const items = getContactFormActionQueue([
      contact({ id: 1, hasSeen: true, Acknowledged: true }),
      contact({ id: 2, hasSeen: false, Acknowledged: true }),
      contact({ id: 3, hasSeen: true, Acknowledged: false }),
    ]);

    expect(items.map((item) => item.id)).toEqual([2, 3]);
  });
});

describe("contact form counts", () => {
  it("counts action queue and unseen separately", () => {
    const submissions = [
      contact({ id: 1, hasSeen: false, Acknowledged: false }),
      contact({ id: 2, hasSeen: true, Acknowledged: false }),
      contact({ id: 3, hasSeen: true, Acknowledged: true }),
    ];

    expect(countContactFormActionQueue(submissions)).toBe(2);
    expect(countUnseenContactSubmissions(submissions)).toBe(1);
  });
});

describe("summarizeNotificationHealthAttention", () => {
  it("returns no attention when data is missing", () => {
    expect(summarizeNotificationHealthAttention(undefined)).toEqual({
      fatalCount: 0,
      totalIssueRows: 0,
      retryableCount: 0,
      selectorDriftCount: 0,
      fixturesFailed: 0,
      hasAttention: false,
      summaryParts: [],
    });
  });

  it("flags attention when fatal or issue counts are present", () => {
    const summary = summarizeNotificationHealthAttention({
      window: {
        from: "2026-09-01T00:00:00.000Z",
        to: "2026-09-08T00:00:00.000Z",
        fromMs: 0,
        toMs: 1,
      },
      notifications: {
        notificationCount: 10,
        fatalCount: 2,
        nonFatalCount: 8,
      },
      metricsSums: {
        fixturesTotal: 100,
        fixturesSucceeded: 90,
        fixturesFailed: 10,
        durationMs: 1000,
        ingest_total: 0,
        ingest_success: 0,
        ingest_failed: 0,
        ingest_retried: 0,
      },
      rates: {
        weightedFixtureErrorRate: 0.1,
        avgErrorRate: 0.1,
      },
      byDimension: {
        byService: {},
        byScope: {},
        byQueueName: {},
        byKind: {},
      },
      issues: {
        totalIssueRows: 5,
        byStep: {},
        bySeverity: {},
        byIssueScope: {},
        topMessages: [],
        retryableCount: 1,
        selectorDriftCount: 0,
      },
      timeline: { byDay: [] },
    } satisfies NotificationHealthData);

    expect(summary.hasAttention).toBe(true);
    expect(summary.summaryParts).toEqual([
      "2 fatal",
      "5 issue rows",
      "1 retryable",
    ]);
  });

  it("flags attention when only fixture failures are present", () => {
    const summary = summarizeNotificationHealthAttention({
      window: {
        from: "2026-09-01T00:00:00.000Z",
        to: "2026-09-08T00:00:00.000Z",
        fromMs: 0,
        toMs: 1,
      },
      notifications: {
        notificationCount: 1,
        fatalCount: 0,
        nonFatalCount: 1,
      },
      metricsSums: {
        fixturesTotal: 10,
        fixturesSucceeded: 5,
        fixturesFailed: 5,
        durationMs: 100,
        ingest_total: 0,
        ingest_success: 0,
        ingest_failed: 0,
        ingest_retried: 0,
      },
      rates: {
        weightedFixtureErrorRate: 0.5,
        avgErrorRate: 0.5,
      },
      byDimension: {
        byService: {},
        byScope: {},
        byQueueName: {},
        byKind: {},
      },
      issues: {
        totalIssueRows: 0,
        byStep: {},
        bySeverity: {},
        byIssueScope: {},
        topMessages: [],
        retryableCount: 0,
        selectorDriftCount: 0,
      },
      timeline: { byDay: [] },
    } satisfies NotificationHealthData);

    expect(summary.hasAttention).toBe(true);
  });
});

describe("countVisibleOverviewPanels", () => {
  it("counts true flags", () => {
    expect(countVisibleOverviewPanels([true, false, true])).toBe(2);
  });
});
