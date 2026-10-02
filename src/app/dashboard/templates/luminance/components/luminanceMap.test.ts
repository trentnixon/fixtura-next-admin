import { describe, expect, it } from "vitest";
import { luminanceByte, mapLuminanceByte, resolveBrandPresetStops } from "./luminanceMap";

describe("resolveBrandPresetStops", () => {
  it("maps a spread club pair through the brand preset", () => {
    const result = resolveBrandPresetStops("#112233", "#ffcc00");
    expect(result?.preset).toBe("brand");
    expect(result?.stops.map((stop) => stop.position)).toEqual([0, 0.65, 1]);
    expect(result?.stops[1]?.color).toBe("#112233");
    expect(result?.stops[2]?.color).toBe("#ffcc00");
    expect(result?.stops[0]?.color).not.toBe("#112233");
  });

  it("falls back to tonal-brand when the pair is too close in lightness", () => {
    const result = resolveBrandPresetStops("#f5f5f5", "#fafafa");
    expect(result?.preset).toBe("tonal-brand");
    expect(result?.stops.map((stop) => stop.position)).toEqual([0, 0.45, 1]);
    expect(result?.stops[1]?.color).toBe("#f5f5f5");
    expect(result?.stops[2]?.color).not.toBe("#fafafa");
  });

  it("darkens white by the same step the palette generator uses", () => {
    const result = resolveBrandPresetStops("#ffffff", "#111111");
    expect(result?.stops[0]?.color).toBe("#e6e6e6");
  });
});

describe("mapLuminanceByte", () => {
  it("uses the same luminance weights as the renderer", () => {
    expect(luminanceByte(255, 255, 255)).toBe(255);
    expect(luminanceByte(0, 0, 0)).toBe(0);
    const stops = [
      { position: 0, color: "#000000" },
      { position: 1, color: "#ffffff" },
    ];
    expect(mapLuminanceByte(0, stops)).toEqual({ r: 0, g: 0, b: 0 });
    expect(mapLuminanceByte(255, stops)).toEqual({ r: 255, g: 255, b: 255 });
  });
});
