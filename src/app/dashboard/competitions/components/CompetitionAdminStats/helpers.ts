import {
  CompetitionAdminStatsHighlight,
  CompetitionAdminStatsResponse,
  CompetitionAdminStatsAvailableCompetition,
} from "@/types/competitionAdminStats";

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "—";
  }
  return value.toLocaleString();
}

export function formatDuration(value: number | null): string {
  if (value === null || value === undefined) {
    return "—";
  }
  return `${value} days`;
}

export function formatHighlightValue(
  highlight: CompetitionAdminStatsHighlight
): string {
  if (typeof highlight.value === "number") {
    const value = highlight.value;

    switch (highlight.title) {
      case "Most Teams":
        return `${value.toLocaleString()} teams`;
      case "Most Clubs":
        return `${value.toLocaleString()} clubs`;
      case "Longest Duration":
        return `${value.toLocaleString()} days`;
      case "Active Competitions":
        return `${value.toLocaleString()} competitions`;
      default:
        return value.toLocaleString();
    }
  }

  if (typeof highlight.value === "string") {
    const parsed = new Date(highlight.value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  return highlight.value as string;
}

export function getSeasonsFromSummary(
  data: CompetitionAdminStatsResponse | undefined
): string[] {
  if (!data) {
    return [];
  }

  const seasons = data.summary.breakdowns.bySeason
    .map((item) => item.season)
    .filter((season) => season && season.trim().length > 0);

  return Array.from(new Set(seasons));
}

function formatSummerLabel(year: number, nextYear: number) {
  const short = nextYear.toString().slice(-2);
  return `Summer ${year}/${short}`;
}

export function getAustralianSeasonLabel(date: Date): string {
  const month = date.getMonth(); // 0-based
  const year = date.getFullYear();

  if (month === 11) {
    // December belongs to summer that spans into next year
    return formatSummerLabel(year, year + 1);
  }

  if (month === 0 || month === 1) {
    // January / February belong to the previous year's summer
    return formatSummerLabel(year - 1, year);
  }

  if (month >= 2 && month <= 4) {
    return `Autumn ${year}`;
  }

  if (month >= 5 && month <= 7) {
    return `Winter ${year}`;
  }

  return `Spring ${year}`;
}

export function buildSeasonChartData(
  competitions: CompetitionAdminStatsAvailableCompetition[] | undefined,
  fallback: CompetitionAdminStatsResponse["summary"]["breakdowns"]["bySeason"]
): Array<{ season: string; count: number }> {
  const counts = new Map<string, number>();

  competitions?.forEach((competition) => {
    if (!competition.startDate) {
      return;
    }
    const date = new Date(competition.startDate);
    if (Number.isNaN(date.getTime())) {
      return;
    }
    const label = getAustralianSeasonLabel(date);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  if (counts.size === 0) {
    return fallback.map((item) => ({ season: item.season, count: item.count }));
  }

  return Array.from(counts.entries())
    .map(([season, count]) => ({ season, count }))
    .sort((a, b) => a.season.localeCompare(b.season));
}
