"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { ContactFormAdminResponse } from "@/types/contact-form";

/**
 * Fetches all contact form submissions for admin display from the CMS
 * Provides all contact form submissions with metadata including total count
 *
 * @returns Promise<ContactFormAdminResponse> - Contact form submissions data with metadata
 * @throws Error - If the API request fails
 */
export async function fetchContactFormSubmissions(): Promise<ContactFormAdminResponse> {
  try {
    console.log(
      "[fetchContactFormSubmissions] Fetching all contact form submissions"
    );

    const response = await axiosInstance.get<ContactFormAdminResponse>(
      "/contact-form/admin/all"
    );

    // Log the full response for debugging
    console.log(
      "[fetchContactFormSubmissions] Full response:",
      JSON.stringify(response.data, null, 2)
    );

    // Check if response has expected structure
    if (!response.data || !Array.isArray(response.data.data)) {
      throw new Error("Invalid response structure from contact form API");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch contact form submissions:", {
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
          `Failed to fetch contact form submissions: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch contact form submissions:",
        error
      );
      throw new Error(
        "An unexpected error occurred while fetching contact form submissions. Please try again."
      );
    }
  }
}
