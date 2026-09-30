import { toTemplateGradient } from "./templateGradientRecord";

describe("toTemplateGradient", () => {
  it("reads a Strapi attributes payload", () => {
    expect(
      toTemplateGradient({
        id: 1,
        attributes: {
          name: "Default",
          type: "linear",
          direction: "to bottom",
          publishedAt: "2026-09-28T00:00:00.000Z",
        },
      }),
    ).toEqual({
      id: 1,
      name: "Default",
      type: "linear",
      direction: "to bottom",
      publishedAt: "2026-09-28T00:00:00.000Z",
    });
  });

  it("reads a flat payload as a draft when unpublished", () => {
    expect(
      toTemplateGradient({ id: 2, name: "Radial", type: "radial", direction: "" }),
    ).toEqual({
      id: 2,
      name: "Radial",
      type: "radial",
      direction: "",
      publishedAt: null,
    });
  });
});
