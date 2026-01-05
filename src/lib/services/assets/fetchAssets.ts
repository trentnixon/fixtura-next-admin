/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { AssetsResponse, FetchAssetsParams } from "@/types/asset";
import qs from "qs";

const ENDPOINT = "/assets";

export async function fetchAssets(
  params: FetchAssetsParams = {}
): Promise<AssetsResponse> {
  try {
    const query = qs.stringify(
      {
        pagination: {
          page: params.page || 1,
          pageSize: params.pageSize || 25,
        },
        filters: params.filters,
        populate: {
          asset_category: true,
          asset_type: true,
          subscription_package: true,
          play_hq_end_point: true,
          account_types: true,
        },
      },
      {
        encodeValuesOnly: true,
      }
    );

    const url = `${ENDPOINT}?${query}`;

    const response = await axiosInstance.get<AssetsResponse>(url);

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch assets:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch assets: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      console.error("[Unexpected Error] Failed to fetch assets:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
