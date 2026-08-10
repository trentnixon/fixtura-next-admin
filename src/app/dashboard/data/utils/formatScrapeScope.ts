/**
 * Human-readable label for scraper log scope values.
 */
export function formatScopeLabel(scope: string | null | undefined): string {
  if (!scope) return "-";
  return scope.replace(/_/g, " ");
}
