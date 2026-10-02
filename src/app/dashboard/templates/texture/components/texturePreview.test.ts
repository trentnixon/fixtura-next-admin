import { describe, expect, it } from "vitest";
import { textureOverlayOpacity } from "./texturePreview";

describe("textureOverlayOpacity", () => {
  it("uses the preview default when the row has no opacity", () => {
    expect(textureOverlayOpacity(null)).toBe(0.8);
    expect(textureOverlayOpacity(0.35)).toBe(0.35);
    expect(textureOverlayOpacity(80)).toBe(0.8);
  });
});
