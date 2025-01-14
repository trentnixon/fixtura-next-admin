/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { AxiosError } from "axios";
import { Account } from "@/types/account";

// Define the return type for the API response
interface FetchAccountResponse {
  data: Account;
}

export async function fetchAccountById(
  accountId: string
): Promise<FetchAccountResponse> {
  try {
    // Build query parameters to populate relations
    const query = qs.stringify(
      {
        populate: [
          "account_type", // Example: populate the `account_type` relation
          "orders", // Add other relations as needed
          "clubs",
          "associations",
          "scheduler",
          "account_type",
          "user",
          "trial_instance",
          "subscription_tier",
          "customers",
          "orders",
          "result_collections",
          "data_collections",
          "sports",
          "sponsors",
          "template",
          "theme",
          "account_media_libraries",
        ],
      },
      { encodeValuesOnly: true }
    );

    const response = await axiosInstance.get<FetchAccountResponse>(
      `/accounts/${accountId}?${query}`
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
