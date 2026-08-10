import type { AccountHealthScope } from "@/types/accountHealth";

export const ACCOUNT_HEALTH_SCOPE_LABELS: Record<AccountHealthScope, string> = {
  "scrape:association-single": "Association overview",
  "scrape:club-single": "Club overview",
  "scrape:grades-batch": "Grades",
  "internal:club-to-association-sync": "Club to association link sync",
  "internal:association-to-club-sync": "Association to club link sync",
  "scrape:grades-lookup-teams-batch": "Team lookup",
  "scrape:fixture-discovery-batch": "Fixture discovery",
};

export function getAccountHealthScopeLabel(scope: string): string {
  return (
    ACCOUNT_HEALTH_SCOPE_LABELS[scope as AccountHealthScope] ?? scope
  );
}
