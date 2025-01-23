/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";

// Define the return type for the API response
interface FetchAccountResponse {
  data: fixturaContentHubAccountDetails;
}

export async function fetchAccountById(
  accountId: string
): Promise<FetchAccountResponse> {
  try {
    // Build query parameters to populate relations

    const response = await axiosInstance.get<FetchAccountResponse>(
      `/account/fixturaContentHubAccountDetails/${accountId}`
    );

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch account:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch account: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      console.error("[Unexpected Error] Failed to fetch account:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
