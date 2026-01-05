/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import {
  UpdateAudioOptionRequest,
  AudioOptionResponse,
} from "@/types/audio-option";
import { handleApiError } from "../utils/error-handler";

const BASE_ENDPOINT = "audio-options";

/**
 * Update an existing audio option
 */
export async function updateAudioOption(
  id: number,
  data: UpdateAudioOptionRequest
): Promise<AudioOptionResponse> {
  try {
    const response = await axiosInstance.put<AudioOptionResponse>(
      `${BASE_ENDPOINT}/${id}`,
      data
    );
    return response.data;
  } catch (error: any) {
    handleApiError(error, `updateAudioOption(${id})`);
  }
}
