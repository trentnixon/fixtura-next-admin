import { toTemplatePalette } from "./templatePaletteRecord";

describe("toTemplatePalette", () => {
  it("reads a Strapi attributes payload", () => {
    expect(
      toTemplatePalette({
        id: 1,
        attributes: {
          name: "Default",
          value: "classic",
          publishedAt: "2026-01-01T00:00:00.000Z",
        },
      }),
    ).toEqual({
      id: 1,
      name: "Default",
      value: "classic",
      publishedAt: "2026-01-01T00:00:00.000Z",
    });
  });
});
