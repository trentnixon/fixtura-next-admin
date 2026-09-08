import { describe, expect, it } from "vitest";
import {
  ATTENTION_ERROR_MS,
  ATTENTION_WARNING_MS,
  getDataRefreshAttentionRuns,
  resolveDataRefreshAttentionSeverity,
  resolveRunDurationMs,
  STUCK_RUN_THRESHOLD_MS,
} from "@/lib/account-health/globalRunAnalytics";
import type { AccountHealthGlobalLatestRunRow } from "@/types/accountHealth";

function baseRun(
  overrides: Partial<AccountHealthGlobalLatestRunRow> = {}
): AccountHealthGlobalLatestRunRow {
  return {
    id: 1,
    accountId: 100,
    accountName: "Test Club",
    primaryOrgLabel: null,
    status: "running",
    accountType: "club",
    startedAt: new Date().toISOString(),
    completedAt: null,
    failedAt: null,
    finalizedAt: null,
    failureReason: null,
    summary: null,
    ...overrides,
  };
}

describe("resolveDataRefreshAttentionSeverity", () => {
  const nowMs = Date.parse("2026-09-08T12:00:00.000Z");

  it("returns normal under 20 minutes", () => {
    expect(
      resolveDataRefreshAttentionSeverity(
        {
          status: "running",
          startedAt: new Date(nowMs - 10 * 60_000).toISOString(),
          finalizedAt: null,
        },
        nowMs
      )
    ).toBe("normal");
  });

  it("returns warning between 20 and 30 minutes", () => {
    expect(
      resolveDataRefreshAttentionSeverity(
        {
          status: "running",
          startedAt: new Date(nowMs - 25 * 60_000).toISOString(),
          finalizedAt: null,
        },
        nowMs
      )
    ).toBe("warning");
  });

  it("returns issue between 30 minutes and 1 hour", () => {
    expect(
      resolveDataRefreshAttentionSeverity(
        {
          status: "running",
          startedAt: new Date(nowMs - 37 * 60_000).toISOString(),
          finalizedAt: null,
        },
        nowMs
      )
    ).toBe("issue");
  });

  it("returns error at or beyond 1 hour", () => {
    expect(
      resolveDataRefreshAttentionSeverity(
        {
          status: "running",
          startedAt: new Date(nowMs - ATTENTION_ERROR_MS).toISOString(),
          finalizedAt: null,
        },
        nowMs
      )
    ).toBe("error");
  });

  it("returns error for completed limbo and missing start time", () => {
    expect(
      resolveDataRefreshAttentionSeverity(
        {
          status: "completed",
          startedAt: "2026-09-08T10:00:00.000Z",
          finalizedAt: null,
        },
        nowMs
      )
    ).toBe("error");

    expect(
      resolveDataRefreshAttentionSeverity(
        {
          status: "queued",
          startedAt: null,
          finalizedAt: null,
        },
        nowMs
      )
    ).toBe("error");
  });
});

