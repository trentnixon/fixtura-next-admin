/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

export interface ProcessClubDirectRequest {
  clubId: number;
}

export interface ProcessClubDirectResponse {
  success: boolean;
  message: string;
  clubId: number;
  queueName: "syncClubDirect";
}

/**
 * Triggers direct processing of a club by its organization ID.
 * This queues a background job to process club data without requiring an associated user account.
 *
 * @param data - Request data containing clubId
 * @returns Promise<ProcessClubDirectResponse> - Success response with job queued confirmation
 * @throws Error - If the API request fails, validation fails, or club is not found
 */
export async function processClubDirect(
  data: ProcessClubDirectRequest
): Promise<ProcessClubDirectResponse> {
  const { clubId } = data;

  console.log("[processClubDirect] Input:", { clubId });

  // Validation: clubId is required
  if (clubId === undefined || clubId === null) {
    throw new Error("clubId is required");
  }

  // Validation: clubId must be a valid number
  const clubIdNumber = Number(clubId);
  if (isNaN(clubIdNumber) || clubIdNumber <= 0) {
    throw new Error("clubId must be a valid positive number");
  }

  try {
    const endpoint = `/club/process-direct`;
    console.log("[processClubDirect] Calling CMS backend:", endpoint);

    const response = await axiosInstance.post<ProcessClubDirectResponse>(
      endpoint,
      {
        clubId: clubIdNumber,
      }
    );

    console.log("[processClubDirect] Success:", response.data);

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to queue club direct processing:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        clubId: clubIdNumber,
      });

      // Extract error message from response
      // Handle different error response formats
      const errorData = error.response?.data as any;
      const errorMessage =
        errorData?.error?.message ||
        errorData?.message ||
        error.message ||
        `Failed to queue club direct processing: ${
          error.response?.status || "Unknown error"
        }`;

      // Throw a standardized error
      throw new Error(errorMessage);
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to queue club direct processing:",
        error
      );
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    }
  }
}
