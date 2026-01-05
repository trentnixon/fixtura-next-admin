/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { ListAssetCategoriesResponse, GetAssetCategoryResponse, FetchAssetCategoriesParams } from "@/types/asset-category";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";

const BASE_ENDPOINT = "asset-categories";

/**
 * List asset categories with pagination and optional filters.
 * Using the new flat API structure.
 */
export async function fetchAssetCategories(
  params: FetchAssetCategoriesParams = {}
): Promise<ListAssetCategoriesResponse> {
  const queryObj: any = {};
  if (params.page) queryObj.page = params.page;
  if (params.pageSize) queryObj.pageSize = params.pageSize;
  if (params.start) queryObj.start = params.start;
  if (params.populate) queryObj.populate = params.populate;
  if (params.sort) queryObj.sort = params.sort;

  if (params.Name?.trim()) {
    queryObj.Name = params.Name.trim();
  }
  if (params.Identifier?.trim()) {
    queryObj.Identifier = params.Identifier.trim();
  }

  const query = qs.stringify(queryObj, {
    encodeValuesOnly: true,
    skipNulls: true,
  });

  const url = `${BASE_ENDPOINT}/list${query ? `?${query}` : ""}`;

  try {
    const response = await axiosInstance.get<ListAssetCategoriesResponse>(url);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "fetchAssetCategories");
  }
}

/**
 * Get a single asset category by ID
 */
export async function fetchAssetCategoryById(
  id: number,
  params: { populate?: string } = {}
): Promise<GetAssetCategoryResponse> {
  const query = qs.stringify(params, { encodeValuesOnly: true, skipNulls: true });
  const url = `${BASE_ENDPOINT}/${id}${query ? `?${query}` : ""}`;

  try {
    const response = await axiosInstance.get<GetAssetCategoryResponse>(url);
    return response.data;
  } catch (error: any) {
    const msg = error.data?.error?.message || error.data?.message || error.message || "Unknown error";
    throw new Error(`Failed to fetch asset category ${id}: ${msg}`);
  }
}
