"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type { ClubScrapeSportSlug } from "@/constants/clubScrapeSportSlugs";
import { FetchClubContactInfoResponse } from "@/types/clubContactInfo";

function contactDetailsParams(sportSlug?: ClubScrapeSportSlug) {
  if (!sportSlug) return undefined;
  return { "filters[sport][$eq]": sportSlug };
}

export async function fetchClubContactInfo(
  sportSlug?: ClubScrapeSportSlug,
): Promise<FetchClubContactInfoResponse> {
  try {
    const response = await axiosInstance.get<FetchClubContactInfoResponse>(
      `/club/getContactDetails`,
      { params: contactDetailsParams(sportSlug) },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        (error.response?.data as { message?: string })?.message ||
          `Failed to fetch club contact info: ${error.response?.status ?? "Unknown error"}`,
      );
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
}
