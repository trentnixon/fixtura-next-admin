/** PlayHQ-style label objects returned by CMS for grounds, addresses, and similar fields. */
export type FixtureLabelValue = {
  text?: string | null;
  mapsQuery?: string | null;
};

function isFixtureLabelValue(value: object): value is FixtureLabelValue {
  return "text" in value || "mapsQuery" in value;
}

export function toFixtureDisplayText(
  value: string | null | undefined | FixtureLabelValue | unknown,
  fallback = "N/A",
): string {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object" && isFixtureLabelValue(value)) {
    const text = value.text;
    if (typeof text === "string" && text.trim().length > 0) {
      return text.trim();
    }
    return fallback;
  }
  return fallback;
}

export function toFixtureMapsQuery(
  value: string | null | undefined | FixtureLabelValue | unknown,
): string | null {
  if (typeof value !== "object" || value === null) return null;
  if (!isFixtureLabelValue(value)) return null;
  const mapsQuery = value.mapsQuery;
  if (typeof mapsQuery !== "string") return null;
  const trimmed = mapsQuery.trim();
  return trimmed.length > 0 ? trimmed : null;
}
