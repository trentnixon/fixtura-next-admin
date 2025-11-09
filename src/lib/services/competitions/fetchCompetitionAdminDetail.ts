"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { CompetitionAdminDetailResponse } from "@/types/competitionAdminDetail";

type FetchCompetitionAdminDetailApiResponse = {
  data: CompetitionAdminDetailResponse;
};

export async function fetchCompetitionAdminDetail(
  competitionId: number
): Promise<CompetitionAdminDetailResponse> {
  if (!Number.isFinite(competitionId)) {
    throw new Error("A valid numeric competition ID is required.");
  }

  try {
    const endpoint = `/competition/admin/${competitionId}`;
    const response =
      await axiosInstance.get<FetchCompetitionAdminDetailApiResponse>(endpoint);

    if (!response.data || !response.data.data) {
      throw new Error(
        "Invalid response format: missing competition admin detail payload."
      );
    }

    console.debug("[fetchCompetitionAdminDetail] Success", {
      endpoint,
      competitionId,
    });

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const responseMessage =
        error.response?.data?.error?.message ??
        error.response?.data?.message ??
        error.message;

      console.error("[fetchCompetitionAdminDetail] Axios error", {
        message: error.message,
        status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
      });

      if (status === 400) {
        throw new Error(
          responseMessage ||
            "Invalid competition ID supplied to admin detail endpoint."
        );
      }

      if (status === 401) {
        throw new Error(
          "Authentication failed while requesting competition admin detail."
        );
      }

      if (status === 403) {
        throw new Error(
          "You do not have permission to access competition admin detail."
        );
      }

      if (status === 404) {
        throw new Error("Competition not found or inactive.");
      }

      if (status === 500) {
        throw new Error(
          "Server error occurred while fetching competition admin detail. Please try again later."
        );
      }

      throw new Error(
        responseMessage ||
          "Failed to fetch competition admin detail due to an unknown error."
      );
    }

    console.error("[fetchCompetitionAdminDetail] Unexpected error", error);
    throw error instanceof Error
      ? error
      : new Error(
          "An unexpected error occurred while fetching competition admin detail."
        );
  }
}
