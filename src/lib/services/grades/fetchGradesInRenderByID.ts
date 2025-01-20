"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { GradesInRender } from "@/types/gradesInRender";

export async function fetchGradesInRenderById(
  gradesInRender: string[]
): Promise<GradesInRender[]> {
  if (!gradesInRender.length) {
    throw new Error("gradesInRender array is empty. Provide valid IDs.");
  }

  try {
    const query = qs.stringify(
      {
        filters: {
          id: {
            $in: gradesInRender,
          },
        },
        populate: ["grade"],
      },
      { encodeValuesOnly: true }
    );

    const response = await axiosInstance.get<{ data: GradesInRender[] }>(
      `/grades-in-renders?${query}`
    );

    console.log("[fetchGradesInRenderById] Response:", response.data.data);

    return response.data.data;
  } catch (error) {
    console.error("[Error] fetchGradesInRenderById failed:", error);
    throw new Error("Failed to fetch grades in render by ID.");
  }
}
