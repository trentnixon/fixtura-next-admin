/**
 * Resolve a Strapi upload URL (often relative `/uploads/...`) to an absolute URL.
 */
export function resolveStrapiMediaUrl(
  url: string | null | undefined,
  cmsOrigin?: string,
): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const base =
    cmsOrigin?.replace(/\/$/, "") ??
    (typeof process.env.NEXT_APP_API_BASE_URL === "string"
      ? process.env.NEXT_APP_API_BASE_URL.replace(/\/api\/?$/, "")
      : "");

  if (!base) return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${base}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}
