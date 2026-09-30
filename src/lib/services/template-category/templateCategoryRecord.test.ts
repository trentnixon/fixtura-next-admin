import { toTemplateCategory } from "./templateCategoryRecord";

describe("toTemplateCategory", () => {
  it("reads Name, fixture JSON, and the audio bundle", () => {
    expect(
      toTemplateCategory({
        id: 1,
        attributes: {
          Name: "Default",
          slug: "default",
          divideFixturesBy: { CricketResults: 4 },
          isPrivate: false,
          publishedAt: "2026-01-01T00:00:00.000Z",
          bundle_audio: { data: { id: 6, attributes: { Name: "Match audio" } } },
        },
      }),
    ).toEqual({
      id: 1,
      name: "Default",
      slug: "default",
      divideFixturesBy: { CricketResults: 4 },
      isPrivate: false,
      bundleAudioId: 6,
      bundleAudioName: "Match audio",
      publishedAt: "2026-01-01T00:00:00.000Z",
    });
  });
});
