"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";
import {
  TemplateAnimation,
  TemplateAnimationInput,
  TemplateAnimationListResponse,
} from "@/types/template-animation";
import { readAnimationRecord, toTemplateAnimation } from "./templateAnimationRecord";

const ENDPOINT = "/template-animations";

type AnimationRow = Parameters<typeof toTemplateAnimation>[0];

function writeBody(input: TemplateAnimationInput) {
  return {
    presetId: input.presetId,
    name: input.name,
    description: input.description,
    defaultConfiguration: input.defaultConfiguration,
    configurationSchema: input.configurationSchema,
    operatorVisible: input.operatorVisible,
    isActive: input.isActive,
    isDefault: input.isDefault,
    sortOrder: input.sortOrder,
    catalogueVersion: input.catalogueVersion,
  };
}

export async function fetchTemplateAnimations(): Promise<TemplateAnimationListResponse> {
  const query = qs.stringify(
    {
      publicationState: "preview",
      sort: ["sortOrder:asc", "name:asc"],
      pagination: { page: 1, pageSize: 100 },
    },
    { encodeValuesOnly: true },
  );

  try {
    const response = await axiosInstance.get(`${ENDPOINT}?${query}`);
    const body = response.data as { data?: AnimationRow[] } | AnimationRow[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    return { data: rows.map((row) => toTemplateAnimation(row)) };
  } catch (error) {
    handleApiError(error, "fetchTemplateAnimations");
  }
}

export async function createTemplateAnimation(
  input: TemplateAnimationInput,
): Promise<TemplateAnimation> {
  try {
    const response = await axiosInstance.post(ENDPOINT, { data: writeBody(input) });
    return readAnimationRecord(response.data);
  } catch (error) {
    handleApiError(error, "createTemplateAnimation");
  }
}

export async function updateTemplateAnimation(
  id: number,
  input: TemplateAnimationInput,
): Promise<TemplateAnimation> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: writeBody(input),
    });
    return readAnimationRecord(response.data);
  } catch (error) {
    handleApiError(error, "updateTemplateAnimation");
  }
}

export async function setTemplateAnimationPublished(
  id: number,
  published: boolean,
): Promise<TemplateAnimation> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: { publishedAt: published ? new Date().toISOString() : null },
    });
    return readAnimationRecord(response.data);
  } catch (error) {
    handleApiError(error, "setTemplateAnimationPublished");
  }
}

export async function deleteTemplateAnimation(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error, "deleteTemplateAnimation");
  }
}
