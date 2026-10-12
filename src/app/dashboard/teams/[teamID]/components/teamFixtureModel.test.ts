import { describe, expect, it } from "vitest";

import {
  classifyTeamFixture,
  formatStoredDate,
  playHqUrl,
  teamFixtureOpponent,
  teamFixtureScore,
} from "./teamFixtureModel";

describe("classifyTeamFixture", () => {
  it("keeps an unfinished scheduled game on scheduled", () => {
    expect(
      classifyTeamFixture({ status: "Upcoming", isFinished: false }),
    ).toBe("scheduled");
  });

  it("treats a finished flag as complete even when status still says upcoming", () => {
    expect(
      classifyTeamFixture({ status: "Upcoming", isFinished: true }),
    ).toBe("complete");
  });

  it("treats final and abandoned statuses as complete", () => {
    expect(classifyTeamFixture({ status: "Final", isFinished: false })).toBe(
      "complete",
    );
    expect(
      classifyTeamFixture({ status: "Abandoned", isFinished: false }),
    ).toBe("complete");
  });
});

describe("teamFixtureOpponent", () => {
  it("uses the away side when this team is home", () => {
    expect(
      teamFixtureOpponent(
        { teamHome: "Norths", teamAway: "Souths" },
        "norths",
      ),
    ).toEqual({ side: "Home", opponent: "Souths" });
  });

  it("uses the home side when this team is away", () => {
    expect(
      teamFixtureOpponent(
        { teamHome: "Norths", teamAway: "Souths" },
        "Souths",
      ),
    ).toEqual({ side: "Away", opponent: "Norths" });
  });

  it("shows both names when neither side matches the team", () => {
    expect(
      teamFixtureOpponent(
        { teamHome: "Norths", teamAway: "Souths" },
        "Easts",
      ),
    ).toEqual({ side: "Unmatched", opponent: "Norths vs Souths" });
  });
});

describe("teamFixtureScore", () => {
  it("prefers the result statement", () => {
    expect(
      teamFixtureScore({
        ResultStatement: "Norths won by 4 wickets",
        Homescores: "120",
        Awayscores: "118",
      }),
    ).toBe("Norths won by 4 wickets");
  });

  it("joins innings scores when there is no statement", () => {
    expect(teamFixtureScore({ Homescores: "120", Awayscores: "98" })).toBe(
      "120 - 98",
    );
  });

  it("returns null when no score is stored", () => {
    expect(teamFixtureScore({})).toBeNull();
  });
});

describe("playHqUrl", () => {
  it("builds a PlayHQ url from a path", () => {
    expect(playHqUrl("/org/team/abc")).toBe(
      "https://www.playhq.com/org/team/abc",
    );
  });

  it("keeps an absolute url", () => {
    expect(playHqUrl("https://www.playhq.com/org/team/abc")).toBe(
      "https://www.playhq.com/org/team/abc",
    );
  });

  it("returns null when the href is missing", () => {
    expect(playHqUrl("")).toBeNull();
    expect(playHqUrl(null)).toBeNull();
  });
});

describe("formatStoredDate", () => {
  it("formats an ISO timestamp in Australia/Sydney", () => {
    expect(formatStoredDate("2026-10-09T00:30:00.000Z")).toBe("9 Oct 2026");
  });

  it("leaves a non-ISO label as stored", () => {
    expect(formatStoredDate("Sat 11 Oct")).toBe("Sat 11 Oct");
  });
});
