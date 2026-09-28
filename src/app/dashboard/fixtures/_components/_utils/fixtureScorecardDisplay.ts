import type { TeamScorecardData } from "@/types/fixtureDetail";

/** PlayHQ ingest shape stored under matchDetails.scorecards (e.g. innings1, innings2). */
export type InningsRowScorecard = {
  battingRows?: string[][] | null;
  bowlingRows?: string[][] | null;
  Battingheaders?: string[] | null;
  Bowlingheaders?: string[] | null;
  BattinginningsName?: string | null;
  BowlinginningsName?: string | null;
  fieldersData?: {
    headers?: string[] | null;
    fieldersData?: string[][] | null;
  } | null;
  FOW?: unknown;
};

export type FallOfWicketsBlock =
  | { kind: "table"; headers: string[]; rows: string[][] }
  | { kind: "chips"; items: string[] };

export type ScorecardTableBlock = {
  key: string;
  title: string;
  bowlingTitle: string | null;
  batting: { headers: string[]; rows: string[][] } | null;
  bowling: { headers: string[]; rows: string[][] } | null;
  fielders: { headers: string[]; rows: string[][] } | null;
  fallOfWickets: FallOfWicketsBlock | null;
};

const DEFAULT_FOW_HEADERS = ["Wkt", "Score", "Batter"];

export function parseFallOfWickets(fow: unknown): FallOfWicketsBlock | null {
  if (fow == null) return null;
  if (!Array.isArray(fow) || fow.length === 0) return null;

  const first = fow[0];

  if (typeof first === "string") {
    const items = fow
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter(Boolean);
    return items.length > 0 ? { kind: "chips", items } : null;
  }

  if (Array.isArray(first)) {
    const rows = fow as string[][];

    const firstRow = rows[0] ?? [];
    const firstCell = String(firstRow[0] ?? "");
    const useFirstRowAsHeaders = /wkt|wicket|score|batter|player/i.test(
      firstCell,
    );

    if (useFirstRowAsHeaders) {
      return {
        kind: "table",
        headers: firstRow.map((cell) => String(cell)),
        rows: rows.slice(1),
      };
    }

    const colCount = Math.max(...rows.map((row) => row.length), 0);
    const headers = DEFAULT_FOW_HEADERS.slice(
      0,
      Math.min(colCount, DEFAULT_FOW_HEADERS.length),
    );

    return { kind: "table", headers, rows };
  }

  if (typeof first === "object" && first !== null) {
    const rows = (fow as Record<string, unknown>[]).map((entry) => [
      String(
        entry.wicketNumber ??
          entry.wicket ??
          entry.number ??
          entry.Wkt ??
          "",
      ),
      String(entry.score ?? entry.Score ?? ""),
      String(
        entry.batsman ?? entry.player ?? entry.Batter ?? entry.name ?? "",
      ),
    ]);

    return { kind: "table", headers: DEFAULT_FOW_HEADERS, rows };
  }

  return null;
}

function isInningsRowScorecard(value: unknown): value is InningsRowScorecard {
  if (!value || typeof value !== "object") return false;
  const v = value as InningsRowScorecard;
  return (
    (Array.isArray(v.battingRows) && v.battingRows.length > 0) ||
    (Array.isArray(v.bowlingRows) && v.bowlingRows.length > 0)
  );
}

function defaultBattingHeaders(): string[] {
  return ["Batters", "How Out", "R", "B", "4S", "6S", "SR"];
}

function defaultBowlingHeaders(): string[] {
  return ["Bowlers", "O", "M", "R", "W", "E", "WD", "NB"];
}

export function parseInningsScorecards(
  scorecards: Record<string, unknown> | null | undefined,
): ScorecardTableBlock[] {
  if (!scorecards) return [];

  const blocks: ScorecardTableBlock[] = [];

  for (const [key, raw] of Object.entries(scorecards)) {
    if (!isInningsRowScorecard(raw)) continue;

    const battingHeaders =
      raw.Battingheaders?.filter(Boolean) ?? defaultBattingHeaders();
    const bowlingHeaders =
      raw.Bowlingheaders?.filter(Boolean) ?? defaultBowlingHeaders();

    const title =
      raw.BattinginningsName ||
      raw.BowlinginningsName ||
      key.replace(/([a-z])(\d)/i, "$1 $2");

    const fieldersHeaders = raw.fieldersData?.headers?.filter(Boolean) ?? [];
    const fieldersRows = raw.fieldersData?.fieldersData ?? [];

    const bowlingTitle = raw.BowlinginningsName?.trim() || null;

    blocks.push({
      key,
      title,
      bowlingTitle,
      batting:
        raw.battingRows && raw.battingRows.length > 0
          ? { headers: battingHeaders, rows: raw.battingRows }
          : null,
      bowling:
        raw.bowlingRows && raw.bowlingRows.length > 0
          ? { headers: bowlingHeaders, rows: raw.bowlingRows }
          : null,
      fielders:
        fieldersRows.length > 0 && fieldersHeaders.length > 0
          ? { headers: fieldersHeaders, rows: fieldersRows }
          : null,
      fallOfWickets: parseFallOfWickets(raw.FOW),
    });
  }

  return blocks.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
}

/** Tab label for PlayHQ keys such as `innings1`, `innings2`. */
export function inningsLabelFromKey(key: string): string {
  const match = /innings\s*(\d+)/i.exec(key) ?? /(\d+)$/.exec(key);
  if (match?.[1]) return `Innings ${match[1]}`;
  return key;
}

export function isPlayHqBattingShape(headers: string[]): boolean {
  const normalized = headers.map((h) => h.trim().toLowerCase());
  return (
    normalized.includes("batters") && normalized.includes("how out")
  );
}

export function hasLegacyTeamScorecard(
  teamData: TeamScorecardData,
): boolean {
  return (
    (Array.isArray(teamData.batting) && teamData.batting.length > 0) ||
    (Array.isArray(teamData.bowling) && teamData.bowling.length > 0)
  );
}

export function hasRenderableDetailedScorecard(
  scorecards: Record<string, unknown> | null | undefined,
): boolean {
  if (!scorecards) return false;
  if (parseInningsScorecards(scorecards).length > 0) return true;
  return Object.values(scorecards).some(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      hasLegacyTeamScorecard(entry as TeamScorecardData),
  );
}

export function hasTeamRosterData(
  teamRoster: Record<string, TeamScorecardData> | null | undefined,
): boolean {
  if (!teamRoster) return false;
  return Object.values(teamRoster).some((entry) =>
    hasLegacyTeamScorecard(entry),
  );
}
