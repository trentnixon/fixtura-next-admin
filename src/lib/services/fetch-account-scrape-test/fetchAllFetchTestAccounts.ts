/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { TestResponse } from "@/types/fetch-account-scrape-test";

export async function fetchAllFetchTestAccounts(): Promise<TestResponse> {
  try {
    const response = await axiosInstance.get<TestResponse>(
      `/fetch-test-account/get-all-fetch-test-accounts`
    );

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch all fetch test accounts:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch all fetch test accounts: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      console.error(
        "[Unexpected Error] Failed to fetch all fetch test accounts:",
        error
      );
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
