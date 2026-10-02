import { describe, expect, it } from "vitest";
import { humanizeToken } from "./humanizeToken";
import { gradientBackground } from "./swatches/gradientPreview";
import { overlayStrength } from "./swatches/ImageOverlaySwatch";
import { imageMotionLabel, imageOverlayLabel } from "./swatches/imagePresetLabels";

describe("humanizeToken", () => {
  it("splits camel case and capitalises the first letter", () => {
    expect(humanizeToken("digitalRain")).toBe("Digital rain");
    expect(humanizeToken("floatingParticles")).toBe("Floating particles");
    expect(humanizeToken("panLeft")).toBe("Pan left");
    expect(humanizeToken("Crosshatch")).toBe("Crosshatch");
    expect(humanizeToken("HORIZONTAL")).toBe("Horizontal");
    expect(humanizeToken("")).toBe("");
  });
});

describe("image preset labels", () => {
  it("names the awkward motion and overlay tokens", () => {
    expect(imageMotionLabel("kenburns")).toBe("Ken Burns");
    expect(imageMotionLabel("focusblur")).toBe("Focus blur");
    expect(imageOverlayLabel("colorFilter")).toBe("Colour filter");
    expect(overlayStrength(0.4)).toBe(0.4);
    expect(overlayStrength(40)).toBe(0.4);
    expect(overlayStrength(null)).toBe(0.55);
  });
});

describe("gradientBackground", () => {
  it("maps direction words onto a css gradient", () => {
    expect(gradientBackground("primary", "HORIZONTAL")).toContain("90deg");
    expect(gradientBackground("primary", "VERTICAL")).toContain("180deg");
    expect(gradientBackground("file", "")).toContain("135deg");
    expect(gradientBackground("radial", "circle")).toContain("radial-gradient");
  });
});
