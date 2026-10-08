import { CompetitionAssociationCompetition } from "@/types/competitionAssociationDrilldown";
import { CompetitionClubCompetition } from "@/types/competitionClubDrilldown";

export type AccountDrilldownCompetition =
  | CompetitionAssociationCompetition
  | CompetitionClubCompetition;

export type AccountGradeRow = {
  key: string;
  grade: AccountDrilldownCompetition["grades"][number];
  competition: {
    id: number;
    name: string;
    season: string | null;
    isActive: boolean;
  };
};

export function toGradeRows(
  competitions: AccountDrilldownCompetition[],
): AccountGradeRow[] {
  const rows: AccountGradeRow[] = [];

  for (const competition of competitions) {
    for (const grade of competition.grades) {
      rows.push({
        key: `${competition.id}-${grade.id}`,
        grade,
        competition: {
          id: competition.id,
          name: competition.name,
          season: competition.season,
          isActive: competition.isActive,
        },
      });
    }
  }

  rows.sort((left, right) => {
    if (left.competition.isActive !== right.competition.isActive) {
      return left.competition.isActive ? -1 : 1;
    }

    const competitionCompare = left.competition.name.localeCompare(
      right.competition.name,
      "en-AU",
    );
    if (competitionCompare !== 0) {
      return competitionCompare;
    }

    return left.grade.name.localeCompare(right.grade.name, "en-AU");
  });

  return rows;
}

export type AccountGradeGroup = {
  competition: AccountGradeRow["competition"];
  rows: AccountGradeRow[];
};

export type GradeStatusFilter = "all" | "active" | "inactive";

export type AccountGradeFilters = {
  search: string;
  competitionId: string;
  status: GradeStatusFilter;
};

export const emptyGradeFilters: AccountGradeFilters = {
  search: "",
  competitionId: "all",
  status: "all",
};

export function isGradeStatusFilter(value: string): value is GradeStatusFilter {
  return value === "all" || value === "active" || value === "inactive";
}

export function hasActiveGradeFilters(filters: AccountGradeFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.competitionId !== "all" ||
    filters.status !== "all"
  );
}

export type GradeFilterChoices = {
  competitions: Array<{ id: string; name: string; count: number }>;
};

export function gradeFilterChoices(rows: AccountGradeRow[]): GradeFilterChoices {
  const competitions: GradeFilterChoices["competitions"] = [];

  for (const row of rows) {
    const id = String(row.competition.id);
    const existing = competitions.find((competition) => competition.id === id);
    if (existing) {
      existing.count += 1;
      continue;
    }

    competitions.push({
      id,
      name: row.competition.name,
      count: 1,
    });
  }

  return { competitions };
}

export function filterGradeRows(
  rows: AccountGradeRow[],
  filters: AccountGradeFilters,
): AccountGradeRow[] {
  const query = filters.search.trim().toLowerCase();

  return rows.filter((row) => {
    if (
      filters.competitionId !== "all" &&
      String(row.competition.id) !== filters.competitionId
    ) {
      return false;
    }

    if (filters.status === "active" && !row.competition.isActive) {
      return false;
    }

    if (filters.status === "inactive" && row.competition.isActive) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      row.grade.name,
      row.grade.gradeCode,
      row.competition.name,
      row.competition.season,
    ]
      .filter((part): part is string => Boolean(part))
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function groupGradeRows(rows: AccountGradeRow[]): AccountGradeGroup[] {
  const groups: AccountGradeGroup[] = [];

  for (const row of rows) {
    const current = groups[groups.length - 1];
    if (current && current.competition.id === row.competition.id) {
      current.rows.push(row);
      continue;
    }

    groups.push({
      competition: row.competition,
      rows: [row],
    });
  }

  return groups;
}
