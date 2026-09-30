import { TemplateParticle } from "@/types/template-particle";

interface RawParticle {
  id: number;
  name?: string;
  particleType?: string;
  particleCount?: number | string | null;
  speed?: number | string | null;
  direction?: string;
  animationType?: string;
  publishedAt?: string | null;
  attributes?: Omit<RawParticle, "id" | "attributes">;
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

export function toTemplateParticle(raw: RawParticle): TemplateParticle {
  const source = raw.attributes ?? raw;
  return {
    id: raw.id,
    name: text(source.name),
    particleType: text(source.particleType),
    particleCount: numberOrNull(source.particleCount),
    speed: numberOrNull(source.speed),
    direction: text(source.direction),
    animationType: text(source.animationType),
    publishedAt: source.publishedAt ?? null,
  };
}

export function readParticleRecord(
  body: { data?: RawParticle } | RawParticle,
): TemplateParticle {
  const raw = "data" in body && body.data ? body.data : (body as RawParticle);
  return toTemplateParticle(raw);
}
