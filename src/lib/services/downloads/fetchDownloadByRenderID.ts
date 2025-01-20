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

import { Download, DownloadResponse } from "@/types/download";

// Define the return type of the API response

export async function fetchDownloadByRenderId(
  renderId: string
): Promise<Download[]> {
  try {
    // Build query parameters using qs
    const query = qs.stringify(
      {
        filters: {
          render: {
            id: {
              $eq: renderId,
            },
          },
        },
        populate: ["asset_category", "asset"],
        fields: [
          "Name",
          "hasBeenProcessed",
          "hasError",
          "forceRerender",
          "CompletionTime",
          "DisplayCost",
          "assetLinkID",
          "grouping_category",
        ],
      },
      { encodeValuesOnly: true } // Serialize parameters for Strapi
    );

    // Send GET request with query string
    const response = await axiosInstance.get<DownloadResponse>(
      `/downloads?${query}`
    );
    return response.data.data; // Return the actual `Download` objects
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
