"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { MarkAsReadRequest, MarkAsReadResponse } from "@/types/contact-form";

/**
 * Marks a contact form submission as read and/or acknowledged
 * Updates the hasSeen and/or Acknowledged boolean fields
 *
 * @param id - Contact form submission ID
 * @param updates - Object containing hasSeen and/or Acknowledged boolean values
 * @returns Promise<MarkAsReadResponse> - Updated contact form submission data
 * @throws Error - If the API request fails
 */
export async function markContactFormAsRead(
  id: number,
  updates: MarkAsReadRequest
): Promise<MarkAsReadResponse> {
  try {
    console.log(
      `[markContactFormAsRead] Marking contact form ${id} as read`,
      updates
    );

    const response = await axiosInstance.put<MarkAsReadResponse>(
      `/contact-form/${id}/mark-read`,
      updates
    );

    // Log the full response for debugging
    console.log(
      `[markContactFormAsRead] Full response:`,
      JSON.stringify(response.data, null, 2)
    );

    // Check if response has expected structure
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response structure from mark as read API");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to mark contact form as read:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      // Handle specific error status codes
      if (error.response?.status === 404) {
        throw new Error("Contact form not found");
      }
      if (error.response?.status === 400) {
        const errorData = error.response.data as { message?: string };
        throw new Error(
          errorData?.message ||
            "Invalid request. At least one field must be provided."
        );
      }

      // Throw a standardized error
      throw new Error(
        error.response?.data?.message ||
          `Failed to mark contact form as read: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to mark contact form as read:",
        error
      );
      throw new Error(
        "An unexpected error occurred while marking contact form as read. Please try again."
      );
    }
  }
}
