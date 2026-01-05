/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { DeleteAudioOptionResponse } from "@/types/audio-option";
import { handleApiError } from "../utils/error-handler";

const BASE_ENDPOINT = "audio-options";

/**
 * Delete an audio option by ID
 */
export async function deleteAudioOption(
  id: number
): Promise<DeleteAudioOptionResponse> {
  try {
    const response = await axiosInstance.delete<DeleteAudioOptionResponse>(
      `${BASE_ENDPOINT}/${id}`
    );
    return response.data;
  } catch (error: any) {
    handleApiError(error, `deleteAudioOption(${id})`);
  }
}
