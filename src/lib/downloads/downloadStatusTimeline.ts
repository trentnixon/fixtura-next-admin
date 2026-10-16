import {
  classifyDownloadAttention,
  type DownloadAttentionBucket,
} from "@/lib/downloads/downloadAttention";
import type { Download } from "@/types/download";

const SYDNEY_TIME_ZONE = "Australia/Sydney";

/** Timeline page filter: every status bucket, or all of them. */
export type DownloadStatusFilter = "all" | DownloadAttentionBucket;

export type DownloadTimelineDateGroup = {
  dateKey: string;
  dateLabel: string;
  rows: Download[];
};

export type DownloadStatusPageCounts = Record<DownloadAttentionBucket, number>;

export function downloadStatusLabel(bucket: DownloadAttentionBucket): string {
  switch (bucket) {
    case "failed":
      return "Failed";
    case "in_progress":
      return "In progress";
    case "ok":
      return "Done";
    case "unknown":
      return "Unknown";
  }
}

export function classifyDownloadFromEntity(
  download: Download,
): DownloadAttentionBucket {
  const attrs = download.attributes;
  return classifyDownloadAttention({
    hasError: attrs.hasError,
    hasBeenProcessed: attrs.hasBeenProcessed,
    errorHandler: attrs.errorHandler,
  });
}

export function countDownloadStatusOnPage(
  downloads: readonly Download[],
): DownloadStatusPageCounts {
  const counts: DownloadStatusPageCounts = {
    failed: 0,
    in_progress: 0,
    ok: 0,
    unknown: 0,
  };
  for (const row of downloads) {
    const bucket = classifyDownloadFromEntity(row);
    counts[bucket] += 1;
  }
  return counts;
}

export function filterDownloadsOnPageByStatus(
  downloads: readonly Download[],
  filter: DownloadStatusFilter,
): Download[] {
  if (filter === "all") {
    return [...downloads];
  }
  return downloads.filter(
    (row) => classifyDownloadFromEntity(row) === filter,
  );
}

type TimelineAccountRelation = {
  data?: {
    id?: number;
    attributes?: {
      FirstName?: string | null;
      LastName?: string | null;
      Sport?: string | null;
    };
  } | null;
};

export function resolveTimelineAccountLabel(download: Download): {
  id: number | null;
  label: string;
  sport: string | null;
} {
  const account = (download.attributes as Download["attributes"] & {
    account?: TimelineAccountRelation;
  }).account;

  const id = account?.data?.id ?? null;
  const attrs = account?.data?.attributes;
  const label =
    [attrs?.FirstName, attrs?.LastName].filter(Boolean).join(" ").trim() ||
    (id != null ? `Account ${id}` : "—");
  const sport = attrs?.Sport?.trim() || null;
  return { id, label, sport };
}

export function resolveTimelineAssetCategory(
  download: Download,
): string | null {
  const identifier =
    download.attributes.asset_category?.data?.attributes?.Identifier?.trim();
  const name =
    download.attributes.asset_category?.data?.attributes?.Name?.trim();
  return identifier || name || null;
}

export function resolveTimelineRenderRef(download: Download): {
  id: number | null;
  name: string | null;
} {
  const render = download.attributes.render?.data;
  if (!render) {
    return { id: null, name: null };
  }
  return {
    id: render.id ?? null,
    name: render.attributes?.Name?.trim() || null,
  };
}

/** Sydney calendar day for grouping (`YYYY-MM-DD`). */
export function sydneyDateKeyFromIso(iso: string | null | undefined): string | null {
  if (iso == null || iso.trim() === "") return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SYDNEY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Date line for group headers, e.g. `15 Oct 2026,` */
export function formatSydneyTimelineDateLabel(
  iso: string | null | undefined,
): string | null {
  if (iso == null || iso.trim() === "") return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  const datePart = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: SYDNEY_TIME_ZONE,
  }).format(date);

  return `${datePart},`;
}

/** Clock time for row cells, e.g. `23:33` */
export function formatSydneyTimelineTime(
  iso: string | null | undefined,
): string | null {
  if (iso == null || iso.trim() === "") return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: SYDNEY_TIME_ZONE,
  }).format(date);
}

/** Relative updated time: `just now`, `12 min ago`, `3 hours ago`, `2 days ago`. */
export function formatDownloadUpdatedAgo(
  iso: string | null | undefined,
  nowMs: number = Date.now(),
): string | null {
  if (iso == null || iso.trim() === "") return null;
  const thenMs = Date.parse(iso);
  if (!Number.isFinite(thenMs)) return null;

  const diffMs = Math.max(0, nowMs - thenMs);
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/** Preserve API order; insert a header when the Sydney day changes. */
export function groupDownloadsBySydneyDate(
  downloads: readonly Download[],
): DownloadTimelineDateGroup[] {
  const groups: DownloadTimelineDateGroup[] = [];
  const indexByKey = new Map<string, number>();

  for (const download of downloads) {
    const iso = download.attributes.updatedAt;
    const dateKey = sydneyDateKeyFromIso(iso) ?? "unknown";
    let groupIndex = indexByKey.get(dateKey);

    if (groupIndex === undefined) {
      groupIndex = groups.length;
      indexByKey.set(dateKey, groupIndex);
      groups.push({
        dateKey,
        dateLabel:
          dateKey === "unknown"
            ? "Unknown date"
            : formatSydneyTimelineDateLabel(iso) ?? dateKey,
        rows: [],
      });
    }

    groups[groupIndex]!.rows.push(download);
  }

  return groups;
}
