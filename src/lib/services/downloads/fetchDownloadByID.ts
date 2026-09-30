/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import qs from "qs";

import { Download } from "@/types/download";

// Define the return type of the API response

export async function fetchDownloadByID(downloadId: string): Promise<Download> {
  try {
    // Build query parameters using qs
    const query = qs.stringify(
      {
        publicationState: "preview",
        populate: ["asset_category", "asset", "render"],
        fields: [
          "Name",
          "URL",
          "grouping_category",
          "isAccurate",
          "hasBeenProcessed",
          "forceRerender",
          "DisplayCost",
          "CompletionTime",
          "OutputFileSize",
          "UserErrorMessage",
          "errorHandler",
          "hasError",
          "downloads",
          "numDownloads",
          "assetLinkID",
          "gameID",
          "errorEmailSentToAdmin",
          "updatedAt",
          "publishedAt",
        ],
      },
      { encodeValuesOnly: true },
    );

    // Send GET request with query string
    const response = await axiosInstance.get<{ data: Download }>(
      `/downloads/${downloadId}?${query}`
    );

    // Ensure we return a single Download object
    return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch download by ID:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch download: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      console.error(
        "[Unexpected Error] Failed to fetch download by ID:",
        error
      );
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
