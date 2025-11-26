/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

export interface ProcessAssociationDirectRequest {
  associationId: number;
}

export interface ProcessAssociationDirectResponse {
  success: boolean;
  message: string;
  associationId: number;
  queueName: "syncAssociationDirect";
}

/**
 * Triggers direct processing of an association by its organization ID.
 * This queues a background job to process association data without requiring an associated user account.
 *
 * @param data - Request data containing associationId
 * @returns Promise<ProcessAssociationDirectResponse> - Success response with job queued confirmation
 * @throws Error - If the API request fails, validation fails, or association is not found
 */
export async function processAssociationDirect(
  data: ProcessAssociationDirectRequest
): Promise<ProcessAssociationDirectResponse> {
  const { associationId } = data;

  console.log("[processAssociationDirect] Input:", { associationId });

  // Validation: associationId is required
  if (associationId === undefined || associationId === null) {
    throw new Error("associationId is required");
  }

  // Validation: associationId must be a valid number
  const associationIdNumber = Number(associationId);
  if (isNaN(associationIdNumber) || associationIdNumber <= 0) {
    throw new Error("associationId must be a valid positive number");
  }

  try {
    const endpoint = `/association/process-direct`;
    console.log("[processAssociationDirect] Calling CMS backend:", endpoint);

    const response = await axiosInstance.post<ProcessAssociationDirectResponse>(
      endpoint,
      {
        associationId: associationIdNumber,
      }
    );

    console.log("[processAssociationDirect] Success:", response.data);

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error(
        "[Axios Error] Failed to queue association direct processing:",
        {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          associationId: associationIdNumber,
        }
      );

      // Extract error message from response
      // Handle different error response formats
      const errorData = error.response?.data as any;
      const errorMessage =
        errorData?.error?.message ||
        errorData?.message ||
        error.message ||
        `Failed to queue association direct processing: ${
          error.response?.status || "Unknown error"
        }`;

      // Throw a standardized error
      throw new Error(errorMessage);
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to queue association direct processing:",
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
