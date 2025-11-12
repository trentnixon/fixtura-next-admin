"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { SubscriptionTier } from "@/types/subscriptionTier";

// Define the return type of the API response (Strapi format)
interface FetchSubscriptionTiersResponse {
  data: SubscriptionTier[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Fetches all subscription tiers from the Strapi API
 * Endpoint: GET /api/subscription-tiers
 *
 * @returns Promise<FetchSubscriptionTiersResponse> - List of subscription tiers
 * @throws Error - If the API request fails
 */
export async function fetchSubscriptionTiers(): Promise<FetchSubscriptionTiersResponse> {
  try {
    console.log("[fetchSubscriptionTiers] Fetching subscription tiers");

    const response = await axiosInstance.get<FetchSubscriptionTiersResponse>(
      "/subscription-tiers"
    );

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response structure from subscription tiers API");
    }

    console.log(
      "[fetchSubscriptionTiers] Success",
      `Found ${response.data.data.length} subscription tiers`
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch subscription tiers:", {
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
          error.response?.data?.error?.message ||
          `Failed to fetch subscription tiers: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch subscription tiers:",
        error
      );
      throw error instanceof Error
        ? error
        : new Error(
            "An unexpected error occurred while fetching subscription tiers. Please try again."
          );
    }
  }
}
