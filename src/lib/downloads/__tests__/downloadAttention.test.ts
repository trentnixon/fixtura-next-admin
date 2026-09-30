import { describe, expect, it } from "vitest";
import {
  classifyDownloadAttention,
  downloadMatchesAttentionFilter,
  extractErrorHandlerTypes,
  hasNonEmptyErrorHandler,
  resolveDownloadPrimaryErrorMessage,
} from "@/lib/downloads/downloadAttention";

describe("hasNonEmptyErrorHandler", () => {
  it("is false for null, undefined, and empty array", () => {
    expect(hasNonEmptyErrorHandler(null)).toBe(false);
    expect(hasNonEmptyErrorHandler(undefined)).toBe(false);
    expect(hasNonEmptyErrorHandler([])).toBe(false);
  });

  it("is true when the array has at least one entry", () => {
    expect(hasNonEmptyErrorHandler([{ Type: "Timeout" }])).toBe(true);
  });
});

describe("classifyDownloadAttention", () => {
  it("classifies hasError true as failed even when processed", () => {
    expect(
      classifyDownloadAttention({
        hasError: true,
        hasBeenProcessed: true,
        errorHandler: [],
      }),
    ).toBe("failed");
  });

  it("classifies non-empty errorHandler as failed when hasError is null", () => {
    expect(
      classifyDownloadAttention({
        hasError: null,
        hasBeenProcessed: true,
        errorHandler: [{ Message: "x" }],
      }),
    ).toBe("failed");
  });

  it("classifies unprocessed non-failed rows as in progress", () => {
    expect(
      classifyDownloadAttention({
        hasError: null,
        hasBeenProcessed: false,
        errorHandler: [],
      }),
    ).toBe("in_progress");
  });

  it("classifies processed clean rows as ok", () => {
    expect(
      classifyDownloadAttention({
        hasError: false,
        hasBeenProcessed: true,
        errorHandler: [],
      }),
    ).toBe("ok");
  });

  it("classifies ambiguous legacy rows as unknown", () => {
    expect(
      classifyDownloadAttention({
        hasError: null,
        hasBeenProcessed: true,
        errorHandler: [],
      }),
    ).toBe("unknown");
  });
});

describe("downloadMatchesAttentionFilter", () => {
  const cases: Array<{
    bucket: ReturnType<typeof classifyDownloadAttention>;
    filter: "all" | "needs_attention" | "in_progress" | "failed";
    matches: boolean;
  }> = [
    { bucket: "failed", filter: "all", matches: true },
    { bucket: "failed", filter: "failed", matches: true },
    { bucket: "failed", filter: "needs_attention", matches: true },
    { bucket: "failed", filter: "in_progress", matches: false },
    { bucket: "in_progress", filter: "needs_attention", matches: true },
    { bucket: "in_progress", filter: "in_progress", matches: true },
    { bucket: "ok", filter: "needs_attention", matches: false },
    { bucket: "unknown", filter: "failed", matches: false },
    { bucket: "unknown", filter: "all", matches: true },
  ];

  it.each(cases)(
    "bucket $bucket with filter $filter → $matches",
    ({ bucket, filter, matches }) => {
      expect(downloadMatchesAttentionFilter(bucket, filter)).toBe(matches);
    },
  );
});

describe("resolveDownloadPrimaryErrorMessage", () => {
  it("prefers userErrorMessage when non-empty", () => {
    expect(
      resolveDownloadPrimaryErrorMessage("User text", [
        { Message: "Handler text" },
      ]),
    ).toBe("User text");
  });

  it("falls back to first non-empty errorHandler Message", () => {
    expect(
      resolveDownloadPrimaryErrorMessage(null, [
        { Message: "  " },
        { Message: "From handler" },
      ]),
    ).toBe("From handler");
  });

  it("returns null when both are empty", () => {
    expect(resolveDownloadPrimaryErrorMessage("", [])).toBe(null);
    expect(resolveDownloadPrimaryErrorMessage(null, null)).toBe(null);
  });
});

describe("extractErrorHandlerTypes", () => {
  it("returns unique Type strings", () => {
    expect(
      extractErrorHandlerTypes([
        { Type: "Render", Message: "a" },
        { Type: "Render", Message: "b" },
        { Type: "Storage" },
      ]),
    ).toEqual(["Render", "Storage"]);
  });
});
