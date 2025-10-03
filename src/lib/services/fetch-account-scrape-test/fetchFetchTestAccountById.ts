/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { IndividualTestResponse } from "@/types/fetch-account-scrape-test";

export async function fetchFetchTestAccountById(
  testId: string
): Promise<IndividualTestResponse> {
  try {
    const response = await axiosInstance.get<IndividualTestResponse>(
      `/fetch-test-account/get-fetch-test-account-by-id/${testId}`
    );

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch fetch test account by ID:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch fetch test account by ID: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      console.error(
        "[Unexpected Error] Failed to fetch fetch test account by ID:",
        error
      );
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
