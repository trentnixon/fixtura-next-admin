import { Asset } from "./asset";

export interface AssetCategory {
  id: number;
  Name: string;
  Identifier: string | null;
  description: string | null;
  assets?: Asset[] | null; // Populated if requested
  createdAt: string;
  updatedAt: string;
}

export interface FetchAssetCategoriesParams {
  page?: number;
  pageSize?: number;
  start?: number;
  populate?: string;
  sort?: string;
  Name?: string;
  Identifier?: string;
}

export interface ListAssetCategoriesResponse {
  data: AssetCategory[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
      start: number;
    };
  };
}

export interface GetAssetCategoryResponse {
  data: AssetCategory;
}
