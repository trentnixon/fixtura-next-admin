import { toTemplateTexture } from "./templateTextureRecord";

describe("toTemplateTexture", () => {
  it("reads Name and a populated texture file", () => {
    expect(
      toTemplateTexture({
        id: 3,
        attributes: {
          Name: "Turf grain",
          category: "Turf",
          opacity: "0.35",
          blendMode: "multiply",
          publishedAt: null,
          texture: {
            data: {
              id: 41,
              attributes: {
                url: "https://cdn.example.com/turf.png",
                name: "turf.png",
              },
            },
          },
        },
      }),
    ).toEqual({
      id: 3,
      name: "Turf grain",
      category: "Turf",
      opacity: 0.35,
      blendMode: "multiply",
      textureId: 41,
      textureUrl: "https://cdn.example.com/turf.png",
      textureName: "turf.png",
      publishedAt: null,
    });
  });

  it("reads a numeric texture id", () => {
    expect(toTemplateTexture({ id: 1, Name: "Bare", texture: 9 }).textureId).toBe(9);
  });
});
