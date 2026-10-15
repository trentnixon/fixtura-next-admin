import { describe, expect, it } from "vitest";
import { scorecardHasPlayer } from "@/lib/readiness/scorecardHasPlayer";

describe("scorecardHasPlayer", () => {
  it("counts a batter name in a PlayHQ innings row", () => {
    expect(
      scorecardHasPlayer({
        innings1: {
          battingRows: [["Ashton Gumm", "c: Luke Harper b: Rowan Lutter", "45"]],
          bowlingRows: [["Charlie Lachmund", "11", "5", "16", "1"]],
        },
      }),
    ).toBe(true);
  });

  it("counts a legacy scorecard player name", () => {
    expect(
      scorecardHasPlayer({
        home: { batting: [{ name: "Riverside" }], bowling: [] },
      }),
    ).toBe(true);
  });

  it("ignores an innings with no named rows", () => {
    expect(
      scorecardHasPlayer({
        innings1: {
          battingRows: [["-", "did not bat"]],
          bowlingRows: [],
        },
      }),
    ).toBe(false);
  });

  it("is false when scorecards are missing", () => {
    expect(scorecardHasPlayer(null)).toBe(false);
  });
});
