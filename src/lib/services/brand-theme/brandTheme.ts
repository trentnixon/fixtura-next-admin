"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";
import { BrandTheme, BrandThemeInput, BrandThemeListResponse } from "@/types/brand-theme";
import { readBrandThemeRecord, toBrandTheme } from "./brandThemeRecord";

const ENDPOINT = "/themes";

type ThemeRow = Parameters<typeof toBrandTheme>[0];

function writeBody(input: BrandThemeInput) {
  return {
    Name: input.name,
    Theme: input.theme,
    isPublic: input.isPublic,
    ...(input.createdBy === null ? {} : { CreatedBy: input.createdBy }),
  };
}

export async function fetchBrandThemes(): Promise<BrandThemeListResponse> {
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
    const body = response.data as { data?: ThemeRow[] } | ThemeRow[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    return { data: rows.map((row) => toBrandTheme(row)) };
  } catch (error) {
    handleApiError(error, "fetchBrandThemes");
  }
}

export async function createBrandTheme(input: BrandThemeInput): Promise<BrandTheme> {
  try {
    const response = await axiosInstance.post(ENDPOINT, { data: writeBody(input) });
    return readBrandThemeRecord(response.data);
  } catch (error) {
    handleApiError(error, "createBrandTheme");
  }
}

export async function updateBrandTheme(id: number, input: BrandThemeInput): Promise<BrandTheme> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, { data: writeBody(input) });
    return readBrandThemeRecord(response.data);
  } catch (error) {
    handleApiError(error, "updateBrandTheme");
  }
}

export async function deleteBrandTheme(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error, "deleteBrandTheme");
  }
}
