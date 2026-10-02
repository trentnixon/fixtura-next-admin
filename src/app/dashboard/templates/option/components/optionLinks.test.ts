import { describe, expect, it } from "vitest";
import { activeBackgroundLink } from "./optionLinks";

describe("activeBackgroundLink", () => {
  it("points each background at its catalogue", () => {
    expect(activeBackgroundLink("Luminance")).toBe("template_luminance");
    expect(activeBackgroundLink("Animated")).toBe("template_animation");
    expect(activeBackgroundLink("Solid")).toBeNull();
    expect(activeBackgroundLink("Particle")).toBe("template_particle");
  });
});
