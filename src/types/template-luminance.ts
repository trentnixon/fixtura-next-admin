export interface TemplateLuminance {
  id: number;
  name: string;
  imageId: number | null;
  imageUrl: string | null;
  imageName: string | null;
  publishedAt: string | null;
}

export interface TemplateLuminanceInput {
  name: string;
  imageId: number;
}

export interface TemplateLuminanceListResponse {
  data: TemplateLuminance[];
}
