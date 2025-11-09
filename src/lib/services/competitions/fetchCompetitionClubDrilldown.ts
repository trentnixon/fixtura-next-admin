"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { CompetitionClubDrilldownResponse } from "@/types/competitionClubDrilldown";

type FetchCompetitionClubDrilldownApiResponse = {
  data: CompetitionClubDrilldownResponse;
};

export async function fetchCompetitionClubDrilldown(
  clubId: number
): Promise<CompetitionClubDrilldownResponse> {
  if (!Number.isFinite(clubId)) {
    throw new Error("A valid numeric club ID is required.");
  }

  try {
    const endpoint = `/competition/admin/${clubId}/clubs`;
    const response =
      await axiosInstance.get<FetchCompetitionClubDrilldownApiResponse>(
        endpoint
      );

    if (!response.data || !response.data.data) {
      throw new Error(
        "Invalid response format: missing competition club drilldown payload."
      );
    }

    console.debug("[fetchCompetitionClubDrilldown] Success", {
      endpoint,
      clubId,
    });

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const responseMessage =
        error.response?.data?.error?.message ??
        error.response?.data?.message ??
        error.message;

      console.error("[fetchCompetitionClubDrilldown] Axios error", {
        message: error.message,
        status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
      });

      if (status === 400) {
        throw new Error(
          responseMessage ||
            "Invalid club ID supplied to competition club drilldown endpoint."
        );
      }

      if (status === 401) {
        throw new Error(
          "Authentication failed while requesting competition club drilldown."
        );
      }

      if (status === 403) {
        throw new Error(
          "You do not have permission to access competition club drilldown."
        );
      }

      if (status === 404) {
        throw new Error("Club not found.");
      }

      if (status === 500) {
        throw new Error(
          "Server error occurred while fetching competition club drilldown. Please try again later."
        );
      }

      throw new Error(
        responseMessage ||
          "Failed to fetch competition club drilldown due to an unknown error."
      );
    }

    console.error("[fetchCompetitionClubDrilldown] Unexpected error", error);
    throw error instanceof Error
      ? error
      : new Error(
          "An unexpected error occurred while fetching competition club drilldown."
        );
  }
}
