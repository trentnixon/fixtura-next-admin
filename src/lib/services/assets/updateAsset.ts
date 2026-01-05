/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { Asset, AssetInput } from "@/types/asset";

const ENDPOINT = "/assets";

export async function updateAsset(
  id: number,
  data: Partial<AssetInput>
): Promise<Asset> {
  try {
    const payload = {
      data: data,
    };

    const response = await axiosInstance.put<{ data: Asset }>(
      `${ENDPOINT}/${id}`,
      payload
    );

    return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to update asset:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to update asset: ${error.response?.status || "Unknown error"}`
      );
    } else {
      console.error("[Unexpected Error] Failed to update asset:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
