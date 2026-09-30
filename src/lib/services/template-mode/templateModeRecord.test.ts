import { toTemplateMode } from "./templateModeRecord";

describe("toTemplateMode", () => {
  it("reads Name and slug", () => {
    expect(
      toTemplateMode({
        id: 2,
        attributes: {
          Name: "Dark",
          slug: "dark",
          publishedAt: null,
        },
      }),
    ).toEqual({
      id: 2,
      name: "Dark",
      slug: "dark",
      publishedAt: null,
    });
  });
});
