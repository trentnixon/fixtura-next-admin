"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";
import {
  TEXTURE_BLEND_MODE,
  TemplateTexture,
  TemplateTextureInput,
  TemplateTextureListResponse,
} from "@/types/template-texture";
import { readTextureRecord, toTemplateTexture } from "./templateTextureRecord";

const ENDPOINT = "/template-textures";

type TextureRow = Parameters<typeof toTemplateTexture>[0];

function writeBody(input: TemplateTextureInput) {
  return {
    Name: input.name,
    category: input.category,
    opacity: input.opacity,
    blendMode: TEXTURE_BLEND_MODE,
    texture: input.textureId,
  };
}

export async function fetchTemplateTextures(): Promise<TemplateTextureListResponse> {
  const query = qs.stringify(
    {
      publicationState: "preview",
      populate: "texture",
      sort: ["Name:asc"],
      pagination: { page: 1, pageSize: 100 },
    },
    { encodeValuesOnly: true },
  );

  try {
    const response = await axiosInstance.get(`${ENDPOINT}?${query}`);
    const body = response.data as { data?: TextureRow[] } | TextureRow[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    return { data: rows.map((row) => toTemplateTexture(row)) };
  } catch (error) {
    handleApiError(error, "fetchTemplateTextures");
  }
}

export async function createTemplateTexture(
  input: TemplateTextureInput,
): Promise<TemplateTexture> {
  try {
    const response = await axiosInstance.post(ENDPOINT, { data: writeBody(input) });
    return readTextureRecord(response.data);
  } catch (error) {
    handleApiError(error, "createTemplateTexture");
  }
}

export async function updateTemplateTexture(
  id: number,
  input: TemplateTextureInput,
): Promise<TemplateTexture> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: writeBody(input),
    });
    return readTextureRecord(response.data);
  } catch (error) {
    handleApiError(error, "updateTemplateTexture");
  }
}

export async function setTemplateTexturePublished(
  id: number,
  published: boolean,
): Promise<TemplateTexture> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: { publishedAt: published ? new Date().toISOString() : null },
    });
    return readTextureRecord(response.data);
  } catch (error) {
    handleApiError(error, "setTemplateTexturePublished");
  }
}

export async function deleteTemplateTexture(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error, "deleteTemplateTexture");
  }
}
