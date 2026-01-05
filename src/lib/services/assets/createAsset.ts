/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { Asset, AssetInput } from "@/types/asset";

const ENDPOINT = "/assets";

export async function createAsset(data: AssetInput): Promise<Asset> {
  try {
    // Strapi expects the payload to be wrapped in a "data" object
    const payload = {
      data: data,
    };

    const response = await axiosInstance.post<{ data: Asset }>(
      ENDPOINT,
      payload
    );

    return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to create asset:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to create asset: ${error.response?.status || "Unknown error"}`
      );
    } else {
      console.error("[Unexpected Error] Failed to create asset:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
