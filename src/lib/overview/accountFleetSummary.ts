import type { AccountSummary } from "@/types/account";
import type { AccountLookupItem } from "@/types/adminAccountLookup";
import { getAccountPagePath } from "@/lib/account-health/accountRoutes";

export const ACCOUNT_SIGNUP_WINDOW_DAYS = 7;
export const ACCOUNT_SIGNUP_LIST_LIMIT = 5;

const SPORT_LABELS = ["Cricket", "AFL", "Netball"] as const;

export type AccountFleetSportRow = {
  label: (typeof SPORT_LABELS)[number];
  value: string;
  valueTone: string;
};

export type AccountFleetTypeCard = {
  id: "associations" | "clubs";
  title: "Associations" | "Clubs";
  total: number;
  fleetShareLabel: string;
  sportRows: AccountFleetSportRow[];
  href: string;
  actionLabel: string;
};

export type AccountSignupActivityItem = {
  id: number;
  label: string;
  meta: string;
  href: string;
  tone: string;
  accountType: "Association" | "Club" | null;
};

export type AccountSignupSummary = {
  total: number;
  windowDays: number;
  associationCount: number;
  clubCount: number;
  items: AccountSignupActivityItem[];
};

export type AccountFleetOverviewModel = {
  totalAccounts: number;
  cards: AccountFleetTypeCard[];
  signups: AccountSignupSummary;
};

type SportCounts = {
  Cricket?: number;
  AFL?: number;
  Netball?: number;
};

type LongevityRow = AccountSummary["Totals"]["longevityAndRetention"][number];

export function formatSportMixBreakdown(counts: SportCounts | undefined): string {
  return `${counts?.Cricket ?? 0} Cricket · ${counts?.AFL ?? 0} AFL · ${counts?.Netball ?? 0} Netball`;
}

export function buildAccountFleetSportRows(
  counts: SportCounts | undefined
): AccountFleetSportRow[] {
  const sportTones: Record<(typeof SPORT_LABELS)[number], string> = {
    Cricket: "text-emerald-700",
    AFL: "text-amber-700",
    Netball: "text-sky-700",
  };

  return SPORT_LABELS.map((label) => ({
    label,
    value: (counts?.[label] ?? 0).toLocaleString(),
    valueTone: sportTones[label],
  }));
}

export function formatSignupRelativeAge(
  createdAt: string,
  nowMs = Date.now()
): string {
  const createdMs = Date.parse(createdAt);
  if (!Number.isFinite(createdMs)) {
    return "Signup date unknown";
  }

  const diffMs = Math.max(0, nowMs - createdMs);
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.floor(diffMs / dayMs);

  if (days <= 0) {
    return "Signed up today";
  }
  if (days === 1) {
    return "Signed up yesterday";
  }
  return `Signed up ${days} days ago`;
}

export function buildAccountLookupMap(
  accounts: AccountLookupItem[]
): Map<number, AccountLookupItem> {
  return new Map(accounts.map((account) => [account.id, account]));
}

function resolveSignupAccountHref(
  accountId: number,
  accountType: string | null | undefined
): string {
  if (accountType === "Club") {
    return getAccountPagePath(accountId, "club");
  }
  if (accountType === "Association") {
    return getAccountPagePath(accountId, "association");
  }
  return "/dashboard/accounts";
}

function resolveSignupLabel(
  row: LongevityRow,
  lookup: AccountLookupItem | undefined
): string {
  if (lookup?.FirstName?.trim()) {
    return lookup.FirstName.trim();
  }
  if (row.deliveryAddress?.trim()) {
    return row.deliveryAddress.trim();
  }
  return `Account #${row.id}`;
}

function resolveSignupMeta(
  row: LongevityRow,
  lookup: AccountLookupItem | undefined,
  nowMs: number
): string {
  const parts = [
    lookup?.account_type ?? null,
    lookup?.Sport ?? null,
    formatSignupRelativeAge(row.createdAt, nowMs),
  ].filter(Boolean);

  return parts.join(" · ");
}

export function getRecentAccountSignupItems(
  longevity: AccountSummary["Totals"]["longevityAndRetention"] | undefined,
  lookupById: Map<number, AccountLookupItem> = new Map(),
  options?: {
    windowDays?: number;
    limit?: number;
    nowMs?: number;
  }
): AccountSignupActivityItem[] {
  if (!longevity?.length) {
    return [];
  }

  const windowDays = options?.windowDays ?? ACCOUNT_SIGNUP_WINDOW_DAYS;
  const limit = options?.limit ?? ACCOUNT_SIGNUP_LIST_LIMIT;
  const nowMs = options?.nowMs ?? Date.now();
  const cutoffMs = nowMs - windowDays * 24 * 60 * 60 * 1000;

  return longevity
    .filter((row) => {
      const createdMs = Date.parse(row.createdAt);
      return Number.isFinite(createdMs) && createdMs >= cutoffMs;
    })
    .sort(
      (left, right) =>
        Date.parse(right.createdAt) - Date.parse(left.createdAt)
    )
    .slice(0, limit)
    .map((row) => {
      const lookup = lookupById.get(row.id);
      const accountType =
        lookup?.account_type === "Club" || lookup?.account_type === "Association"
          ? lookup.account_type
          : null;

      return {
        id: row.id,
        label: resolveSignupLabel(row, lookup),
        meta: resolveSignupMeta(row, lookup, nowMs),
        href: resolveSignupAccountHref(row.id, lookup?.account_type),
        tone:
          accountType === "Association"
            ? "bg-violet-50 text-violet-700"
            : accountType === "Club"
              ? "bg-blue-50 text-blue-700"
              : "bg-emerald-50 text-emerald-700",
        accountType,
      };
    });
}

