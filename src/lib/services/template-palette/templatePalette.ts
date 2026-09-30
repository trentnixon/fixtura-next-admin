"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";
import {
  PROTECTED_TEMPLATE_PALETTE_ID,
  TemplatePalette,
  TemplatePaletteInput,
  TemplatePaletteListResponse,
} from "@/types/template-palette";
import { readPaletteRecord, toTemplatePalette } from "./templatePaletteRecord";

const ENDPOINT = "/template-palettes";

type PaletteRow = Parameters<typeof toTemplatePalette>[0];

function assertCanUnpublish(id: number) {
  if (id === PROTECTED_TEMPLATE_PALETTE_ID) {
    throw new Error(
      "Palette id 1 must stay published. New accounts are created with that row.",
    );
  }
}

function assertCanDelete(id: number) {
  if (id === PROTECTED_TEMPLATE_PALETTE_ID) {
    throw new Error(
      "Palette id 1 cannot be deleted. New accounts are created with that row.",
    );
  }
}

export async function fetchTemplatePalettes(): Promise<TemplatePaletteListResponse> {
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
    const body = response.data as { data?: PaletteRow[] } | PaletteRow[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    return { data: rows.map((row) => toTemplatePalette(row)) };
  } catch (error) {
    handleApiError(error, "fetchTemplatePalettes");
  }
}

export async function createTemplatePalette(
  input: TemplatePaletteInput,
): Promise<TemplatePalette> {
  try {
    const response = await axiosInstance.post(ENDPOINT, { data: input });
    return readPaletteRecord(response.data);
  } catch (error) {
    handleApiError(error, "createTemplatePalette");
  }
}

export async function updateTemplatePalette(
  id: number,
  input: TemplatePaletteInput,
): Promise<TemplatePalette> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, { data: input });
    return readPaletteRecord(response.data);
  } catch (error) {
    handleApiError(error, "updateTemplatePalette");
  }
}

export async function setTemplatePalettePublished(
  id: number,
  published: boolean,
): Promise<TemplatePalette> {
  if (!published) assertCanUnpublish(id);

  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: { publishedAt: published ? new Date().toISOString() : null },
    });
    return readPaletteRecord(response.data);
  } catch (error) {
    handleApiError(error, "setTemplatePalettePublished");
  }
}

export async function deleteTemplatePalette(id: number): Promise<void> {
  assertCanDelete(id);

  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error, "deleteTemplatePalette");
  }
}
