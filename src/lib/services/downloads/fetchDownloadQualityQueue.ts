"use server";

import axiosInstance from "@/lib/axios";
import {
  extractAccountAssetRunErrorMessage,
  getAccountAssetRunHttpStatus,
} from "@/lib/services/account-asset-run/extractAccountAssetRunError";
import type {
  DownloadQualityQueueParams,
  DownloadQualityQueueResponse,
} from "@/types/downloadQualityControl";

function baseEmptyMeta(params: DownloadQualityQueueParams) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 25;
  return {
    from: params.from,
    to: params.to,
    page,
    pageSize,
    total: 0,
    pageCount: 0,
    returned: 0,
  };
}

function emptyDownloadQualityQueueResponse(
  params: DownloadQualityQueueParams,
): DownloadQualityQueueResponse {
  return {
    data: [],
    meta: {
      ...baseEmptyMeta(params),
      queueAvailable: false,
    },
  };
}

function allScopeUnsupportedResponse(
  params: DownloadQualityQueueParams,
): DownloadQualityQueueResponse {
  return {
    data: [],
    meta: {
      ...baseEmptyMeta(params),
      allScopeUnsupported: true,
    },
  };
}

function isNeedsAttentionAllScopeRejection(message: string): boolean {
  return message.toLowerCase().includes("needsattention");
}

/**
 * Fleet download QC queue.
 * @see .comms/Strapi/handoff/cms-handoff-download-quality-queue.md
 */
export async function fetchDownloadQualityQueue(
  params: DownloadQualityQueueParams,
): Promise<DownloadQualityQueueResponse> {
  const needsAttention = params.needsAttention ?? true;

  try {
    const response = await axiosInstance.get<DownloadQualityQueueResponse>(
      "/downloads/admin/quality-queue",
      {
        params: {
          from: params.from,
          to: params.to,
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 25,
          needsAttention,
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    const status = getAccountAssetRunHttpStatus(error);
    const message = extractAccountAssetRunErrorMessage(error);

    if (status === 404 || status === 501) {
      console.warn(
        "[fetchDownloadQualityQueue] GET /downloads/admin/quality-queue returned",
        status,
        "— returning empty list (CMS route may be missing).",
      );
      return emptyDownloadQualityQueueResponse(params);
    }

    if (
      status === 400 &&
      needsAttention === false &&
      isNeedsAttentionAllScopeRejection(message)
    ) {
      console.warn(
        "[fetchDownloadQualityQueue] CMS does not accept needsAttention=false yet.",
      );
      return allScopeUnsupportedResponse(params);
    }

    throw new Error(message);
  }
}
