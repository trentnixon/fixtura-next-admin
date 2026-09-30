/** Server attention bucket; ok/unknown appear when needsAttention=false (all in window). */
export type DownloadQualityQueueAttention =
  | "failed"
  | "in_progress"
  | "ok"
  | "unknown";

export type DownloadQualityQueueParams = {
  from: string;
  to: string;
  page?: number;
  pageSize?: number;
  needsAttention?: boolean;
};

export type DownloadQualitySport =
  | "Cricket"
  | "AFL"
  | "Hockey"
  | "Netball"
  | "Basketball";

export type DownloadQualityQueueRow = {
  downloadId: number;
  name: string | null;
  hasError: boolean | null;
  hasBeenProcessed: boolean;
  attention: DownloadQualityQueueAttention;
  userErrorMessage: string | null;
  errorHandler: Array<{ Message?: string; Type?: string }> | null;
  errorEmailSentToAdmin: boolean;
  forceRerender: boolean;
  groupingCategory: string | null;
  assetCategoryIdentifier: string | null;
  assetCategoryName: string | null;
  assetName: string | null;
  assetLinkId: string | null;
  gameId: string | null;
  url: string | null;
  updatedAt: string;
  render: {
    id: number;
    name: string | null;
    complete: boolean;
    processing: boolean;
    publishedAt: string | null;
  } | null;
  account: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    sport: DownloadQualitySport | null;
    type: string | null;
  } | null;
};

/** CMS envelope meta — @see .comms/Strapi/handoff/cms-handoff-download-quality-queue.md */
export type DownloadQualityQueueMeta = {
  from: string;
  to: string;
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  returned: number;
};

/** Admin-only meta flags (not on CMS wire). */
export type DownloadQualityQueueClientMeta = DownloadQualityQueueMeta & {
  /** Route missing (404/501). */
  queueAvailable?: false;
  /** CMS rejected needsAttention=false. */
  allScopeUnsupported?: true;
};

export type DownloadQualityQueueResponse = {
  data: DownloadQualityQueueRow[];
  meta: DownloadQualityQueueMeta | DownloadQualityQueueClientMeta;
};

export function isDownloadQualityQueueUnavailable(
  meta: DownloadQualityQueueResponse["meta"] | undefined,
): boolean {
  return (
    meta != null && "queueAvailable" in meta && meta.queueAvailable === false
  );
}

export function isDownloadQualityQueueAllScopeUnsupported(
  meta: DownloadQualityQueueResponse["meta"] | undefined,
): boolean {
  return (
    meta != null &&
    "allScopeUnsupported" in meta &&
    meta.allScopeUnsupported === true
  );
}
