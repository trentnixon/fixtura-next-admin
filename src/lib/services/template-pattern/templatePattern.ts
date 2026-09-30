"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";
import {
  PROTECTED_TEMPLATE_PATTERN_ID,
  TemplatePattern,
  TemplatePatternInput,
  TemplatePatternListResponse,
} from "@/types/template-pattern";
import { readPatternRecord, toTemplatePattern } from "./templatePatternRecord";

const ENDPOINT = "/template-patterns";

type PatternRow = Parameters<typeof toTemplatePattern>[0];

function assertCanUnpublish(id: number) {
  if (id === PROTECTED_TEMPLATE_PATTERN_ID) {
    throw new Error(
      "Pattern id 1 must stay published. New accounts are created with that row.",
    );
  }
}

function assertCanDelete(id: number) {
  if (id === PROTECTED_TEMPLATE_PATTERN_ID) {
    throw new Error(
      "Pattern id 1 cannot be deleted. New accounts are created with that row.",
    );
  }
}

export async function fetchTemplatePatterns(): Promise<TemplatePatternListResponse> {
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
    const body = response.data as { data?: PatternRow[] } | PatternRow[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    return { data: rows.map((row) => toTemplatePattern(row)) };
  } catch (error) {
    handleApiError(error, "fetchTemplatePatterns");
  }
}

export async function createTemplatePattern(
  input: TemplatePatternInput,
): Promise<TemplatePattern> {
  try {
    const response = await axiosInstance.post(ENDPOINT, { data: input });
    return readPatternRecord(response.data);
  } catch (error) {
    handleApiError(error, "createTemplatePattern");
  }
}

export async function updateTemplatePattern(
  id: number,
  input: TemplatePatternInput,
): Promise<TemplatePattern> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, { data: input });
    return readPatternRecord(response.data);
  } catch (error) {
    handleApiError(error, "updateTemplatePattern");
  }
}

export async function setTemplatePatternPublished(
  id: number,
  published: boolean,
): Promise<TemplatePattern> {
  if (!published) assertCanUnpublish(id);

  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: { publishedAt: published ? new Date().toISOString() : null },
    });
    return readPatternRecord(response.data);
  } catch (error) {
    handleApiError(error, "setTemplatePatternPublished");
  }
}

export async function deleteTemplatePattern(id: number): Promise<void> {
  assertCanDelete(id);

  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error, "deleteTemplatePattern");
  }
}
