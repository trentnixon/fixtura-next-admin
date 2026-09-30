import { toTemplatePattern } from "./templatePatternRecord";

describe("toTemplatePattern", () => {
  it("reads a Strapi attributes payload", () => {
    expect(
      toTemplatePattern({
        id: 1,
        attributes: {
          name: "Grid",
          patternType: "grid",
          animation: "panDown",
          scale: "1.2",
          rotation: 15,
          opacity: 0.4,
          animationDuration: 8,
          animationSpeed: "2",
          publishedAt: null,
        },
      }),
    ).toEqual({
      id: 1,
      name: "Grid",
      patternType: "grid",
      animation: "panDown",
      scale: 1.2,
      rotation: 15,
      opacity: 0.4,
      animationDuration: 8,
      animationSpeed: 2,
      publishedAt: null,
    });
  });
});
