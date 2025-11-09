"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import {
  CompetitionAdminStatsResponse,
  FetchCompetitionAdminStatsParams,
} from "@/types/competitionAdminStats";

type FetchCompetitionAdminStatsApiResponse = {
  data: CompetitionAdminStatsResponse;
};

export async function fetchCompetitionAdminStats(
  params: FetchCompetitionAdminStatsParams = {}
): Promise<CompetitionAdminStatsResponse> {
  try {
    const searchParams = new URLSearchParams();

    if (params.associationId !== undefined) {
      searchParams.set("associationId", params.associationId.toString());
    }

    if (params.season) {
      searchParams.set("season", params.season);
    }

    const query = searchParams.toString();
    const endpoint = `/competition/admin/stats${query ? `?${query}` : ""}`;

    const response =
      await axiosInstance.get<FetchCompetitionAdminStatsApiResponse>(endpoint);

    if (!response.data || !response.data.data) {
      throw new Error(
        "Invalid response format: missing competition admin stats payload."
      );
    }

    console.debug("[fetchCompetitionAdminStats] Success", {
      endpoint,
      associationId: params.associationId ?? null,
      season: params.season ?? null,
    });

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const responseMessage =
        error.response?.data?.error?.message ??
        error.response?.data?.message ??
        error.message;

      console.error("[fetchCompetitionAdminStats] Axios error", {
        message: error.message,
        status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
      });

      if (status === 400) {
        throw new Error(
          responseMessage ||
            "Invalid request parameters supplied to competition admin stats endpoint."
        );
      }

      if (status === 401) {
        throw new Error(
          "Authentication failed while requesting competition admin stats."
        );
      }

      if (status === 403) {
        throw new Error(
          "You do not have permission to access competition admin stats."
        );
      }

      if (status === 404) {
        throw new Error(
          "Competition admin stats endpoint not found. Verify CMS configuration."
        );
      }

      if (status === 500) {
        throw new Error(
          "Server error occurred while fetching competition admin stats. Please try again later."
        );
      }

      throw new Error(
        responseMessage ||
          "Failed to fetch competition admin stats due to an unknown error."
      );
    }

    console.error("[fetchCompetitionAdminStats] Unexpected error", error);
    throw error instanceof Error
      ? error
      : new Error(
          "An unexpected error occurred while fetching competition admin stats."
        );
  }
}
