/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { FetchAssociationContactInfoResponse } from "@/types/associationContactInfo";

export async function fetchAssociationContactInfo(): Promise<FetchAssociationContactInfoResponse> {
  try {
    // Send GET request with query string
    const response =
      await axiosInstance.get<FetchAssociationContactInfoResponse>(
        `/association/getContactDetails`
      );

    return response.data; // Ensure this matches the API response format
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch association contact info:", {
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
          `Failed to fetch association contact info: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch association contact info:",
        error
      );
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
