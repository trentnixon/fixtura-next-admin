import { describe, expect, it } from "vitest";
import { groupDownloadQueueRows } from "@/lib/downloads/groupDownloadQueueRows";
import type { DownloadQualityQueueRow } from "@/types/downloadQualityControl";

function row(
  partial: Partial<DownloadQualityQueueRow> & { downloadId: number },
): DownloadQualityQueueRow {
  return {
    downloadId: partial.downloadId,
    name: partial.name ?? null,
    hasError: partial.hasError ?? null,
    hasBeenProcessed: partial.hasBeenProcessed ?? false,
    attention: partial.attention ?? "failed",
    userErrorMessage: null,
    errorHandler: null,
    errorEmailSentToAdmin: false,
    forceRerender: false,
    groupingCategory: partial.groupingCategory ?? null,
    assetCategoryIdentifier: partial.assetCategoryIdentifier ?? null,
    assetCategoryName: partial.assetCategoryName ?? null,
    assetName: null,
    assetLinkId: null,
    gameId: null,
    url: null,
    updatedAt: "2026-09-28T00:00:00.000Z",
    render: null,
    account: null,
  };
}

describe("groupDownloadQueueRows", () => {
  it("returns a single flat group when groupBy is none", () => {
    const rows = [row({ downloadId: 1 }), row({ downloadId: 2 })];
    const groups = groupDownloadQueueRows(rows, "none");
    expect(groups).toHaveLength(1);
    expect(groups[0].rows).toHaveLength(2);
  });

  it("groups by asset category identifier", () => {
    const rows = [
      row({ downloadId: 1, assetCategoryIdentifier: "VIDEO" }),
      row({ downloadId: 2, assetCategoryIdentifier: "IMAGE" }),
      row({ downloadId: 3, assetCategoryIdentifier: "VIDEO" }),
    ];
    const groups = groupDownloadQueueRows(rows, "assetCategoryIdentifier");
    expect(groups.map((g) => g.label)).toEqual(["IMAGE", "VIDEO"]);
    expect(groups.find((g) => g.label === "VIDEO")?.rows).toHaveLength(2);
  });

  it("buckets empty category into Uncategorized", () => {
    const groups = groupDownloadQueueRows(
      [row({ downloadId: 1, groupingCategory: null })],
      "groupingCategory",
    );
    expect(groups[0].label).toBe("Uncategorized");
  });
});
