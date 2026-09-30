"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";
import {
  TemplateLuminance,
  TemplateLuminanceInput,
  TemplateLuminanceListResponse,
} from "@/types/template-luminance";
import { readLuminanceRecord, toTemplateLuminance } from "./templateLuminanceRecord";

const ENDPOINT = "/template-luminances";

type LuminanceRow = Parameters<typeof toTemplateLuminance>[0];

function writeBody(input: TemplateLuminanceInput) {
  return {
    name: input.name,
    image: input.imageId,
  };
}

export async function fetchTemplateLuminances(): Promise<TemplateLuminanceListResponse> {
  const query = qs.stringify(
    {
      publicationState: "preview",
      populate: "image",
      sort: ["name:asc"],
      pagination: { page: 1, pageSize: 100 },
    },
    { encodeValuesOnly: true },
  );

  try {
    const response = await axiosInstance.get(`${ENDPOINT}?${query}`);
    const body = response.data as { data?: LuminanceRow[] } | LuminanceRow[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    return { data: rows.map((row) => toTemplateLuminance(row)) };
  } catch (error) {
    handleApiError(error, "fetchTemplateLuminances");
  }
}

export async function createTemplateLuminance(
  input: TemplateLuminanceInput,
): Promise<TemplateLuminance> {
  try {
    const response = await axiosInstance.post(ENDPOINT, { data: writeBody(input) });
    return readLuminanceRecord(response.data);
  } catch (error) {
    handleApiError(error, "createTemplateLuminance");
  }
}

export async function updateTemplateLuminance(
  id: number,
  input: TemplateLuminanceInput,
): Promise<TemplateLuminance> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: writeBody(input),
    });
    return readLuminanceRecord(response.data);
  } catch (error) {
    handleApiError(error, "updateTemplateLuminance");
  }
}

export async function setTemplateLuminancePublished(
  id: number,
  published: boolean,
): Promise<TemplateLuminance> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: { publishedAt: published ? new Date().toISOString() : null },
    });
    return readLuminanceRecord(response.data);
  } catch (error) {
    handleApiError(error, "setTemplateLuminancePublished");
  }
}

export async function deleteTemplateLuminance(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error, "deleteTemplateLuminance");
  }
}
