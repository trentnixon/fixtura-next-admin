import { describe, expect, it } from "vitest";
import type { RenderInProgressRow } from "@/types/renderInProgress";
import type { TodaysRenders } from "@/types/scheduler";
import {
  getStuckRenderingAttention,
  getStuckRenderingAttentionFromInProgress,
  RENDER_ATTENTION_ERROR_MS,
  RENDER_ATTENTION_ISSUE_MS,
  resolveStuckRenderingSeverity,
  STUCK_RENDER_THRESHOLD_MS,
} from "@/lib/scheduler/renderAttention";

function baseItem(overrides: Partial<TodaysRenders> = {}): TodaysRenders {
  return {
    schedulerId: 1,
    schedulerName: "Morning",
    scheduledTime: new Date().toISOString(),
    isRendering: false,
    accountId: 99,
    accountName: "Test Club",
    accountSport: "Cricket",
    accountType: "club",
    queued: false,
    render: {
      renderId: 10,
      renderName: "render-abc",
      processing: true,
      complete: false,
      emailSent: false,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failureReason: null,
      queueWaitTimeSeconds: null,
    },
    ...overrides,
  };
}

describe("resolveStuckRenderingSeverity", () => {
  it("returns warning from 30m to under 2h", () => {
    const elapsed = STUCK_RENDER_THRESHOLD_MS + 60_000;
    expect(resolveStuckRenderingSeverity(elapsed)).toBe("warning");
  });

  it("returns issue from 2h to under 24h", () => {
    expect(resolveStuckRenderingSeverity(RENDER_ATTENTION_ISSUE_MS)).toBe(
      "issue"
    );
  });

  it("returns error at 24h+", () => {
    expect(resolveStuckRenderingSeverity(RENDER_ATTENTION_ERROR_MS)).toBe(
      "error"
    );
  });
});

describe("getStuckRenderingAttention", () => {
  const nowMs = Date.parse("2026-09-14T12:00:00.000Z");

  it("excludes runs under 30 minutes", () => {
    const items = getStuckRenderingAttention(
      [
        baseItem({
          render: {
            renderId: 1,
            renderName: "x",
            processing: true,
            complete: false,
            emailSent: false,
            startedAt: new Date(nowMs - 10 * 60_000).toISOString(),
            updatedAt: new Date(nowMs - 10 * 60_000).toISOString(),
            failureReason: null,
            queueWaitTimeSeconds: null,
          },
        }),
      ],
      nowMs
    );
    expect(items).toHaveLength(0);
  });

  it("sorts critical (24h+) ahead of warning", () => {
    const items = getStuckRenderingAttention(
      [
        baseItem({
          accountId: 1,
          render: {
            renderId: 1,
            renderName: "a",
            processing: true,
            complete: false,
            emailSent: false,
            startedAt: new Date(nowMs - 40 * 60_000).toISOString(),
            updatedAt: new Date(nowMs - 40 * 60_000).toISOString(),
            failureReason: null,
            queueWaitTimeSeconds: null,
          },
        }),
        baseItem({
          accountId: 2,
          render: {
            renderId: 2,
            renderName: "b",
            processing: true,
            complete: false,
            emailSent: false,
            startedAt: new Date(
              nowMs - RENDER_ATTENTION_ERROR_MS - 60_000
            ).toISOString(),
            updatedAt: new Date(
              nowMs - RENDER_ATTENTION_ERROR_MS - 60_000
            ).toISOString(),
            failureReason: null,
            queueWaitTimeSeconds: null,
          },
        }),
      ],
      nowMs
    );
    expect(items[0]?.accountId).toBe(2);
    expect(items[0]?.severity).toBe("error");
  });
});

function inProgressRow(
  overrides: Partial<RenderInProgressRow> = {}
): RenderInProgressRow {
  return {
    renderId: 10,
    renderName: "render-abc",
    processing: true,
    complete: false,
    startedAt: "2026-09-14T10:00:00.000Z",
    schedulerId: 4,
    schedulerName: "Morning",
    accountId: 99,
    accountName: "Metro",
    accountType: "Association",
    scheduledTime: "08:00:00",
    ...overrides,
  };
}

describe("getStuckRenderingAttentionFromInProgress", () => {
  const nowMs = Date.parse("2026-09-14T12:00:00.000Z");

  it("keeps a processing render older than today's slot", () => {
    const items = getStuckRenderingAttentionFromInProgress(
      [
        inProgressRow({
          startedAt: new Date(nowMs - 40 * 60 * 60 * 1000).toISOString(),
        }),
      ],
      nowMs
    );
    expect(items).toHaveLength(1);
    expect(items[0]?.severity).toBe("error");
    expect(items[0]?.accountType).toBe("Association");
  });

  it("drops renders that have been processing for under 30 minutes", () => {
    const items = getStuckRenderingAttentionFromInProgress(
      [
        inProgressRow({
          startedAt: new Date(nowMs - 10 * 60_000).toISOString(),
        }),
      ],
      nowMs
    );
    expect(items).toHaveLength(0);
  });

  it("keeps a processing render that has no start time", () => {
    const items = getStuckRenderingAttentionFromInProgress(
      [inProgressRow({ startedAt: null, schedulerId: null })],
      nowMs
    );
    expect(items).toHaveLength(1);
    expect(items[0]?.label).toBe("Processing · start time unknown");
    expect(items[0]?.schedulerId).toBeNull();
  });
});
