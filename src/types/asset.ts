export type AssetSport = "Cricket" | "AFL" | "Hockey" | "Netball" | "Basketball";
export type AssetContentType = "Single" | "Collective";

export interface AssetCategoryAttributes {
  Name: string;
}

export interface AssetCategory {
  id: number;
  attributes: AssetCategoryAttributes;
}

export interface PlayHqEndPointAttributes {
  Name: string;
}

export interface PlayHqEndPoint {
  id: number;
  attributes: PlayHqEndPointAttributes;
}

export interface SubscriptionPackageAttributes {
  Name: string;
}

export interface SubscriptionPackage {
  id: number;
  attributes: SubscriptionPackageAttributes;
}

export interface AssetTypeAttributes {
  Name: string;
}

export interface AssetType {
  id: number;
  attributes: AssetTypeAttributes;
}

export interface AccountTypeAttributes {
  Name: string;
}

export interface AccountType {
  id: number;
  attributes: AccountTypeAttributes;
}

export interface AssetAttributes {
  Name: string;
  CompositionID: string;
  description: string;
  Metadata: unknown; // JSON
  filter: string;
  ContentType: AssetContentType;
  ArticleFormats: string;
  assetDescription: string; // richtext
  SubTitle: string;
  Icon: string;
  Blurb: string; // richtext
  Sport: AssetSport;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  asset_category?: { data: AssetCategory | null };
  play_hq_end_point?: { data: PlayHqEndPoint | null };
  subscription_package?: { data: SubscriptionPackage | null };
  asset_type?: { data: AssetType | null };
  account_types?: { data: AccountType[] };
}

export interface Asset {
  id: number;
  attributes: AssetAttributes;
}

export interface AssetInput {
  Name: string;
  CompositionID: string;
  description?: string;
  Metadata?: unknown;
  filter?: string;
  ContentType: AssetContentType;
  ArticleFormats?: string;
  assetDescription?: string;
  SubTitle?: string;
  Icon?: string;
  Blurb?: string;
  Sport: AssetSport;
  asset_category?: number; // ID
  play_hq_end_point?: number; // ID
  subscription_package?: number; // ID
  asset_type?: number; // ID
  account_types?: number[]; // IDs
}

export interface FetchAssetsParams {
  page?: number;
  pageSize?: number;
  filters?: {
    Sport?: string;
    Name?: string;
    // Add other filters as needed
  };
}

export interface AssetsResponse {
  data: Asset[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
