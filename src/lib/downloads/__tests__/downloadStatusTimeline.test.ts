import { describe, expect, it } from "vitest";
import {
  classifyDownloadFromEntity,
  countDownloadStatusOnPage,
  downloadStatusLabel,
  filterDownloadsOnPageByStatus,
  formatDownloadUpdatedAgo,
  groupDownloadsBySydneyDate,
  sydneyDateKeyFromIso,
} from "@/lib/downloads/downloadStatusTimeline";
import type { Download } from "@/types/download";

function row(partial: {
  id: number;
  hasError: boolean | null;
  hasBeenProcessed: boolean;
  errorHandler?: unknown;
}): Download {
  return {
    id: partial.id,
    attributes: {
      Name: `Download ${partial.id}`,
      URL: null,
      grouping_category: "",
      isAccurate: null,
      hasBeenProcessed: partial.hasBeenProcessed,
      forceRerender: false,
      DisplayCost: 0,
      CompletionTime: "",
      OutputFileSize: "",
      UserErrorMessage: null,
      errorHandler: partial.errorHandler ?? [],
      hasError: partial.hasError,
      downloads: {},
      numDownloads: 0,
      assetLinkID: "",
      gameID: null,
      errorEmailSentToAdmin: false,
      updatedAt: "2026-10-01T00:00:00.000Z",
      asset: {
        data: { id: 1, attributes: { Name: "A", CompositionID: "c1" } },
      },
      asset_category: {
        data: { id: 1, attributes: { Identifier: "VIDEO" } },
      },
    },
  };
}

describe("downloadStatusLabel", () => {
  it("maps ok to Done", () => {
    expect(downloadStatusLabel("ok")).toBe("Done");
  });
});

describe("countDownloadStatusOnPage", () => {
  it("counts buckets on the current page", () => {
    const downloads = [
      row({ id: 1, hasError: true, hasBeenProcessed: true }),
      row({ id: 2, hasError: false, hasBeenProcessed: true }),
      row({ id: 3, hasError: null, hasBeenProcessed: false }),
    ];
    expect(countDownloadStatusOnPage(downloads)).toEqual({
      failed: 1,
      ok: 1,
      in_progress: 1,
      unknown: 0,
    });
  });
});

describe("formatDownloadUpdatedAgo", () => {
  const now = Date.parse("2026-10-16T12:00:00.000Z");

  it("formats minutes, hours, and days", () => {
    expect(
      formatDownloadUpdatedAgo("2026-10-16T11:50:00.000Z", now),
    ).toBe("10 min ago");
    expect(
      formatDownloadUpdatedAgo("2026-10-16T09:00:00.000Z", now),
    ).toBe("3 hours ago");
    expect(
      formatDownloadUpdatedAgo("2026-10-14T12:00:00.000Z", now),
    ).toBe("2 days ago");
  });
});

describe("groupDownloadsBySydneyDate", () => {
  it("groups consecutive rows by Sydney calendar day", () => {
    const downloads = [
      row({
        id: 1,
        hasError: false,
        hasBeenProcessed: true,
      }),
      row({
        id: 2,
        hasError: false,
        hasBeenProcessed: true,
      }),
    ];
    downloads[0]!.attributes.updatedAt = "2026-10-15T12:33:00.000Z";
    downloads[1]!.attributes.updatedAt = "2026-10-14T12:00:00.000Z";

    const groups = groupDownloadsBySydneyDate(downloads);
    expect(groups).toHaveLength(2);
    expect(groups[0]!.rows.map((d) => d.id)).toEqual([1]);
    expect(groups[1]!.rows.map((d) => d.id)).toEqual([2]);
    expect(sydneyDateKeyFromIso(downloads[0]!.attributes.updatedAt)).not.toBe(
      sydneyDateKeyFromIso(downloads[1]!.attributes.updatedAt),
    );
  });
});

describe("filterDownloadsOnPageByStatus", () => {
  it("filters only within the provided page rows", () => {
    const downloads = [
      row({ id: 1, hasError: true, hasBeenProcessed: true }),
      row({ id: 2, hasError: false, hasBeenProcessed: true }),
    ];
    const filtered = filterDownloadsOnPageByStatus(downloads, "failed");
    expect(filtered.map((d) => d.id)).toEqual([1]);
    expect(classifyDownloadFromEntity(downloads[1]!)).toBe("ok");
  });

  it("filters Done (ok bucket) on this page", () => {
    const downloads = [
      row({ id: 1, hasError: true, hasBeenProcessed: true }),
      row({ id: 2, hasError: false, hasBeenProcessed: true }),
    ];
    expect(filterDownloadsOnPageByStatus(downloads, "ok").map((d) => d.id)).toEqual(
      [2],
    );
  });
});
