import { toTemplateImage } from "./templateImageRecord";

describe("toTemplateImage", () => {
  it("reads a Strapi attributes payload", () => {
    expect(
      toTemplateImage({
        id: 1,
        attributes: {
          name: "Ken Burns",
          animationType: "kenburns",
          animationDirection: "in",
          overlayStyle: "vignette",
          gradientType: "radial",
          overlayOpacity: "0.4",
          publishedAt: "2026-09-28T00:00:00.000Z",
        },
      }),
    ).toEqual({
      id: 1,
      name: "Ken Burns",
      animationType: "kenburns",
      animationDirection: "in",
      overlayStyle: "vignette",
      gradientType: "radial",
      overlayOpacity: 0.4,
      publishedAt: "2026-09-28T00:00:00.000Z",
    });
  });
});
