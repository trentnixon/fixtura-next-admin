import type { DueRenderAccuracy } from "@/lib/scheduler/dueRenderAccuracy";

export const CONTENT_PRODUCTION_SCHEDULERS_HREF = "/dashboard/schedulers";
export const CONTENT_PRODUCTION_LIVE_QUEUE_HREF = "/dashboard/schedulers?tab=live";
export const CONTENT_PRODUCTION_DOWNLOAD_ATTENTION_HREF =
  "/dashboard/renders/download-quality-control";

export type ContentProductionTile = {
  id: "accuracy" | "rendering" | "queued" | "download-attention";
  label: string;
  value: string;
  meta: string;
  href: string;
};

export type ContentProductionSummary = {
  title: string;
  description: string;
  tiles: [
    ContentProductionTile,
    ContentProductionTile,
    ContentProductionTile,
    ContentProductionTile,
  ];
  chartHeaderHref: string;
  needsALookHref: string;
  attentionCount: number;
  emptyAttentionMessage: string | null;
};

function countValue(count: number | null, readyMeta: string): { value: string; meta: string } {
  if (count == null) return { value: "—", meta: "Unavailable" };
  return { value: String(count), meta: readyMeta };
}

function accuracyValue(accuracy: DueRenderAccuracy): string {
  if (accuracy.kind === "none") return "None";
  if (accuracy.kind === "upcoming") return "—";
  return `${accuracy.percent}%`;
}

function emptyAttentionMessage(
  accuracy: DueRenderAccuracy | null,
  attentionCount: number,
): string | null {
  if (attentionCount > 0) return null;
  if (accuracy?.kind === "scored") {
    return "Every due render in these 7 Sydney days finished.";
  }
  if (accuracy?.kind === "upcoming") {
    return "Nothing has come up yet in these 7 Sydney days.";
  }
  return "Nothing fell in these 7 Sydney days.";
}

function accuracyTile(accuracy: DueRenderAccuracy | null): { value: string; meta: string } {
  if (accuracy == null) return { value: "—", meta: "Unavailable" };
  return { value: accuracyValue(accuracy), meta: "7 Sydney days" };
}

export function buildContentProductionSummary(input: {
  accuracy: DueRenderAccuracy | null;
  renderingCount: number | null;
  queuedCount: number | null;
  downloadAttentionTotal: number | null;
  attentionCount: number;
}): ContentProductionSummary {
  const accuracy = accuracyTile(input.accuracy);
  const rendering = countValue(input.renderingCount, "Active today");
  const queued = countValue(input.queuedCount, "Waiting today");
  const downloadAttention = countValue(input.downloadAttentionTotal, "Rolling 7 days");

  return {
    title: "Content production",
    description:
      "Due-render accuracy for 7 Sydney days, today's queue, and download attention over a rolling 7 days.",
    tiles: [
      {
        id: "accuracy",
        label: "Accuracy",
        value: accuracy.value,
        meta: accuracy.meta,
        href: CONTENT_PRODUCTION_SCHEDULERS_HREF,
      },
      {
        id: "rendering",
        label: "Rendering",
        value: rendering.value,
        meta: rendering.meta,
        href: CONTENT_PRODUCTION_LIVE_QUEUE_HREF,
      },
      {
        id: "queued",
        label: "Queued",
        value: queued.value,
        meta: queued.meta,
        href: CONTENT_PRODUCTION_LIVE_QUEUE_HREF,
      },
      {
        id: "download-attention",
        label: "Download attention",
        value: downloadAttention.value,
        meta: downloadAttention.meta,
        href: CONTENT_PRODUCTION_DOWNLOAD_ATTENTION_HREF,
      },
    ],
    chartHeaderHref: CONTENT_PRODUCTION_SCHEDULERS_HREF,
    needsALookHref: CONTENT_PRODUCTION_SCHEDULERS_HREF,
    attentionCount: input.attentionCount,
    emptyAttentionMessage: emptyAttentionMessage(input.accuracy, input.attentionCount),
  };
}
