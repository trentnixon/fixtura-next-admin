/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { ListAssetTypesResponse, GetAssetTypeResponse, FetchAssetTypesParams } from "@/types/asset-type";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";

const BASE_ENDPOINT = "asset-types";

/**
 * List asset types with pagination and optional filters.
 * Using the new flat API structure.
 */
export async function fetchAssetTypes(
  params: FetchAssetTypesParams = {}
): Promise<ListAssetTypesResponse> {
  // Build a clean query object excluding empty strings or nulls
  const queryObj: any = {};
  if (params.page) queryObj.page = params.page;
  if (params.pageSize) queryObj.pageSize = params.pageSize;
  if (params.start) queryObj.start = params.start;
  if (params.populate) queryObj.populate = params.populate;
  if (params.sort) queryObj.sort = params.sort;

  // Only add Name if it has a non-empty value to avoid &Name= in URL
  if (params.Name && params.Name.trim() !== "") {
    queryObj.Name = params.Name;
  }

  const query = qs.stringify(queryObj, {
    encodeValuesOnly: true,
    skipNulls: true,
  });

  // The documentation specifies '/list', but the 400 error suggests shadowing.
  // We will stick to the documentation path for now but with a clean query.
  const url = `${BASE_ENDPOINT}/list${query ? `?${query}` : ""}`;

  try {
    const response = await axiosInstance.get<ListAssetTypesResponse>(url);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "fetchAssetTypes");
  }
}

/**
 * Get a single asset type by ID
 */
export async function fetchAssetTypeById(
  id: number,
  params: { populate?: string } = {}
): Promise<GetAssetTypeResponse> {
  const query = qs.stringify(params, { encodeValuesOnly: true, skipNulls: true });
  const url = `${BASE_ENDPOINT}/${id}${query ? `?${query}` : ""}`;

  try {
    const response = await axiosInstance.get<GetAssetTypeResponse>(url);
    return response.data;
  } catch (error: any) {
    const msg = error.data?.error?.message || error.data?.message || error.message || "Unknown error";
    throw new Error(`Failed to fetch asset type ${id}: ${msg}`);
  }
}