export function buildAccountSignupSummary(
  longevity: AccountSummary["Totals"]["longevityAndRetention"] | undefined,
  lookupById: Map<number, AccountLookupItem> = new Map(),
  options?: { windowDays?: number; limit?: number; nowMs?: number }
): AccountSignupSummary {
  const windowDays = options?.windowDays ?? ACCOUNT_SIGNUP_WINDOW_DAYS;
  const nowMs = options?.nowMs ?? Date.now();
  const items = getRecentAccountSignupItems(longevity, lookupById, {
    ...options,
    windowDays,
    nowMs,
  });

  const allRecent = getRecentAccountSignupItems(longevity, lookupById, {
    windowDays,
    nowMs,
    limit: Number.MAX_SAFE_INTEGER,
  });

  const associationCount = allRecent.filter(
    (item) => item.accountType === "Association"
  ).length;
  const clubCount = allRecent.filter(
    (item) => item.accountType === "Club"
  ).length;

  return {
    total: allRecent.length,
    windowDays,
    associationCount,
    clubCount,
    items,
  };
}

export function countRecentAccountSignups(
  longevity: AccountSummary["Totals"]["longevityAndRetention"] | undefined,
  windowDays = ACCOUNT_SIGNUP_WINDOW_DAYS,
  nowMs = Date.now()
): number {
  return buildAccountSignupSummary(longevity, new Map(), {
    windowDays,
    nowMs,
  }).total;
}

export function buildAccountFleetOverview(
  summary: AccountSummary["Totals"] | undefined,
  options?: {
    windowDays?: number;
    nowMs?: number;
    lookupById?: Map<number, AccountLookupItem>;
    signupListLimit?: number;
  }
): AccountFleetOverviewModel | null {
  if (!summary) {
    return null;
  }

  const windowDays = options?.windowDays ?? ACCOUNT_SIGNUP_WINDOW_DAYS;
  const nowMs = options?.nowMs ?? Date.now();
  const lookupById = options?.lookupById ?? new Map();

  const associations = summary.accountTypesCount?.Association ?? 0;
  const clubs = summary.accountTypesCount?.Club ?? 0;
  const totalAccounts = summary.count || associations + clubs;
  const associationShare =
    totalAccounts > 0 ? Math.round((associations / totalAccounts) * 100) : 0;
  const clubShare =
    totalAccounts > 0 ? Math.round((clubs / totalAccounts) * 100) : 0;

  return {
    totalAccounts,
    signups: buildAccountSignupSummary(summary.longevityAndRetention, lookupById, {
      windowDays,
      nowMs,
      limit: options?.signupListLimit ?? ACCOUNT_SIGNUP_LIST_LIMIT,
    }),
    cards: [
      {
        id: "associations",
        title: "Associations",
        total: associations,
        fleetShareLabel: `${associationShare}% of fleet`,
        sportRows: buildAccountFleetSportRows(
          summary.sportsPerAccountTypeCount?.Association
        ),
        href: "/dashboard/accounts/association",
        actionLabel: "View associations",
      },
      {
        id: "clubs",
        title: "Clubs",
        total: clubs,
        fleetShareLabel: `${clubShare}% of fleet`,
        sportRows: buildAccountFleetSportRows(
          summary.sportsPerAccountTypeCount?.Club
        ),
        href: "/dashboard/accounts/club",
        actionLabel: "View clubs",
      },
    ],
  };
}

/** @deprecated Use buildAccountFleetOverview */
export function buildAccountFleetComparison(
  summary: AccountSummary["Totals"] | undefined,
  options?: { windowDays?: number; nowMs?: number }
) {
  const model = buildAccountFleetOverview(summary, options);
  if (!model) {
    return null;
  }

  return {
    totalAccounts: model.totalAccounts,
    rows: model.cards.map((card) => ({
      id: card.id,
      label: card.title,
      value: card.total.toLocaleString(),
      detail: `${formatSportMixBreakdown(
        card.id === "associations"
          ? summary?.sportsPerAccountTypeCount?.Association
          : summary?.sportsPerAccountTypeCount?.Club
      )} · ${card.fleetShareLabel}`,
      valueTone:
        card.id === "associations" ? "text-violet-700" : "text-blue-700",
      href: card.href,
      actionLabel: card.actionLabel,
    })),
  };
}

/** @deprecated Use buildAccountFleetOverview */
export function buildAccountFleetOverviewCards(
  summary: AccountSummary["Totals"] | undefined
) {
  const model = buildAccountFleetOverview(summary);
  if (!model) {
    return null;
  }

  return model.cards.map((card) => ({
    title: card.title,
    value: card.total.toLocaleString(),
    detail: formatSportMixBreakdown(
      card.id === "associations"
        ? summary?.sportsPerAccountTypeCount?.Association
        : summary?.sportsPerAccountTypeCount?.Club
    ),
    badge: card.fleetShareLabel,
    progress: card.fleetShareLabel.replace("% of fleet", "%"),
    href: card.href,
    actionLabel: card.actionLabel,
  }));
}
