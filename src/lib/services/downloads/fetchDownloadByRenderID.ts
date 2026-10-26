/*
export async function fetchDownloadsByRenderIdFromService(
  renderId: number
): Promise<ApiResponse<Download[]>> {
  const response = await fetcher.get<ApiResponse<Download[]>>(
    `/downloads?filters[render][id][$eq]=${renderId}&populate=*`
  );
  return response;
}
*/

/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import qs from "qs";

import { Download } from "@/types/download";

const RENDER_DOWNLOADS_PAGE_SIZE = 100;
const RENDER_DOWNLOADS_MAX_PAGES = 20;

const DOWNLOAD_FIELDS = [
  "Name",
  "hasBeenProcessed",
  "hasError",
  "forceRerender",
  "CompletionTime",
  "DisplayCost",
  "assetLinkID",
  "grouping_category",
  "UserErrorMessage",
  "errorHandler",
  "errorEmailSentToAdmin",
  "updatedAt",
  "downloads",
];

type DownloadPageResponse = {
  data: Download[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

function downloadPageQuery(renderId: string, page: number): string {
  return qs.stringify(
    {
      publicationState: "preview",
      filters: {
        render: {
          id: {
            $eq: renderId,
          },
        },
      },
      populate: {
        asset_category: true,
        asset: {
          populate: ["asset_type"],
        },
      },
      fields: DOWNLOAD_FIELDS,
      pagination: {
        page,
        pageSize: RENDER_DOWNLOADS_PAGE_SIZE,
      },
      sort: ["grouping_category:asc", "id:asc"],
    },
    { encodeValuesOnly: true },
  );
}

function uniqueDownloads(pages: DownloadPageResponse[]): Download[] {
  const seen = new Set<number>();
  const downloads: Download[] = [];
  for (const page of pages) {
    for (const download of page.data ?? []) {
      if (seen.has(download.id)) continue;
      seen.add(download.id);
      downloads.push(download);
    }
  }
  return downloads;
}

export async function fetchDownloadByRenderId(
  renderId: string
): Promise<Download[]> {
  try {
    const first = await axiosInstance.get<DownloadPageResponse>(
      `/downloads?${downloadPageQuery(renderId, 1)}`,
    );
    const reportedPages = first.data.meta?.pagination?.pageCount ?? 1;
    const pageCount = Math.min(
      Math.max(reportedPages, 1),
      RENDER_DOWNLOADS_MAX_PAGES,
    );
    const pages = [first.data];

    if (pageCount > 1) {
      const rest = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) =>
          axiosInstance.get<DownloadPageResponse>(
            `/downloads?${downloadPageQuery(renderId, index + 2)}`,
          ),
        ),
      );
      pages.push(...rest.map((response) => response.data));
    }

    return uniqueDownloads(pages);
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch downloads by render ID:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      // Throw a standardized error
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch downloads: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch downloads by render ID:",
        error
      );
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
