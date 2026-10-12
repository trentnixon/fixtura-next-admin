import type { NotificationIssueRow } from "@/types/notificationIssues";

export interface ContextFilterRow {
  key: string;
  count: number;
}

/** Count distinct values shown on issue cards (same field the card subtitle uses). */
export function countCardContextValues(
  issues: NotificationIssueRow[],
  getKey: (row: NotificationIssueRow) => string | null | undefined,
  limit = 12,
): ContextFilterRow[] {
  const counts = new Map<string, number>();
  for (const row of issues) {
    const key = getKey(row)?.trim();
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
