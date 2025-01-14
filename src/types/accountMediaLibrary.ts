// src/types/accountMediaLibrary.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ImageDataAttributes {
  url: string;
}

export interface ImageData {
  attributes: ImageDataAttributes;
}

export interface AccountMediaLibraryAttributes {
  imageId: {
    data: ImageData;
  };
  title: string;
  isActive: boolean;
  tags: any;
  AgeGroup: "Seniors" | "Juniors" | "Both";
  AssetType:
    | "ALL"
    | "Upcoming Fixtures"
    | "Weekend Results"
    | "Top 5 Run Scorers"
    | "Top 5 Bowlers"
    | "League Tables"
    | "Team List";
}

export interface AccountMediaLibrary {
  id: number;
  attributes: AccountMediaLibraryAttributes;
}

export interface AccountMediaLibraryState {
  accountMediaLibraries: AccountMediaLibrary[];
  loading: boolean;
  error: string | null;
}
