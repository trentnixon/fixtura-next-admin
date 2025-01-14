/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { Account } from "@/types/account";
import qs from "qs";
// Define the return type of the API response
interface FetchAccountsResponse {
  data: Account[];
}

export async function fetchAccounts(): Promise<FetchAccountsResponse> {
  try {
    // Build query parameters using qs
    const query = qs.stringify(
      {
        populate: ["account_type"], // Include account_type relation
        filters: {
          isActive: { $eq: true }, // Example: Filter only active accounts
        },
      },
      { encodeValuesOnly: true } // Serialize parameters for Strapi
    );

    // Send GET request with query string
    const response = await axiosInstance.get<FetchAccountsResponse>(
      `/accounts?${query}`
    );

    return response.data; // Ensure this matches the API response format
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch accounts:", {
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
          `Failed to fetch accounts: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error("[Unexpected Error] Failed to fetch accounts:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
