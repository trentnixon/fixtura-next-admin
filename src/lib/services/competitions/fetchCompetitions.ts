/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { ValidCompetitionsResponse } from "@/types/validCompetitions";

type FetchAccountCompetitionsResponse = {
  data: ValidCompetitionsResponse;
};

export async function fetchAccountCompetitions(
  organizationId: number,
  account_type: number
): Promise<ValidCompetitionsResponse> {
  try {
    if (!organizationId) {
      throw new Error("Account ID is required to fetch competitions.");
    }

    // Send GET request with query string
    const response = await axiosInstance.get<FetchAccountCompetitionsResponse>(
      `/competition/find-account-competitions/${organizationId}?account_type=${account_type}`
    );

    // Return the actual competition data
    return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch account competitions:", {
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
          `Failed to fetch account competitions: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch account competitions:",
        error
      );
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
