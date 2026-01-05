/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { AssetCategory, AssetType } from "@/types/asset";

// Fetch Asset Categories
export async function fetchAssetCategories(): Promise<AssetCategory[]> {
  try {
    const response = await axiosInstance.get<{ data: AssetCategory[] }>(
      "/asset-categories"
    );
    return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch asset categories:", {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch asset categories: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      console.error(
        "[Unexpected Error] Failed to fetch asset categories:",
        error
      );
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}

// Fetch Asset Types
export async function fetchAssetTypes(): Promise<AssetType[]> {
  try {
    const response = await axiosInstance.get<{ data: AssetType[] }>(
      "/asset-types"
    );
    return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch asset types:", {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch asset types: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      console.error("[Unexpected Error] Failed to fetch asset types:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
