import { Asset } from "@/types/asset";
import {
  filterAssetsBySearch,
  groupAssetsByType,
  NO_ASSET_TYPE,
} from "./groupAssetsByType";

function makeAsset(input: {
  id: number;
  name: string;
  compositionId?: string;
  typeName?: string | null;
}): Asset {
  const typeName = input.typeName?.trim();

  return {
    id: input.id,
    attributes: {
      Name: input.name,
      CompositionID: input.compositionId ?? "",
      description: "",
      Metadata: null,
      filter: "",
      ContentType: "Single",
      ArticleFormats: "",
      assetDescription: "",
      SubTitle: "",
      Icon: "",
      Blurb: "",
      Sport: "Cricket",
      createdAt: "",
      updatedAt: "",
      publishedAt: "",
      asset_type: typeName
        ? { data: { id: input.id, attributes: { Name: typeName } } }
        : { data: null },
    },
  };
}

describe("groupAssetsByType", () => {
  it("groups by asset type and sorts types, with missing types last", () => {
    const groups = groupAssetsByType([
      makeAsset({ id: 1, name: "Untyped", typeName: null }),
      makeAsset({ id: 2, name: "Scorecard", typeName: "Scorecard" }),
      makeAsset({ id: 3, name: "Ladder", typeName: "Ladder" }),
      makeAsset({ id: 4, name: "Blank type", typeName: "  " }),
    ]);

    expect(groups.map((group) => group.typeName)).toEqual([
      "Ladder",
      "Scorecard",
      NO_ASSET_TYPE,
    ]);
    expect(groups[2]?.assets.map((asset) => asset.attributes.Name)).toEqual([
      "Blank type",
      "Untyped",
    ]);
  });

  it("sorts assets in a type by composition id", () => {
    const groups = groupAssetsByType([
      makeAsset({
        id: 1,
        name: "B",
        compositionId: "CRI-20",
        typeName: "Ladder",
      }),
      makeAsset({
        id: 2,
        name: "A",
        compositionId: "CRI-02",
        typeName: "Ladder",
      }),
    ]);

    expect(groups[0]?.assets.map((asset) => asset.attributes.CompositionID)).toEqual([
      "CRI-02",
      "CRI-20",
    ]);
  });
});

describe("filterAssetsBySearch", () => {
  const assets = [
    makeAsset({ id: 1, name: "Weekend Ladder", compositionId: "CRI-10" }),
    makeAsset({ id: 2, name: "Top 5 Batting", compositionId: "CRI-88" }),
  ];

  it("matches name or composition id, ignoring case", () => {
    expect(filterAssetsBySearch(assets, "ladder").map((asset) => asset.id)).toEqual([
      1,
    ]);
    expect(filterAssetsBySearch(assets, "cri-88").map((asset) => asset.id)).toEqual([
      2,
    ]);
  });

  it("returns every asset when the search is blank", () => {
    expect(filterAssetsBySearch(assets, "   ")).toHaveLength(2);
  });
});
