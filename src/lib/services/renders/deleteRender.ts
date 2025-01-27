/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

// Define the return type of the API response
interface DeleteRenderResponse {
  message: string; // Assuming Strapi returns a success message on deletion
}

export async function deleteRenderById(
  renderId: string
): Promise<DeleteRenderResponse> {
  try {
    // Send DELETE request to the Strapi endpoint
    const response = await axiosInstance.delete<DeleteRenderResponse>(
      `/renders/${renderId}`
    );
    return response.data; // Return the success message or response
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to delete render by ID:", {
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
          `Failed to delete render: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error("[Unexpected Error] Failed to delete render by ID:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
