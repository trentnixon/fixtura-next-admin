/**
 * Converts a string to title case, replacing underscores with spaces
 * @param value - String to convert (e.g., "hello_world")
 * @returns Title case string (e.g., "Hello World") or "—" if value is null/empty
 */
export function toTitleCase(value: string | null): string {
  if (!value) return "—";
  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

