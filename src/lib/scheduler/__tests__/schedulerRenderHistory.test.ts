import { describe, expect, it } from "vitest";
import {
  formatQueueWait,
  formatRenderDuration,
  formatSydneyDateTime,
  formatSydneyScheduleTime,
  isStalledRender,
  latestSchedulerRenders,
  queueWaitSeconds,
  relationCount,
  renderDurationMs,
  renderFailureMessage,
  schedulerRenderOutcome,
} from "@/lib/scheduler/schedulerRenderHistory";
import type { Render } from "@/types/render";

function render(partial: {
  id: number;
  createdAt?: string;
  publishedAt?: string | null;
  updatedAt?: string;
  complete?: boolean;
  processing?: boolean;
  userError?: string | null;
}): Render {
  return {
    id: partial.id,
    attributes: {
      Name: "Render",
      Processing: partial.processing ?? false,
      Complete: partial.complete ?? false,
      sendEmail: false,
      hasTeamRosterRequest: false,
      hasTeamRosters: false,
      forceRerender: false,
      EmailSent: false,
      forceRerenderEmail: false,
      hasTeamRosterEmail: false,
      createdAt: partial.createdAt,
      updatedAt: partial.updatedAt ?? partial.createdAt ?? "2026-10-06T00:00:00.000Z",
      publishedAt: partial.publishedAt ?? null,
      isCreatingRoster: false,
      downloads: {
        data: partial.userError
          ? [
              {
                id: 1,
                attributes: {
                  Name: "Asset",
                  URL: null,
                  grouping_category: "",
                  isAccurate: null,
                  hasBeenProcessed: true,
                  forceRerender: false,
                  DisplayCost: 0,
                  CompletionTime: "",
                  OutputFileSize: "",
                  UserErrorMessage: partial.userError,
                  hasError: true,
                  downloads: {},
                  numDownloads: 0,
                  assetLinkID: "",
                  gameID: null,
                  errorEmailSentToAdmin: false,
                  updatedAt: partial.updatedAt ?? "2026-10-06T00:00:00.000Z",
                  asset: { data: { id: 1, attributes: { Name: "A", CompositionID: "c" } } },
                  asset_category: { data: { id: 1, attributes: { Identifier: "x" } } },
                },
              },
            ]
          : [],
      },
      scheduler: {
        data: {
          id: 1,
          Name: "S",
          attributes: {
            Name: "S",
            Time: "09:00:00",
            isRendering: false,
            Queued: false,
            isActive: true,
            updatedAt: "2026-10-06T00:00:00.000Z",
            createdAt: "2026-10-06T00:00:00.000Z",
            renders: { data: [] },
            days_of_the_week: { data: { attributes: { Name: "Monday" } } },
          },
        },
      },
      game_results_in_renders: { data: [] },
      upcoming_games_in_renders: { data: [] },
      grades_in_renders: { data: [] },
      ai_articles: { data: [] },
      rerenderRequested: false,
    },
  };
}

describe("scheduler render history", () => {
  it("does not call an in-progress render a failure", () => {
    expect(schedulerRenderOutcome({ complete: false, processing: true })).toBe(
      "running",
    );
    expect(schedulerRenderOutcome({ complete: true, processing: false })).toBe(
      "success",
    );
    expect(schedulerRenderOutcome({ complete: false, processing: false })).toBe(
      "failed",
    );
  });

  it("formats Sydney date and schedule clock", () => {
    expect(formatSydneyDateTime("2026-10-05T22:12:00.000Z")).toBe(
      "6 Oct 2026, 09:12",
    );
    expect(formatSydneyDateTime("2026-06-15T23:12:00.000Z")).toBe(
      "16 June 2026, 09:12",
    );
    expect(formatSydneyScheduleTime("9:00:00")).toBe("09:00 Sydney");
    expect(formatSydneyScheduleTime(null)).toBe("time not set");
  });

  it("measures queue wait from the Sydney schedule clock", () => {
    expect(
      queueWaitSeconds({
        scheduleTime: "09:00:00",
        startedAt: "2026-10-05T22:12:00.000Z",
      }),
    ).toBe(12 * 60);
    expect(
      queueWaitSeconds({
        scheduleTime: "09:00:00",
        startedAt: "2026-06-15T23:12:00.000Z",
      }),
    ).toBe(12 * 60);
    expect(formatQueueWait(720)).toBe("720s");
    expect(formatQueueWait(null)).toBe("--");
  });

  it("uses now while a render is still processing and flags 30 minutes", () => {
    const startedAt = "2026-10-05T22:00:00.000Z";
    const nowMs = Date.parse("2026-10-05T22:40:00.000Z");
    const durationMs = renderDurationMs({
      startedAt,
      updatedAt: startedAt,
      processing: true,
      nowMs,
    });
    expect(formatRenderDuration(durationMs)).toBe("40m");
    expect(isStalledRender({ processing: true, durationMs })).toBe(true);
    expect(
      isStalledRender({
        processing: true,
        durationMs: 10 * 60_000,
      }),
    ).toBe(false);
  });

  it("sorts newest first and keeps the latest 25", () => {
    const renders = Array.from({ length: 30 }, (_, index) =>
      render({
        id: index + 1,
        createdAt: new Date(Date.UTC(2026, 0, 1, 0, index)).toISOString(),
      }),
    );
    const history = latestSchedulerRenders(renders);
    expect(history.total).toBe(30);
    expect(history.rows).toHaveLength(25);
    expect(history.rows[0]?.id).toBe(30);
    expect(history.rows.at(-1)?.id).toBe(6);
  });

  it("reads the first download error and relation counts", () => {
    expect(
      renderFailureMessage(render({ id: 4, userError: "ASSET_FAILURE" })),
    ).toBe("ASSET_FAILURE");
    expect(renderFailureMessage(render({ id: 5 }))).toBeNull();
    expect(relationCount({ count: 3 })).toBe(3);
    expect(relationCount({ data: [{ id: 1 }, { id: 2 }] })).toBe(2);
  });
});
