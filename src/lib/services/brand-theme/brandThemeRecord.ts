import { BrandColours, BrandTheme } from "@/types/brand-theme";

interface RawTheme {
  id: number;
  Name?: string;
  name?: string;
  Theme?: unknown;
  isPublic?: boolean;
  CreatedBy?: number | { id?: number } | null;
  publishedAt?: string | null;
  attributes?: Omit<RawTheme, "id" | "attributes">;
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function readColours(value: unknown): BrandColours {
  let source: unknown = value;
  if (typeof value === "string" && value.trim()) {
    try {
      source = JSON.parse(value);
    } catch {
      source = null;
    }
  }
  const colours = source && typeof source === "object" ? (source as Record<string, unknown>) : {};
  return {
    primary: text(colours.primary),
    secondary: text(colours.secondary),
    dark: text(colours.dark),
    white: text(colours.white),
  };
}

function readCreatedBy(value: RawTheme["CreatedBy"]): number | null {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && typeof value.id === "number") return value.id;
  return null;
}

export function toBrandTheme(raw: RawTheme): BrandTheme {
  const source = raw.attributes ?? raw;
  return {
    id: raw.id,
    name: text(source.Name ?? source.name),
    theme: readColours(source.Theme),
    isPublic: Boolean(source.isPublic),
    createdBy: readCreatedBy(source.CreatedBy),
    publishedAt: source.publishedAt ?? null,
  };
}

export function readBrandThemeRecord(body: { data?: RawTheme } | RawTheme): BrandTheme {
  const raw = "data" in body && body.data ? body.data : (body as RawTheme);
  return toBrandTheme(raw);
}
