export interface TemplateAnimation {
  id: number;
  presetId: string;
  name: string;
  description: string;
  defaultConfiguration: unknown;
  configurationSchema: unknown;
  operatorVisible: boolean;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number | null;
  catalogueVersion: string;
  publishedAt: string | null;
}

export interface TemplateAnimationInput {
  presetId: string;
  name: string;
  description: string;
  defaultConfiguration: unknown;
  configurationSchema: unknown;
  operatorVisible: boolean;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number | null;
  catalogueVersion: string;
}

export interface TemplateAnimationListResponse {
  data: TemplateAnimation[];
}
