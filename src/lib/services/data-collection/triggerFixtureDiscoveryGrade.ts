"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerFixtureDiscoveryGradeRequest,
  TriggerFixtureDiscoveryGradeSuccessResponse,
} from "@/types/triggerFixtureDiscoveryGrade";

export async function triggerFixtureDiscoveryGrade(
  payload: TriggerFixtureDiscoveryGradeRequest
): Promise<TriggerFixtureDiscoveryGradeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerFixtureDiscoveryGradeSuccessResponse>(
        "/grade/trigger-fixture-discovery",
        payload
      );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        (error.response?.data as { error?: { message?: string } })?.error
          ?.message ??
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        `Request failed: ${error.response?.status ?? "Unknown"}`;

      throw new Error(errorMessage);
    }
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to trigger fixture discovery for grade"
    );
  }
}
