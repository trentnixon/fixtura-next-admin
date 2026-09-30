import { toTemplateNoise } from "./templateNoiseRecord";

describe("toTemplateNoise", () => {
  it("reads a Strapi attributes payload", () => {
    expect(
      toTemplateNoise({
        id: 3,
        attributes: {
          name: "Grain",
          noiseType: "grain",
          publishedAt: "2026-09-28T00:00:00.000Z",
        },
      }),
    ).toEqual({
      id: 3,
      name: "Grain",
      noiseType: "grain",
      publishedAt: "2026-09-28T00:00:00.000Z",
    });
  });

  it("reads a flat payload and treats a missing publish date as a draft", () => {
    expect(
      toTemplateNoise({
        id: 1,
        name: "Default",
        noiseType: "default",
      }),
    ).toEqual({
      id: 1,
      name: "Default",
      noiseType: "default",
      publishedAt: null,
    });
  });
});
