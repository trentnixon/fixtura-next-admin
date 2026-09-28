import {
  parseFallOfWickets,
  parseInningsScorecards,
  hasRenderableDetailedScorecard,
} from "@/app/dashboard/fixtures/_components/_utils/fixtureScorecardDisplay";

describe("parseInningsScorecards", () => {
  it("parses PlayHQ innings row scorecards", () => {
    const scorecards = {
      innings1: {
        battingRows: [["Player A", "not out", "10", "5", "1", "0", "200"]],
        bowlingRows: [["Bowler", "4", "0", "20", "1", "5", "0", "0"]],
        Battingheaders: ["Batters", "How Out", "R", "B", "4S", "6S", "SR"],
        Bowlingheaders: ["Bowlers", "O", "M", "R", "W", "E", "WD", "NB"],
        BattinginningsName: "Team A Batting",
      },
    };

    const blocks = parseInningsScorecards(scorecards);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].title).toBe("Team A Batting");
    expect(blocks[0].batting?.rows).toHaveLength(1);
    expect(blocks[0].bowling?.rows).toHaveLength(1);
    expect(hasRenderableDetailedScorecard(scorecards)).toBe(true);
  });

  it("parses fall of wickets and bowling innings title", () => {
    const scorecards = {
      innings1: {
        battingRows: [["A", "b: B", "1", "1", "0", "0", "100"]],
        Battingheaders: ["Batters", "How Out", "R", "B", "4S", "6S", "SR"],
        BowlinginningsName: "Team B Bowling",
        FOW: ["1-12 A", "2-45 C"],
      },
    };

    const blocks = parseInningsScorecards(scorecards);
    expect(blocks[0].bowlingTitle).toBe("Team B Bowling");
    expect(blocks[0].fallOfWickets).toEqual({
      kind: "chips",
      items: ["1-12 A", "2-45 C"],
    });
    expect(parseFallOfWickets(null)).toBeNull();
  });
});
