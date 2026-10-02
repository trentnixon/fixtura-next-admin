import { describe, expect, it } from "vitest";
import { fixtureSplits } from "./fixtureSplits";

describe("fixtureSplits", () => {
  it("reads a count for each fixture group", () => {
    expect(fixtureSplits({ CricketResults: 4, CricketLadder: 6 })).toEqual([
      { label: "Cricket results", count: 4 },
      { label: "Cricket ladder", count: 6 },
    ]);
    expect(fixtureSplits(null)).toEqual([]);
    expect(fixtureSplits({ CricketResults: { max: 4 } })).toBeNull();
  });
});
