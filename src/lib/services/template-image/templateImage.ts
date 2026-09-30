"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";
import {
  PROTECTED_TEMPLATE_IMAGE_ID,
  TemplateImage,
  TemplateImageInput,
  TemplateImageListResponse,
} from "@/types/template-image";
import { readImageRecord, toTemplateImage } from "./templateImageRecord";

const ENDPOINT = "/template-images";

type ImageRow = Parameters<typeof toTemplateImage>[0];

function assertCanUnpublish(id: number) {
  if (id === PROTECTED_TEMPLATE_IMAGE_ID) {
    throw new Error(
      "Image preset id 1 must stay published. New accounts are created with that row.",
    );
  }
}

function assertCanDelete(id: number) {
  if (id === PROTECTED_TEMPLATE_IMAGE_ID) {
    throw new Error(
      "Image preset id 1 cannot be deleted. New accounts are created with that row.",
    );
  }
}

export async function fetchTemplateImages(): Promise<TemplateImageListResponse> {
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
    const body = response.data as { data?: ImageRow[] } | ImageRow[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    return { data: rows.map((row) => toTemplateImage(row)) };
  } catch (error) {
    handleApiError(error, "fetchTemplateImages");
  }
}

export async function createTemplateImage(
  input: TemplateImageInput,
): Promise<TemplateImage> {
  try {
    const response = await axiosInstance.post(ENDPOINT, { data: input });
    return readImageRecord(response.data);
  } catch (error) {
    handleApiError(error, "createTemplateImage");
  }
}

export async function updateTemplateImage(
  id: number,
  input: TemplateImageInput,
): Promise<TemplateImage> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, { data: input });
    return readImageRecord(response.data);
  } catch (error) {
    handleApiError(error, "updateTemplateImage");
  }
}

export async function setTemplateImagePublished(
  id: number,
  published: boolean,
): Promise<TemplateImage> {
  if (!published) assertCanUnpublish(id);

  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: { publishedAt: published ? new Date().toISOString() : null },
    });
    return readImageRecord(response.data);
  } catch (error) {
    handleApiError(error, "setTemplateImagePublished");
  }
}

export async function deleteTemplateImage(id: number): Promise<void> {
  assertCanDelete(id);

  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error, "deleteTemplateImage");
  }
}
