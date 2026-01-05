/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import {
  ListAudioOptionsResponse,
  GetAudioOptionResponse,
  FetchAudioOptionsParams,
} from "@/types/audio-option";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";

const BASE_ENDPOINT = "audio-options";

/**
 * List audio options with pagination and filters
 */
export async function fetchAudioOptions(
  params: FetchAudioOptionsParams = {}
): Promise<ListAudioOptionsResponse> {
  try {
    const query = qs.stringify(
      {
        page: params.page,
        pageSize: params.pageSize,
        start: params.start,
        limit: params.limit,
        populate: params.populate,
        sort: params.sort,
        filters: params.filters,
      },
      {
        encodeValuesOnly: true,
        skipNulls: true,
      }
    );

    const url = `${BASE_ENDPOINT}/list${query ? `?${query}` : ""}`;
    const response = await axiosInstance.get<ListAudioOptionsResponse>(url);

    return response.data;
  } catch (error: any) {
    handleApiError(error, "fetchAudioOptions");
  }
}

/**
 * Get a single audio option by ID
 */
export async function fetchAudioOptionById(
  id: number,
  params: { populate?: string } = {}
): Promise<GetAudioOptionResponse> {
  try {
    const query = qs.stringify(params, {
      encodeValuesOnly: true,
      skipNulls: true,
    });
    const url = `${BASE_ENDPOINT}/${id}${query ? `?${query}` : ""}`;
    const response = await axiosInstance.get<GetAudioOptionResponse>(url);

    return response.data;
  } catch (error: any) {
    handleApiError(error, `fetchAudioOptionById(${id})`);
  }
}
