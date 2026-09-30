import {
  NOISE_TYPES,
  NoiseType,
  TemplateNoise,
} from "@/types/template-noise";

interface RawNoise {
  id: number;
  name?: string;
  noiseType?: string;
  publishedAt?: string | null;
  attributes?: {
    name?: string;
    noiseType?: string;
    publishedAt?: string | null;
  };
}

export function toTemplateNoise(raw: RawNoise): TemplateNoise {
  const source = raw.attributes ?? raw;
  return {
    id: raw.id,
    name: source.name ?? "",
    noiseType: source.noiseType ?? "",
    publishedAt: source.publishedAt ?? null,
  };
}

export function assertNoiseType(value: string): NoiseType {
  const match = NOISE_TYPES.find((noiseType) => noiseType === value);
  if (!match) {
    throw new Error(`Unknown noise type: ${value}`);
  }
  return match;
}

export function readNoiseRecord(body: { data?: RawNoise } | RawNoise): TemplateNoise {
  const raw = "data" in body && body.data ? body.data : (body as RawNoise);
  return toTemplateNoise(raw);
}
