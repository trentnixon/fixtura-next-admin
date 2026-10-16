/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import qs from "qs";

import type {
  DownloadStatusTimelineParams,
  DownloadStatusTimelineResponse,
  StrapiPaginationMeta,
} from "@/types/downloadStatusTimeline";
import type { Download, DownloadResponse } from "@/types/download";

const DEFAULT_PAGE_SIZE = 100;

function normalizePagination(
  raw: unknown,
  page: number,
  pageSize: number,
  rowCount: number,
): StrapiPaginationMeta {
  if (raw && typeof raw === "object" && "pagination" in raw) {
    const pagination = (raw as { pagination?: Record<string, unknown> })
      .pagination;
    if (pagination && typeof pagination === "object") {
      return {
        page: Number(pagination.page) || page,
        pageSize: Number(pagination.pageSize) || pageSize,
        pageCount: Number(pagination.pageCount) || 1,
        total: Number(pagination.total) ?? rowCount,
      };
    }
  }
  return {
    page,
    pageSize,
    pageCount: 1,
    total: rowCount,
  };
}

/**
 * Fleet download status timeline — windowed find on download `updatedAt`.
 * Uses core Strapi REST (not the quality queue).
 */
export async function fetchDownloadStatusTimeline(
  params: DownloadStatusTimelineParams,
): Promise<DownloadStatusTimelineResponse> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  try {
    const query = qs.stringify(
      {
        publicationState: "preview",
        filters: {
          updatedAt: {
            $gte: params.from,
            $lte: params.to,
          },
        },
        pagination: {
          page,
          pageSize,
        },
        sort: ["updatedAt:desc"],
        fields: [
          "Name",
          "hasBeenProcessed",
          "hasError",
          "errorHandler",
          "updatedAt",
          "grouping_category",
        ],
        populate: {
          render: {
            fields: ["Name"],
          },
          account: {
            fields: ["FirstName", "LastName", "Sport"],
          },
          asset_category: {
            fields: ["Identifier", "Name"],
          },
        },
      },
      { encodeValuesOnly: true },
    );

    const response = await axiosInstance.get<
      DownloadResponse & { meta?: unknown }
    >(`/downloads?${query}`);

    const data = (response.data.data ?? []) as Download[];
    const pagination = normalizePagination(
      response.data.meta,
      page,
      pageSize,
      data.length,
    );

    return {
      data,
      meta: {
        from: params.from,
        to: params.to,
        pagination,
      },
    };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch download status timeline:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch downloads: ${
            error.response?.status || "Unknown error"
          }`,
      );
    }

    console.error(
      "[Unexpected Error] Failed to fetch download status timeline:",
      error,
    );
    throw new Error("An unexpected error occurred. Please try again.");
  }
}
