"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";
import {
  PROTECTED_TEMPLATE_CATEGORY_ID,
  TemplateCategory,
  TemplateCategoryInput,
  TemplateCategoryListResponse,
} from "@/types/template-category";
import { readCategoryRecord, toTemplateCategory } from "./templateCategoryRecord";

const ENDPOINT = "/template-categories";

type CategoryRow = Parameters<typeof toTemplateCategory>[0];

function assertCanUnpublish(id: number) {
  if (id === PROTECTED_TEMPLATE_CATEGORY_ID) {
    throw new Error(
      "Category id 1 must stay published. New accounts are created with that row.",
    );
  }
}

function assertCanDelete(id: number) {
  if (id === PROTECTED_TEMPLATE_CATEGORY_ID) {
    throw new Error(
      "Category id 1 cannot be deleted. New accounts are created with that row.",
    );
  }
}

function assertStaysPublic(id: number, isPrivate: boolean) {
  if (id === PROTECTED_TEMPLATE_CATEGORY_ID && isPrivate) {
    throw new Error(
      "Category id 1 must stay public. A private category is rejected when an account saves.",
    );
  }
}

function writeBody(input: TemplateCategoryInput) {
  return {
    Name: input.name,
    slug: input.slug,
    divideFixturesBy: input.divideFixturesBy,
    isPrivate: input.isPrivate,
    bundle_audio: input.bundleAudioId,
  };
}

export async function fetchTemplateCategories(): Promise<TemplateCategoryListResponse> {
  const query = qs.stringify(
    {
      publicationState: "preview",
      populate: "bundle_audio",
      sort: ["Name:asc"],
      pagination: { page: 1, pageSize: 100 },
    },
    { encodeValuesOnly: true },
  );

  try {
    const response = await axiosInstance.get(`${ENDPOINT}?${query}`);
    const body = response.data as { data?: CategoryRow[] } | CategoryRow[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    return { data: rows.map((row) => toTemplateCategory(row)) };
  } catch (error) {
    handleApiError(error, "fetchTemplateCategories");
  }
}

export async function createTemplateCategory(
  input: TemplateCategoryInput,
): Promise<TemplateCategory> {
  try {
    const response = await axiosInstance.post(ENDPOINT, { data: writeBody(input) });
    return readCategoryRecord(response.data);
  } catch (error) {
    handleApiError(error, "createTemplateCategory");
  }
}

export async function updateTemplateCategory(
  id: number,
  input: TemplateCategoryInput,
): Promise<TemplateCategory> {
  assertStaysPublic(id, input.isPrivate);

  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, { data: writeBody(input) });
    return readCategoryRecord(response.data);
  } catch (error) {
    handleApiError(error, "updateTemplateCategory");
  }
}

export async function setTemplateCategoryPublished(
  id: number,
  published: boolean,
): Promise<TemplateCategory> {
  if (!published) assertCanUnpublish(id);

  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: { publishedAt: published ? new Date().toISOString() : null },
    });
    return readCategoryRecord(response.data);
  } catch (error) {
    handleApiError(error, "setTemplateCategoryPublished");
  }
}

export async function deleteTemplateCategory(id: number): Promise<void> {
  assertCanDelete(id);

  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error, "deleteTemplateCategory");
  }
}
