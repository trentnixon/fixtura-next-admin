/**
 * Returns true when `src` is a value next/image can load without throwing.
 * Relative paths must start with "/"; otherwise must be http(s).
 */
export function isUsableImageSrc(
  src: string | null | undefined,
): src is string {
  if (!src?.trim()) return false;

  const trimmed = src.trim();
  if (trimmed.startsWith("/")) return true;

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
