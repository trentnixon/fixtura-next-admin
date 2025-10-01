/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { TestReport } from "@/types/fetch-test";

export async function fetchAllFetchTests(): Promise<TestReport> {
  try {
    const response = await axiosInstance.get<TestReport>(
      `/fetch-test/get-all-fetch-tests`
    );

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch all fetch tests:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch all fetch tests: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      console.error(
        "[Unexpected Error] Failed to fetch all fetch tests:",
        error
      );
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
