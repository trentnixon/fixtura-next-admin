/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { FormattedTeam } from "@/types/team";
import { AxiosError } from "axios";

// Define the return type of the API response

type TeamResponse = {
  data: FormattedTeam[];
};

// Create custom endpoint for this
export async function fetchGetTeamsOnSearchTerm(
  searchTerm: string
): Promise<FormattedTeam[]> {
  try {
    // Build query parameters using qs

    // Send GET request with query string
    const response = await axiosInstance.post<TeamResponse>(
      `/team/getTeamBySearchTerm`,
      {
        searchTerm,
      }
    );

    return response.data.data; // Return the actual `Render` object
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch team by ID:", {
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
          `Failed to fetch team: ${error.response?.status || "Unknown error"}`
      );
    } else {
      // Handle non-Axios errors
      console.error("[Unexpected Error] Failed to fetch team by ID:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
