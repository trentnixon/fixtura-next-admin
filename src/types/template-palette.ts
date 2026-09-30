export const PROTECTED_TEMPLATE_PALETTE_ID = 1;

export interface TemplatePalette {
  id: number;
  name: string;
  value: string;
  publishedAt: string | null;
}

export interface TemplatePaletteInput {
  name: string;
  value: string;
}

export interface TemplatePaletteListResponse {
  data: TemplatePalette[];
}
