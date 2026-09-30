"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

export async function forceDownloadAssetRerender(
  downloadId: number,
): Promise<void> {
  try {
    await axiosInstance.post("/download/ForceAssetRerender", {
      data: { RerenderID: String(downloadId) },
    });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        (error.response?.data as { message?: string })?.message ||
          `Force rerender failed: ${error.response?.status ?? "unknown"}`,
      );
    }
    throw error;
  }
}
