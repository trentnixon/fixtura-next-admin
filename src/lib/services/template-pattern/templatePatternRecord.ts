import { TemplatePattern } from "@/types/template-pattern";

interface RawPattern {
  id: number;
  name?: string;
  patternType?: string;
  animation?: string;
  scale?: number | string | null;
  rotation?: number | string | null;
  opacity?: number | string | null;
  animationDuration?: number | string | null;
  animationSpeed?: number | string | null;
  publishedAt?: string | null;
  attributes?: Omit<RawPattern, "id" | "attributes">;
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function toTemplatePattern(raw: RawPattern): TemplatePattern {
  const source = raw.attributes ?? raw;
  return {
    id: raw.id,
    name: text(source.name),
    patternType: text(source.patternType),
    animation: text(source.animation),
    scale: numberOrNull(source.scale),
    rotation: numberOrNull(source.rotation),
    opacity: numberOrNull(source.opacity),
    animationDuration: numberOrNull(source.animationDuration),
    animationSpeed: numberOrNull(source.animationSpeed),
    publishedAt: source.publishedAt ?? null,
  };
}

export function readPatternRecord(
  body: { data?: RawPattern } | RawPattern,
): TemplatePattern {
  const raw = "data" in body && body.data ? body.data : (body as RawPattern);
  return toTemplatePattern(raw);
}
