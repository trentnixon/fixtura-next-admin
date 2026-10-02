import { humanizeToken } from "../../components/humanizeToken";

export function fixtureSplits(value: unknown): { label: string; count: number }[] | null {
  if (value === null || value === undefined || value === "") return [];
  if (typeof value !== "object" || Array.isArray(value)) return null;
  const entries: { label: string; count: number }[] = [];
  for (const [key, count] of Object.entries(value)) {
    if (typeof count !== "number" || !Number.isFinite(count)) return null;
    entries.push({ label: humanizeToken(key), count });
  }
  return entries;
}
