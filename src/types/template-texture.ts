export const TEXTURE_CATEGORIES = [
  "Paper",
  "Print",
  "Turf",
  "Infrastructure",
  "Metal",
  "Stadium",
] as const;

export const TEXTURE_BLEND_MODE = "multiply" as const;

export type TextureCategory = (typeof TEXTURE_CATEGORIES)[number];

export interface TemplateTexture {
  id: number;
  name: string;
  category: string;
  opacity: number | null;
  blendMode: string;
  textureId: number | null;
  textureUrl: string | null;
  textureName: string | null;
  publishedAt: string | null;
}

export interface TemplateTextureInput {
  name: string;
  category: TextureCategory;
  opacity: number | null;
  textureId: number;
}

export interface TemplateTextureListResponse {
  data: TemplateTexture[];
}
