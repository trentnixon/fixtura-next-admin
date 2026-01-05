/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

const ENDPOINT = "/assets";

export async function deleteAsset(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to delete asset:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to delete asset: ${error.response?.status || "Unknown error"}`
      );
    } else {
      console.error("[Unexpected Error] Failed to delete asset:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
