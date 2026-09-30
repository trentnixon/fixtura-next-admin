export const PROTECTED_TEMPLATE_GRADIENT_ID = 1;

export interface TemplateGradient {
  id: number;
  name: string;
  type: string;
  direction: string;
  publishedAt: string | null;
}

export interface TemplateGradientInput {
  name: string;
  type: string;
  direction: string;
}

export interface TemplateGradientListResponse {
  data: TemplateGradient[];
}
