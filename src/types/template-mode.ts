export interface TemplateMode {
  id: number;
  name: string;
  slug: string;
  publishedAt: string | null;
}

export interface TemplateModeInput {
  name: string;
  slug: string;
}

export interface TemplateModeListResponse {
  data: TemplateMode[];
}