describe("getDataRefreshAttentionRuns", () => {
  const nowMs = Date.parse("2026-09-08T12:00:00.000Z");

  it("includes active runs with normal severity under 20 minutes", () => {
    const runs = getDataRefreshAttentionRuns(
      [
        baseRun({
          status: "running",
          startedAt: new Date(nowMs - 5 * 60_000).toISOString(),
        }),
      ],
      nowMs
    );
    expect(runs).toHaveLength(1);
    expect(runs[0]?.attentionKind).toBe("active");
    expect(runs[0]?.severity).toBe("normal");
    expect(runs[0]?.severityLabel).toBeNull();
  });

  it("marks 37 minute runs as issue severity", () => {
    const runs = getDataRefreshAttentionRuns(
      [
        baseRun({
          status: "running",
          startedAt: new Date(nowMs - 37 * 60_000).toISOString(),
        }),
      ],
      nowMs
    );
    expect(runs[0]?.severity).toBe("issue");
    expect(runs[0]?.severityLabel).toBe("Issue");
    expect(runs[0]?.attentionLabel).toBe("Running · delayed");
  });

  it("classifies long-running active runs as stuck with error severity", () => {
    const startedAt = new Date(
      nowMs - STUCK_RUN_THRESHOLD_MS - 60_000
    ).toISOString();
    const runs = getDataRefreshAttentionRuns(
      [baseRun({ status: "running", startedAt })],
      nowMs
    );
    expect(runs[0]?.attentionKind).toBe("stuck");
    expect(runs[0]?.attentionLabel).toBe("Stuck");
    expect(runs[0]?.severity).toBe("error");
  });

  it("includes completed limbo runs as error severity", () => {
    const runs = getDataRefreshAttentionRuns(
      [
        baseRun({
          status: "completed",
          finalizedAt: null,
          startedAt: "2026-09-08T10:00:00.000Z",
        }),
      ],
      nowMs
    );
    expect(runs[0]?.attentionKind).toBe("completed_limbo");
    expect(runs[0]?.attentionLabel).toBe("Needs reconcile");
    expect(runs[0]?.severity).toBe("error");
    expect(runs[0]?.severityLabel).toBe("Error");
  });

  it("excludes finalized and failed runs", () => {
    const runs = getDataRefreshAttentionRuns(
      [
        baseRun({ status: "finalized", finalizedAt: "2026-09-08T11:00:00.000Z" }),
        baseRun({ id: 2, status: "failed", failureReason: "boom" }),
      ],
      nowMs
    );
    expect(runs).toHaveLength(0);
  });

  it("sorts by severity before kind", () => {
    const runs = getDataRefreshAttentionRuns(
      [
        baseRun({
          id: 1,
          status: "queued",
          startedAt: new Date(nowMs - 10 * 60_000).toISOString(),
        }),
        baseRun({
          id: 2,
          status: "completed",
          finalizedAt: null,
          startedAt: "2026-09-08T10:00:00.000Z",
        }),
        baseRun({
          id: 3,
          status: "running",
          startedAt: new Date(nowMs - 37 * 60_000).toISOString(),
        }),
        baseRun({
          id: 4,
          status: "running",
          startedAt: new Date(
            nowMs - STUCK_RUN_THRESHOLD_MS - 60_000
          ).toISOString(),
        }),
      ],
      nowMs
    );
    expect(runs.map((run) => run.severity)).toEqual([
      "error",
      "error",
      "issue",
      "normal",
    ]);
  });

  it("labels warning runs after 20 minutes", () => {
    const runs = getDataRefreshAttentionRuns(
      [
        baseRun({
          status: "running",
          startedAt: new Date(nowMs - ATTENTION_WARNING_MS - 60_000).toISOString(),
        }),
      ],
      nowMs
    );
    expect(runs[0]?.severity).toBe("warning");
    expect(runs[0]?.attentionLabel).toBe("Running · slow");
  });

  it("labels hour-plus runs as overdue error", () => {
    const runs = getDataRefreshAttentionRuns(
      [
        baseRun({
          status: "running",
          startedAt: new Date(nowMs - ATTENTION_ERROR_MS - 60_000).toISOString(),
        }),
      ],
      nowMs
    );
    expect(runs[0]?.attentionKind).toBe("active");
    expect(runs[0]?.severity).toBe("error");
    expect(runs[0]?.attentionLabel).toBe("Running · overdue");
  });
});

describe("resolveRunDurationMs", () => {
  const start = "2026-09-06T04:00:00.000Z";
  const finalized = "2026-09-08T09:42:00.000Z";

  it("uses finalizedAt as end for completed runs", () => {
    const ms = resolveRunDurationMs({
      status: "finalized",
      startedAt: start,
      finalizedAt: finalized,
      failedAt: null,
      completedAt: "2026-09-08T09:51:00.000Z",
    });
    expect(ms).toBe(Date.parse(finalized) - Date.parse(start));
  });

  it("falls back to completedAt when finalized is missing", () => {
    const completed = "2026-09-08T09:51:00.000Z";
    const ms = resolveRunDurationMs({
      status: "completed",
      startedAt: start,
      finalizedAt: null,
      failedAt: null,
      completedAt: completed,
    });
    expect(ms).toBe(Date.parse(completed) - Date.parse(start));
  });

  it("returns live elapsed for active runs", () => {
    const nowMs = Date.parse(start) + 90_000;
    const ms = resolveRunDurationMs(
      {
        status: "running",
        startedAt: start,
        finalizedAt: null,
        failedAt: null,
      },
      nowMs,
    );
    expect(ms).toBe(90_000);
  });
});
