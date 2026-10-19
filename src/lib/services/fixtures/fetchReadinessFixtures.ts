"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type { ReadinessFixture } from "@/lib/readiness/prepareReadinessFixtures";

export type ReadinessFixturesResponse = {
  data: {
    organisationId: number;
    organisationType: "club" | "association";
    anchor: string;
    window: {
      start: string;
      standardStart: string;
      end: string;
    };
    fixtures: ReadinessFixture[];
    meta: { total: number };
  };
};

function messageFrom(error: AxiosError): string {
  const data = error.response?.data;
  if (data && typeof data === "object") {
    const body = data as {
      error?: { message?: string };
      message?: string;
    };
    return body.error?.message || body.message || error.message;
  }
  return error.message;
}

export async function fetchReadinessFixtures(input: {
  organisationId: number;
  organisationType: "club" | "association";
  date: string;
}): Promise<ReadinessFixturesResponse> {
  const params = new URLSearchParams({
    organisationId: String(input.organisationId),
    organisationType: input.organisationType,
    date: input.date,
  });
  try {
    const response = await axiosInstance.get<ReadinessFixturesResponse>(
      `/game-meta-data/admin/readiness-fixtures?${params.toString()}`,
    );
    if (!Array.isArray(response.data?.data?.fixtures)) {
      throw new Error("Invalid response structure from readiness fixtures API");
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(messageFrom(error));
    }
    if (error instanceof Error) throw error;
    throw new Error("Failed to fetch readiness fixtures");
  }
}
