
export interface AssetType {
  id: number;
  Name: string;
  assets: unknown[] | null; // Placeholder for asset relations
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface ListAssetTypesResponse {
  data: AssetType[];
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

export interface GetAssetTypeResponse {
  data: AssetType;
}

export interface FetchAssetTypesParams {
  page?: number;
  pageSize?: number;
  start?: number;
  populate?: string;
  sort?: string;
  Name?: string;
}
