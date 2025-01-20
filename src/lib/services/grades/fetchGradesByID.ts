// /lib/services/grades/fetchGradesByID.ts
/* export async function fetchGradeFromService(
    id: number
  ): Promise<ApiResponse<Grade>> {
    const response = await fetcher.get<ApiResponse<Grade>>(
      `/grades/${id}?populate=*`
    );
    return response;
  } */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import qs from "qs";
import { Grade } from "@/types";

// Define the return type of the API response
interface FetchGradeResponse {
  data: Grade;
}

export async function fetchGradeById(gradeId: string): Promise<Grade> {
  try {
    // Build query parameters using qs
    const query = qs.stringify(
      {
        populate: [
          "game_results_in_renders", // Example relation: template
          "upcoming_games_in_renders",
          "grades_in_renders",
          "scheduler",
        ],
      },
      { encodeValuesOnly: true } // Serialize parameters for Strapi
    );

    // Send GET request with query string
    const response = await axiosInstance.get<FetchGradeResponse>(
      `/grades/${gradeId}?${query}`
    );

    return response.data.data; // Return the actual `Render` object
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch render by ID:", {
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
          `Failed to fetch render: ${error.response?.status || "Unknown error"}`
      );
    } else {
      // Handle non-Axios errors
      console.error("[Unexpected Error] Failed to fetch render by ID:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
