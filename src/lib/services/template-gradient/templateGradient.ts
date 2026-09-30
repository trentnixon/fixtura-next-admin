"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";
import {
  PROTECTED_TEMPLATE_GRADIENT_ID,
  TemplateGradient,
  TemplateGradientInput,
  TemplateGradientListResponse,
} from "@/types/template-gradient";
import { readGradientRecord, toTemplateGradient } from "./templateGradientRecord";

const ENDPOINT = "/template-gradients";

type GradientRow = Parameters<typeof toTemplateGradient>[0];

function assertCanUnpublish(id: number) {
  if (id === PROTECTED_TEMPLATE_GRADIENT_ID) {
    throw new Error(
      "Gradient id 1 must stay published. New accounts are created with that row.",
    );
  }
}

function assertCanDelete(id: number) {
  if (id === PROTECTED_TEMPLATE_GRADIENT_ID) {
    throw new Error(
      "Gradient id 1 cannot be deleted. New accounts are created with that row.",
    );
  }
}

export async function fetchTemplateGradients(): Promise<TemplateGradientListResponse> {
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
    const body = response.data as { data?: GradientRow[] } | GradientRow[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    return { data: rows.map((row) => toTemplateGradient(row)) };
  } catch (error) {
    handleApiError(error, "fetchTemplateGradients");
  }
}

export async function createTemplateGradient(
  input: TemplateGradientInput,
): Promise<TemplateGradient> {
  try {
    const response = await axiosInstance.post(ENDPOINT, { data: input });
    return readGradientRecord(response.data);
  } catch (error) {
    handleApiError(error, "createTemplateGradient");
  }
}

export async function updateTemplateGradient(
  id: number,
  input: TemplateGradientInput,
): Promise<TemplateGradient> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, { data: input });
    return readGradientRecord(response.data);
  } catch (error) {
    handleApiError(error, "updateTemplateGradient");
  }
}

export async function setTemplateGradientPublished(
  id: number,
  published: boolean,
): Promise<TemplateGradient> {
  if (!published) assertCanUnpublish(id);

  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: { publishedAt: published ? new Date().toISOString() : null },
    });
    return readGradientRecord(response.data);
  } catch (error) {
    handleApiError(error, "setTemplateGradientPublished");
  }
}

export async function deleteTemplateGradient(id: number): Promise<void> {
  assertCanDelete(id);

  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error, "deleteTemplateGradient");
  }
}
