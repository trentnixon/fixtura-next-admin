"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";
import {
  TemplateMode,
  TemplateModeInput,
  TemplateModeListResponse,
} from "@/types/template-mode";
import { readModeRecord, toTemplateMode } from "./templateModeRecord";

const ENDPOINT = "/template-modes";

type ModeRow = Parameters<typeof toTemplateMode>[0];

function writeBody(input: TemplateModeInput) {
  return {
    Name: input.name,
    slug: input.slug,
  };
}

export async function fetchTemplateModes(): Promise<TemplateModeListResponse> {
  const query = qs.stringify(
    {
      publicationState: "preview",
      sort: ["Name:asc"],
      pagination: { page: 1, pageSize: 100 },
    },
    { encodeValuesOnly: true },
  );

  try {
    const response = await axiosInstance.get(`${ENDPOINT}?${query}`);
    const body = response.data as { data?: ModeRow[] } | ModeRow[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    return { data: rows.map((row) => toTemplateMode(row)) };
  } catch (error) {
    handleApiError(error, "fetchTemplateModes");
  }
}

export async function createTemplateMode(input: TemplateModeInput): Promise<TemplateMode> {
  try {
    const response = await axiosInstance.post(ENDPOINT, { data: writeBody(input) });
    return readModeRecord(response.data);
  } catch (error) {
    handleApiError(error, "createTemplateMode");
  }
}

export async function updateTemplateMode(
  id: number,
  input: TemplateModeInput,
): Promise<TemplateMode> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, { data: writeBody(input) });
    return readModeRecord(response.data);
  } catch (error) {
    handleApiError(error, "updateTemplateMode");
  }
}

export async function setTemplateModePublished(
  id: number,
  published: boolean,
): Promise<TemplateMode> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: { publishedAt: published ? new Date().toISOString() : null },
    });
    return readModeRecord(response.data);
  } catch (error) {
    handleApiError(error, "setTemplateModePublished");
  }
}

export async function deleteTemplateMode(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error, "deleteTemplateMode");
  }
}
