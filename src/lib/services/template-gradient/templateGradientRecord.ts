import { TemplateGradient } from "@/types/template-gradient";

interface RawGradient {
  id: number;
  name?: string;
  type?: string;
  direction?: string;
  publishedAt?: string | null;
  attributes?: Omit<RawGradient, "id" | "attributes">;
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function toTemplateGradient(raw: RawGradient): TemplateGradient {
  const source = raw.attributes ?? raw;
  return {
    id: raw.id,
    name: text(source.name),
    type: text(source.type),
    direction: text(source.direction),
    publishedAt: source.publishedAt ?? null,
  };
}

export function readGradientRecord(
  body: { data?: RawGradient } | RawGradient,
): TemplateGradient {
  const raw = "data" in body && body.data ? body.data : (body as RawGradient);
  return toTemplateGradient(raw);
}
