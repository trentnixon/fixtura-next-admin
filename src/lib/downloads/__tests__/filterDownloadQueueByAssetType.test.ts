import { describe, expect, it } from "vitest";
import {
  filterQueueRowsByAssetType,
  uniqueAssetTypesFromQueueRows,
} from "@/lib/downloads/filterDownloadQueueByAssetType";
import type { DownloadQualityQueueRow } from "@/types/downloadQualityControl";

function row(
  partial: Partial<DownloadQualityQueueRow> & { downloadId: number },
): DownloadQualityQueueRow {
  return {
    downloadId: partial.downloadId,
    name: null,
    hasError: null,
    hasBeenProcessed: false,
    attention: "ok",
    userErrorMessage: null,
    errorHandler: null,
    errorEmailSentToAdmin: false,
    forceRerender: false,
    groupingCategory: null,
    assetCategoryIdentifier: partial.assetCategoryIdentifier ?? null,
    assetCategoryName: null,
    assetName: null,
    assetLinkId: null,
    gameId: null,
    url: null,
    updatedAt: "2026-09-28T00:00:00.000Z",
    render: null,
    account: null,
  };
}

describe("filterDownloadQueueByAssetType", () => {
  it("lists unique asset types sorted", () => {
    const types = uniqueAssetTypesFromQueueRows([
      row({ downloadId: 1, assetCategoryIdentifier: "VIDEO" }),
      row({ downloadId: 2, assetCategoryIdentifier: "IMAGE" }),
      row({ downloadId: 3, assetCategoryIdentifier: "VIDEO" }),
    ]);
    expect(types.map((t) => t.label)).toEqual(["IMAGE", "VIDEO"]);
  });

  it("filters rows to the selected asset type key", () => {
    const rows = [
      row({ downloadId: 1, assetCategoryIdentifier: "VIDEO" }),
      row({ downloadId: 2, assetCategoryIdentifier: "IMAGE" }),
    ];
    expect(filterQueueRowsByAssetType(rows, "VIDEO")).toHaveLength(1);
    expect(filterQueueRowsByAssetType(rows, "VIDEO")[0].downloadId).toBe(1);
  });
});
