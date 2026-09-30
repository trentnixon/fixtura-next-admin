import { TemplateAnimation } from "@/types/template-animation";

interface RawAnimation {
  id: number;
  presetId?: string;
  name?: string;
  description?: string | null;
  defaultConfiguration?: unknown;
  configurationSchema?: unknown;
  operatorVisible?: boolean;
  isActive?: boolean;
  isDefault?: boolean;
  sortOrder?: number | null;
  catalogueVersion?: string | number | null;
  publishedAt?: string | null;
  attributes?: Omit<RawAnimation, "id" | "attributes">;
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function parseRequiredJson(label: string, value: string): unknown {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${label} is required`);
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error(`${label} must be valid JSON`);
  }
}

export function jsonToEditorValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
}

export function toTemplateAnimation(raw: RawAnimation): TemplateAnimation {
  const source = raw.attributes ?? raw;
  return {
    id: raw.id,
    presetId: text(source.presetId),
    name: text(source.name),
    description: text(source.description),
    defaultConfiguration: source.defaultConfiguration ?? null,
    configurationSchema: source.configurationSchema ?? null,
    operatorVisible: Boolean(source.operatorVisible),
    isActive: source.isActive !== false,
    isDefault: Boolean(source.isDefault),
    sortOrder: typeof source.sortOrder === "number" ? source.sortOrder : null,
    catalogueVersion: text(source.catalogueVersion),
    publishedAt: source.publishedAt ?? null,
  };
}

export function readAnimationRecord(
  body: { data?: RawAnimation } | RawAnimation,
): TemplateAnimation {
  const raw = "data" in body && body.data ? body.data : (body as RawAnimation);
  return toTemplateAnimation(raw);
}
