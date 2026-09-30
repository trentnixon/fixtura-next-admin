"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";
import {
  TEMPLATE_OPTION_LINK_KEYS,
  TemplateOption,
  TemplateOptionInput,
  TemplateOptionListResponse,
} from "@/types/template-option";
import { readOptionRecord, toTemplateOption } from "./templateOptionRecord";

const ENDPOINT = "/template-options";

type OptionRow = Parameters<typeof toTemplateOption>[0];

const populate = {
  account: true,
  template_category: true,
  template_mode: true,
  template_palette: true,
  template_gradient: true,
  template_image: true,
  template_video: true,
  template_texture: true,
  template_animation: true,
  template_luminance: true,
  template_noise: true,
  template_particle: true,
  template_pattern: true,
};

function writeBody(input: TemplateOptionInput) {
  const links = TEMPLATE_OPTION_LINK_KEYS.reduce<Record<string, number | null>>((body, key) => {
    body[key] = input.links[key];
    return body;
  }, {});
  return {
    useBackground: input.useBackground,
    ...links,
  };
}

export async function fetchTemplateOptions(
  accountId?: number,
): Promise<TemplateOptionListResponse> {
  const query = qs.stringify(
    {
      publicationState: "preview",
      populate,
      sort: ["id:desc"],
      pagination: { page: 1, pageSize: 100 },
      ...(accountId ? { filters: { account: { id: { $eq: accountId } } } } : {}),
    },
    { encodeValuesOnly: true },
  );

  try {
    const response = await axiosInstance.get(`${ENDPOINT}?${query}`);
    const body = response.data as {
      data?: OptionRow[];
      meta?: { pagination?: { total?: number } };
    } | OptionRow[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    const total = Array.isArray(body) ? rows.length : (body.meta?.pagination?.total ?? rows.length);
    return { data: rows.map((row) => toTemplateOption(row)), total };
  } catch (error) {
    handleApiError(error, "fetchTemplateOptions");
  }
}

export async function updateTemplateOption(
  id: number,
  input: TemplateOptionInput,
): Promise<TemplateOption> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, { data: writeBody(input) });
    return readOptionRecord(response.data);
  } catch (error) {
    handleApiError(error, "updateTemplateOption");
  }
}

export async function setTemplateOptionPublished(
  id: number,
  published: boolean,
): Promise<TemplateOption> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: { publishedAt: published ? new Date().toISOString() : null },
    });
    return readOptionRecord(response.data);
  } catch (error) {
    handleApiError(error, "setTemplateOptionPublished");
  }
}

export async function deleteTemplateOption(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error, "deleteTemplateOption");
  }
}
