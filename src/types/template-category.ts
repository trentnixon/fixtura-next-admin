export const PROTECTED_TEMPLATE_CATEGORY_ID = 1;

export interface TemplateCategory {
  id: number;
  name: string;
  slug: string;
  divideFixturesBy: unknown;
  isPrivate: boolean;
  bundleAudioId: number | null;
  bundleAudioName: string;
  publishedAt: string | null;
}

export interface TemplateCategoryInput {
  name: string;
  slug: string;
  divideFixturesBy: unknown | null;
  isPrivate: boolean;
  bundleAudioId: number | null;
}

export interface TemplateCategoryListResponse {
  data: TemplateCategory[];
}
