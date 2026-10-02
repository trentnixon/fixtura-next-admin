import { describe, expect, it } from "vitest";
import { readUploadedMedia } from "./readUploadedMedia";

describe("readUploadedMedia", () => {
  it("reads the first file from a Strapi upload response", () => {
    expect(
      readUploadedMedia([
        { id: 88, url: "https://cdn.example.com/plate.png", name: "plate.png" },
      ]),
    ).toEqual({
      id: 88,
      url: "https://cdn.example.com/plate.png",
      name: "plate.png",
    });
  });

  it("reads a file wrapped in attributes", () => {
    expect(
      readUploadedMedia({
        data: [{ id: 3, attributes: { url: "/uploads/plate.png", name: "plate.png" } }],
      }).id,
    ).toBe(3);
  });

  it("rejects an empty upload response", () => {
    expect(() => readUploadedMedia([])).toThrow(/media file/);
  });
});
