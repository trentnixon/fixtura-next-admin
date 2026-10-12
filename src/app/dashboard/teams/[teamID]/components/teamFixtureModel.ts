import { parseISO } from "date-fns";

export type TeamFixtureGroup = "scheduled" | "complete";

export type TeamFixtureSide = "Home" | "Away" | "Unmatched";

const EMPTY = "—";

const COMPLETE_STATUSES = new Set([
  "final",
  "abandoned",
  "finished",
  "completed",
]);

export type TeamFixtureIdentity = {
  status?: string | null;
  isFinished?: boolean | null;
  teamHome?: string | null;
  teamAway?: string | null;
  Homescores?: string | null;
  Awayscores?: string | null;
  ResultStatement?: string | null;
  finalDaysPlay?: string | null;
  dayOne?: string | null;
  date?: string | null;
};

export function classifyTeamFixture(
  game: TeamFixtureIdentity,
): TeamFixtureGroup {
  const status = game.status?.trim().toLowerCase() ?? "";
  if (COMPLETE_STATUSES.has(status) || game.isFinished === true) {
    return "complete";
  }
  return "scheduled";
}

export function teamFixtureOpponent(
  game: TeamFixtureIdentity,
  teamName: string,
): { side: TeamFixtureSide; opponent: string } {
  const home = game.teamHome?.trim() ?? "";
  const away = game.teamAway?.trim() ?? "";
  const name = normalizeName(teamName);

  if (name && normalizeName(home) === name) {
    return { side: "Home", opponent: away || EMPTY };
  }
  if (name && normalizeName(away) === name) {
    return { side: "Away", opponent: home || EMPTY };
  }

  const both = [home, away].filter((value) => value.length > 0).join(" vs ");
  return { side: "Unmatched", opponent: both || EMPTY };
}

export function teamFixtureScore(game: TeamFixtureIdentity): string | null {
  const statement = game.ResultStatement?.trim();
  if (statement) return statement;

  const home = game.Homescores?.trim() ?? "";
  const away = game.Awayscores?.trim() ?? "";
  if (!home && !away) return null;
  return `${home || EMPTY} - ${away || EMPTY}`;
}

export function teamFixtureSortTime(game: TeamFixtureIdentity): number {
  const candidates = [game.finalDaysPlay, game.dayOne, game.date];
  for (const value of candidates) {
    const time = parseStoredTime(value);
    if (time !== null) return time;
  }
  return 0;
}

export function formatStoredDate(value: string | null | undefined): string {
  const text = value?.trim();
  if (!text) return EMPTY;
  const parsed = parseISO(text);
  if (Number.isNaN(parsed.getTime())) return text;

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeZone: "Australia/Sydney",
  }).format(parsed);
}

export function formatSyncedAgo(days: number | null): string {
  if (days === null) return "Unknown";
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function playHqUrl(href: string | null | undefined): string | null {
  const value = href?.trim();
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const path = value.startsWith("/") ? value : `/${value}`;
  return `https://www.playhq.com${path}`;
}

export function externalUrl(value: string | null | undefined): string | null {
  const text = value?.trim();
  if (!text) return null;
  if (text.startsWith("http://") || text.startsWith("https://")) return text;
  return `https://${text}`;
}

function normalizeName(value: string | null | undefined): string {
  return value?.trim().toLowerCase().replace(/\s+/g, " ") ?? "";
}

function parseStoredTime(value: string | null | undefined): number | null {
  const text = value?.trim();
  if (!text) return null;
  const iso = parseISO(text);
  if (!Number.isNaN(iso.getTime())) return iso.getTime();
  const fallback = new Date(text);
  if (!Number.isNaN(fallback.getTime())) return fallback.getTime();
  return null;
}
