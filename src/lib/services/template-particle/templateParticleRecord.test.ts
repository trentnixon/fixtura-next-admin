import { toTemplateParticle } from "./templateParticleRecord";

describe("toTemplateParticle", () => {
  it("reads a Strapi attributes payload", () => {
    expect(
      toTemplateParticle({
        id: 1,
        attributes: {
          name: "Snow",
          particleType: "snow",
          particleCount: "40",
          speed: 1.5,
          direction: "down",
          animationType: "fade",
          publishedAt: "2026-09-28T00:00:00.000Z",
        },
      }),
    ).toEqual({
      id: 1,
      name: "Snow",
      particleType: "snow",
      particleCount: 40,
      speed: 1.5,
      direction: "down",
      animationType: "fade",
      publishedAt: "2026-09-28T00:00:00.000Z",
    });
  });
});
