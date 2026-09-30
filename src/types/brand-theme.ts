export interface BrandColours {
  primary: string;
  secondary: string;
  dark: string;
  white: string;
}

export interface BrandTheme {
  id: number;
  name: string;
  theme: BrandColours;
  isPublic: boolean;
  createdBy: number | null;
  publishedAt: string | null;
}

export interface BrandThemeInput {
  name: string;
  theme: BrandColours;
  isPublic: boolean;
  createdBy: number | null;
}

export interface BrandThemeListResponse {
  data: BrandTheme[];
}
