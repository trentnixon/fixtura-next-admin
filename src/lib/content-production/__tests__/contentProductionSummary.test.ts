import { describe, expect, it } from "vitest";
import { buildContentProductionSummary } from "@/lib/content-production/contentProductionSummary";
import type { DueRenderAccuracy } from "@/lib/scheduler/dueRenderAccuracy";

const SCORED: DueRenderAccuracy = {
  kind: "scored",
  percent: 80,
  processed: 8,
  due: 10,
  inProgress: 1,
  missed: 1,
  failed: 0,
  upcoming: 2,
};

describe("buildContentProductionSummary", () => {
  it("labels scored accuracy, today's queue, and download attention with their destinations", () => {
    const summary = buildContentProductionSummary({
      accuracy: SCORED,
      renderingCount: 3,
      queuedCount: 2,
      downloadAttentionTotal: 4,
      attentionCount: 2,
    });

    expect(summary.title).toBe("Content production");
    expect(summary.description).toBe(
      "Due-render accuracy for 7 Sydney days, today's queue, and download attention over a rolling 7 days.",
    );
    expect(summary.tiles).toEqual([
      {
        id: "accuracy",
        label: "Accuracy",
        value: "80%",
        meta: "7 Sydney days",
        href: "/dashboard/schedulers",
      },
      {
        id: "rendering",
        label: "Rendering",
        value: "3",
        meta: "Active today",
        href: "/dashboard/schedulers?tab=live",
      },
      {
        id: "queued",
        label: "Queued",
        value: "2",
        meta: "Waiting today",
        href: "/dashboard/schedulers?tab=live",
      },
      {
        id: "download-attention",
        label: "Download attention",
        value: "4",
        meta: "Rolling 7 days",
        href: "/dashboard/renders/download-quality-control",
      },
    ]);
    expect(summary.chartHeaderHref).toBe("/dashboard/schedulers");
    expect(summary.needsALookHref).toBe("/dashboard/schedulers");
    expect(summary.attentionCount).toBe(2);
    expect(summary.emptyAttentionMessage).toBeNull();
  });

  it("keeps an empty needs-a-look result visible as a sentence", () => {
    const summary = buildContentProductionSummary({
      accuracy: { kind: "none" },
      renderingCount: 0,
      queuedCount: 0,
      downloadAttentionTotal: 0,
      attentionCount: 0,
    });

    expect(summary.tiles[0]).toMatchObject({ value: "None", meta: "7 Sydney days" });
    expect(summary.emptyAttentionMessage).toBe(
      "Nothing fell in these 7 Sydney days.",
    );
  });

  it("says the window finished when every due render is done", () => {
    const summary = buildContentProductionSummary({
      accuracy: {
        kind: "scored",
        percent: 100,
        processed: 2,
        due: 2,
        inProgress: 0,
        missed: 0,
        failed: 0,
        upcoming: 0,
      },
      renderingCount: 0,
      queuedCount: 0,
      downloadAttentionTotal: 0,
      attentionCount: 0,
    });

    expect(summary.emptyAttentionMessage).toBe(
      "Every due render in these 7 Sydney days finished.",
    );
  });

  it("shows download attention as unavailable when the total is missing", () => {
    const summary = buildContentProductionSummary({
      accuracy: { kind: "upcoming", upcoming: 3 },
      renderingCount: 1,
      queuedCount: 0,
      downloadAttentionTotal: null,
      attentionCount: 1,
    });

    expect(summary.tiles[0]).toMatchObject({ value: "—", meta: "7 Sydney days" });
    expect(summary.tiles[3]).toEqual({
      id: "download-attention",
      label: "Download attention",
      value: "—",
      meta: "Unavailable",
      href: "/dashboard/renders/download-quality-control",
    });
  });

  it("shows accuracy and today's queue as unavailable when those feeds are missing", () => {
    const summary = buildContentProductionSummary({
      accuracy: null,
      renderingCount: null,
      queuedCount: null,
      downloadAttentionTotal: 0,
      attentionCount: 0,
    });

    expect(summary.tiles[0]).toMatchObject({ value: "—", meta: "Unavailable" });
    expect(summary.tiles[1]).toMatchObject({ value: "—", meta: "Unavailable" });
    expect(summary.tiles[2]).toMatchObject({ value: "—", meta: "Unavailable" });
  });
});
