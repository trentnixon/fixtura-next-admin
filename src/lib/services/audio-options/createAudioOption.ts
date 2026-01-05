/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import {
  CreateAudioOptionRequest,
  AudioOptionResponse,
} from "@/types/audio-option";
import { handleApiError } from "../utils/error-handler";

const BASE_ENDPOINT = "audio-options";

/**
 * Create a new audio option
 */
export async function createAudioOption(
  data: CreateAudioOptionRequest
): Promise<AudioOptionResponse> {
  try {
    const response = await axiosInstance.post<AudioOptionResponse>(
      `${BASE_ENDPOINT}/create`,
      data
    );
    return response.data;
  } catch (error: any) {
    handleApiError(error, "createAudioOption");
  }
}
