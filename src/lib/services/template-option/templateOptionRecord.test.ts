import { toTemplateOption } from "./templateOptionRecord";

describe("toTemplateOption", () => {
  it("reads the account and populated catalogue links", () => {
    const row = toTemplateOption({
      id: 9,
      attributes: {
        useBackground: "Animated",
        publishedAt: null,
        account: {
          data: {
            id: 4,
            attributes: { FirstName: "Ada", LastName: "Lovelace" },
          },
        },
        template_category: { data: { id: 1, attributes: { Name: "Default" } } },
        template_animation: 3,
      },
    });

    expect(row.accountId).toBe(4);
    expect(row.accountName).toBe("Ada Lovelace");
    expect(row.links.template_category).toEqual({ id: 1, name: "Default" });
    expect(row.links.template_animation).toEqual({ id: 3, name: "" });
    expect(row.links.template_luminance).toEqual({ id: null, name: "" });
    expect(row.useBackground).toBe("Animated");
  });
});
