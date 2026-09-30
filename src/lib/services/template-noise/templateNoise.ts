"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";
import {
  PROTECTED_TEMPLATE_NOISE_ID,
  TemplateNoise,
  TemplateNoiseInput,
  TemplateNoiseListResponse,
} from "@/types/template-noise";
import { readNoiseRecord, toTemplateNoise } from "./templateNoiseRecord";

const ENDPOINT = "/template-noises";

interface RawNoise {
  id: number;
  attributes?: {
    name?: string;
    noiseType?: string;
    publishedAt?: string | null;
  };
}

function assertCanUnpublish(id: number) {
  if (id === PROTECTED_TEMPLATE_NOISE_ID) {
    throw new Error(
      "Noise id 1 must stay published. New accounts are created with that row.",
    );
  }
}

function assertCanDelete(id: number) {
  if (id === PROTECTED_TEMPLATE_NOISE_ID) {
    throw new Error(
      "Noise id 1 cannot be deleted. New accounts are created with that row.",
    );
  }
}

export async function fetchTemplateNoises(): Promise<TemplateNoiseListResponse> {
  const query = qs.stringify(
    {
      publicationState: "preview",
      sort: ["name:asc"],
      pagination: { page: 1, pageSize: 100 },
    },
    { encodeValuesOnly: true },
  );

  try {
    const response = await axiosInstance.get(`${ENDPOINT}?${query}`);
    const body = response.data as { data?: RawNoise[] } | RawNoise[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    return { data: rows.map((row) => toTemplateNoise(row)) };
  } catch (error) {
    handleApiError(error, "fetchTemplateNoises");
  }
}

export async function createTemplateNoise(
  input: TemplateNoiseInput,
): Promise<TemplateNoise> {
  try {
    const response = await axiosInstance.post(ENDPOINT, {
      data: {
        name: input.name,
        noiseType: input.noiseType,
      },
    });
    return readNoiseRecord(response.data);
  } catch (error) {
    handleApiError(error, "createTemplateNoise");
  }
}

export async function updateTemplateNoise(
  id: number,
  input: TemplateNoiseInput,
): Promise<TemplateNoise> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: {
        name: input.name,
        noiseType: input.noiseType,
      },
    });
    return readNoiseRecord(response.data);
  } catch (error) {
    handleApiError(error, "updateTemplateNoise");
  }
}

export async function setTemplateNoisePublished(
  id: number,
  published: boolean,
): Promise<TemplateNoise> {
  if (!published) assertCanUnpublish(id);

  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: {
        publishedAt: published ? new Date().toISOString() : null,
      },
    });
    return readNoiseRecord(response.data);
  } catch (error) {
    handleApiError(error, "setTemplateNoisePublished");
  }
}

export async function deleteTemplateNoise(id: number): Promise<void> {
  assertCanDelete(id);

  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error, "deleteTemplateNoise");
  }
}
