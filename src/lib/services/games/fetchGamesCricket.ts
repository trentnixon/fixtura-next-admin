"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";

import { GameMetaDataAttributes } from "@/types";

export async function fetchGamesCricket(
  gameMetaDataAttributes: string[]
): Promise<GameMetaDataAttributes[]> {
  if (!gameMetaDataAttributes.length) {
    throw new Error(
      "gameMetaDataAttributes array is empty. Provide valid IDs."
    );
  }

  try {
    const query = qs.stringify(
      {
        filters: {
          id: {
            $in: gameMetaDataAttributes,
          },
        },
      },
      { encodeValuesOnly: true }
    );

    const response = await axiosInstance.get<{
      data: GameMetaDataAttributes[];
    }>(`/game-meta-datas?${query}`);

    console.log("[fetchGamesCricket] Response:", response.data);

    return response.data.data;
  } catch (error) {
    console.error("[Error] fetchGamesCricket failed:", error);
    throw new Error("Failed to fetch games cricket.");
  }
}
