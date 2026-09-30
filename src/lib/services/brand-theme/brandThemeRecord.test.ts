import { toBrandTheme } from "./brandThemeRecord";

describe("toBrandTheme", () => {
  it("reads Name and the Theme colour JSON", () => {
    expect(
      toBrandTheme({
        id: 2,
        attributes: {
          Name: "Club navy",
          Theme: '{"primary":"#112233","secondary":"#445566","dark":"#000000","white":"#ffffff"}',
          isPublic: true,
          CreatedBy: { id: 7 },
          publishedAt: null,
        },
      }),
    ).toEqual({
      id: 2,
      name: "Club navy",
      theme: {
        primary: "#112233",
        secondary: "#445566",
        dark: "#000000",
        white: "#ffffff",
      },
      isPublic: true,
      createdBy: 7,
      publishedAt: null,
    });
  });
});
