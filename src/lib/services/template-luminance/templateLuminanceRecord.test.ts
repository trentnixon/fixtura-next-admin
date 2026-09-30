import { toTemplateLuminance } from "./templateLuminanceRecord";

describe("toTemplateLuminance", () => {
  it("reads a populated Strapi media relation", () => {
    expect(
      toTemplateLuminance({
        id: 4,
        attributes: {
          name: "Plate A",
          publishedAt: null,
          image: {
            data: {
              id: 88,
              attributes: {
                url: "https://cdn.example.com/plate.png",
                name: "plate.png",
              },
            },
          },
        },
      }),
    ).toEqual({
      id: 4,
      name: "Plate A",
      imageId: 88,
      imageUrl: "https://cdn.example.com/plate.png",
      imageName: "plate.png",
      publishedAt: null,
    });
  });

  it("reads a numeric image id", () => {
    expect(toTemplateLuminance({ id: 1, name: "Bare", image: 12 }).imageId).toBe(12);
  });
});
