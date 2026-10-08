import { CompetitionAssociationCompetition } from "@/types/competitionAssociationDrilldown";
import {
  emptyGradeFilters,
  filterGradeRows,
  groupGradeRows,
  toGradeRows,
} from "./accountGradeRows";

function competition(
  overrides: Partial<CompetitionAssociationCompetition> &
    Pick<CompetitionAssociationCompetition, "id" | "name" | "isActive">,
): CompetitionAssociationCompetition {
  return {
    season: null,
    status: overrides.isActive ? "active" : "inactive",
    timeframe: { start: null, end: null },
    counts: { gradeCount: 0, teamCount: 0, clubCount: 0 },
    grades: [],
    clubs: [],
    ...overrides,
  };
}

function grade(
  id: number,
  name: string,
  overrides: Partial<CompetitionAssociationCompetition["grades"][number]> = {},
): CompetitionAssociationCompetition["grades"][number] {
  return {
    id,
    name,
    gender: null,
    ageGroup: null,
    gradeCode: null,
    teamCount: 0,
    teamsWithFixturaAccount: 0,
    teamsWithoutFixturaAccount: 0,
    accountCoveragePercent: 0,
    clubsRepresented: 0,
    teams: [],
    ...overrides,
  };
}

describe("toGradeRows", () => {
  it("flattens grades under their competition and sorts active competitions first", () => {
    const rows = toGradeRows([
      competition({
        id: 2,
        name: "Winter",
        isActive: false,
        grades: [grade(20, "Under 16")],
      }),
      competition({
        id: 1,
        name: "Summer",
        isActive: true,
        grades: [grade(12, "B Grade"), grade(11, "A Grade")],
      }),
    ]);

    expect(rows.map((row) => row.key)).toEqual(["1-11", "1-12", "2-20"]);
    expect(rows[0]?.competition.name).toBe("Summer");
    expect(rows[0]?.grade.name).toBe("A Grade");
  });

  it("returns an empty list when competitions have no grades", () => {
    expect(
      toGradeRows([competition({ id: 1, name: "Summer", isActive: true })]),
    ).toEqual([]);
  });
});

describe("groupGradeRows", () => {
  it("keeps each competition's grades together in sort order", () => {
    const groups = groupGradeRows(
      toGradeRows([
        competition({
          id: 2,
          name: "Winter",
          isActive: false,
          grades: [grade(20, "Under 16"), grade(21, "Under 14")],
        }),
        competition({
          id: 1,
          name: "Summer",
          isActive: true,
          grades: [grade(12, "B Grade"), grade(11, "A Grade")],
        }),
      ]),
    );

    expect(groups.map((group) => group.competition.name)).toEqual([
      "Summer",
      "Winter",
    ]);
    expect(groups[0]?.rows.map((row) => row.grade.name)).toEqual([
      "A Grade",
      "B Grade",
    ]);
    expect(groups[1]?.rows.map((row) => row.grade.name)).toEqual([
      "Under 14",
      "Under 16",
    ]);
  });
});

describe("filterGradeRows", () => {
  const rows = toGradeRows([
    competition({
      id: 1,
      name: "Kookaburra Men's Premier",
      season: "Summer 2026/27",
      isActive: true,
      grades: [
        grade(11, "Premier Firsts", {
          gender: "Men",
          ageGroup: "Senior",
          gradeCode: "222b2dae",
        }),
        grade(12, "Premier Under 18s", {
          gender: "Men",
          ageGroup: "U18",
          gradeCode: "a6559792",
        }),
      ],
    }),
    competition({
      id: 2,
      name: "Winter",
      isActive: false,
      grades: [
        grade(20, "Under 16", {
          gender: "Women",
          ageGroup: "U16",
        }),
      ],
    }),
  ]);

  it("matches grade name, grade code, and competition name", () => {
    expect(
      filterGradeRows(rows, { ...emptyGradeFilters, search: "222b2dae" }).map(
        (row) => row.grade.name,
      ),
    ).toEqual(["Premier Firsts"]);
    expect(
      filterGradeRows(rows, { ...emptyGradeFilters, search: "kookaburra" }).map(
        (row) => row.key,
      ),
    ).toEqual(["1-11", "1-12"]);
  });

  it("filters by competition and status", () => {
    expect(
      filterGradeRows(rows, { ...emptyGradeFilters, competitionId: "2" }).map(
        (row) => row.grade.name,
      ),
    ).toEqual(["Under 16"]);
    expect(
      filterGradeRows(rows, { ...emptyGradeFilters, status: "inactive" }).map(
        (row) => row.grade.name,
      ),
    ).toEqual(["Under 16"]);
  });
});
