/**
 * Scope as the primary page heading (sentence case, human-readable).
 * e.g. association_to_competition → "Association to competition"
 */
export function formatScopePageHeading(scope: string | null | undefined): string {
  if (!scope?.trim()) return "Scraper job";
  const s = scope.replace(/_/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
