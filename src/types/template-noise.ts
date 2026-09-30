export const NOISE_TYPES = [
  "default",
  "subtle",
  "grain",
  "wave",
  "fog",
  "static",
  "floatingParticles",
  "dynamicParticles",
  "triangleSwarm",
  "pulsingCircles",
  "digitalRain",
  "gradientGrid",
  "spokes",
] as const;

export type NoiseType = (typeof NOISE_TYPES)[number];

export const PROTECTED_TEMPLATE_NOISE_ID = 1;

export interface TemplateNoise {
  id: number;
  name: string;
  noiseType: string;
  publishedAt: string | null;
}

export interface TemplateNoiseInput {
  name: string;
  noiseType: NoiseType;
}

export interface TemplateNoiseListResponse {
  data: TemplateNoise[];
}
