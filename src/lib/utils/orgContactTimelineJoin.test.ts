import { describe, expect, it } from "vitest";
import {
  scrapeSlugToInsightsSport,
  insightsSportSupportedForTimeline,
} from "./scrapeSlugToInsightsSport";
import {
  buildClubTimelineIndex,
  clubContactMatchesTimelineFilter,
  priorityBandFromNormalizedWeight,
} from "./orgContactTimelineJoin";
import type { ClubInsight } from "@/types/clubInsights";

describe("scrapeSlugToInsightsSport", () => {
  it("maps known slugs to insights sport labels", () => {
    expect(scrapeSlugToInsightsSport("cricket-australia")).toBe("Cricket");
    expect(scrapeSlugToInsightsSport("afl")).toBe("AFL");
  });

  it("flags unsupported slugs for timeline", () => {
    expect(insightsSportSupportedForTimeline("football")).toBe(false);
    expect(insightsSportSupportedForTimeline("cricket-australia")).toBe(true);
  });
});

describe("clubContactMatchesTimelineFilter", () => {
  const club: ClubInsight = {
    id: 42,
    name: "Test",
    sport: "Cricket",
    competitionCount: 10,
    teamCount: 50,
    associationCount: 1,
    associationNames: [],
    hasAccount: true,
    competitionDateRange: {
      earliestStartDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      latestEndDate: new Date(Date.now() + 120 * 86400000).toISOString(),
      totalCompetitions: 2,
      competitionsWithValidDates: 2,
    },
  } as ClubInsight;

  it("passes all rows when filter is none", () => {
    const index = buildClubTimelineIndex([club]);
    expect(clubContactMatchesTimelineFilter(42, "none", index)).toBe(true);
    expect(clubContactMatchesTimelineFilter(999, "none", index)).toBe(true);
  });

  it("matches starting-soon for near-term season start", () => {
    const index = buildClubTimelineIndex([club]);
    expect(clubContactMatchesTimelineFilter(42, "starting-soon", index)).toBe(
      true,
    );
  });
});

describe("priorityBandFromNormalizedWeight", () => {
  it("maps gantt weight bands", () => {
    expect(priorityBandFromNormalizedWeight(80)).toBe("High");
    expect(priorityBandFromNormalizedWeight(0)).toBe("—");
  });
});
