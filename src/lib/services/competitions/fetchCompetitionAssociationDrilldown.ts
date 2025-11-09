"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { CompetitionAssociationDrilldownResponse } from "@/types/competitionAssociationDrilldown";

type FetchCompetitionAssociationDrilldownApiResponse = {
  data: CompetitionAssociationDrilldownResponse;
};

export async function fetchCompetitionAssociationDrilldown(
  associationId: number
): Promise<CompetitionAssociationDrilldownResponse> {
  if (!Number.isFinite(associationId)) {
    throw new Error("A valid numeric association ID is required.");
  }

  try {
    const endpoint = `/competition/admin/${associationId}/associations`;
    const response =
      await axiosInstance.get<FetchCompetitionAssociationDrilldownApiResponse>(
        endpoint
      );

    if (!response.data || !response.data.data) {
      throw new Error(
        "Invalid response format: missing competition association drilldown payload."
      );
    }

    console.debug("[fetchCompetitionAssociationDrilldown] Success", {
      endpoint,
      associationId,
    });

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const responseMessage =
        error.response?.data?.error?.message ??
        error.response?.data?.message ??
        error.message;

      console.error("[fetchCompetitionAssociationDrilldown] Axios error", {
        message: error.message,
        status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
      });

      if (status === 400) {
        throw new Error(
          responseMessage ||
            "Invalid association ID supplied to competition association drilldown endpoint."
        );
      }

      if (status === 401) {
        throw new Error(
          "Authentication failed while requesting competition association drilldown."
        );
      }

      if (status === 403) {
        throw new Error(
          "You do not have permission to access competition association drilldown."
        );
      }

      if (status === 404) {
        throw new Error("Association not found.");
      }

      if (status === 500) {
        throw new Error(
          "Server error occurred while fetching competition association drilldown. Please try again later."
        );
      }

      throw new Error(
        responseMessage ||
          "Failed to fetch competition association drilldown due to an unknown error."
      );
    }

    console.error(
      "[fetchCompetitionAssociationDrilldown] Unexpected error",
      error
    );
    throw error instanceof Error
      ? error
      : new Error(
          "An unexpected error occurred while fetching competition association drilldown."
        );
  }
}
