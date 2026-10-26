import { describe, expect, it } from "vitest";
import {
  assetTypeRefFromDownload,
  groupByAssetType,
} from "@/lib/downloads/groupDownloadsByAssetType";

describe("groupByAssetType", () => {
  it("groups ladder and upcoming together across video and image", () => {
    const rows = [
      {
        id: 1,
        compositionId: "CricketLadder",
        assetName: "Ladder Video",
        output: "VIDEO",
      },
      {
        id: 2,
        compositionId: "CricketUpcoming",
        assetName: "Upcoming Image",
        output: "IMAGE",
      },
      {
        id: 3,
        compositionId: "CricketLadder",
        assetName: "Ladder Image",
        output: "IMAGE",
      },
    ];
    const groups = groupByAssetType(rows, (item) =>
      assetTypeRefFromDownload(item),
    );

    expect(groups.map((group) => group.label)).toEqual(["Ladder", "Upcoming"]);
    expect(groups[0]?.items.map((item) => item.id)).toEqual([1, 3]);
  });

  it("puts a row with no asset type or asset name in Unknown", () => {
    const groups = groupByAssetType(
      [{ id: 1, identifier: "  ", name: null }],
      (item) => item,
    );

    expect(groups).toEqual([
      { key: "UNKNOWN", label: "Unknown", items: [{ id: 1, identifier: "  ", name: null }] },
    ]);
  });
});
