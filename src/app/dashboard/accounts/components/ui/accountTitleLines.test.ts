import { describe, expect, it } from "vitest";
import {
  buildAccountTitleIdentity,
  loginEmailForAccount,
} from "./accountTitleLines";

describe("buildAccountTitleIdentity", () => {
  it("labels an association with its delivery email and logged-in user", () => {
    expect(
      buildAccountTitleIdentity({
        sport: "Cricket",
        accountType: 2,
        organisationName: "Queensland Premier Cricket",
        deliveryEmail: "trentnixon@gmail.com",
        firstName: "Trent",
        lastName: "Nixon",
        loginEmail: "owner@club.example",
      }),
    ).toEqual({
      org: "Cricket · Association",
      name: "Queensland Premier Cricket",
      emailTo: "trentnixon@gmail.com",
      loggedInByName: "Trent Nixon",
      loginEmail: "owner@club.example",
    });
  });

  it("labels a club and drops blank contact fields", () => {
    expect(
      buildAccountTitleIdentity({
        sport: "  ",
        accountType: 1,
        organisationName: "  ",
        deliveryEmail: "",
        firstName: "Sam",
        lastName: null,
        loginEmail: "  ",
      }),
    ).toEqual({
      org: "Unknown · Club",
      name: "Account",
      emailTo: null,
      loggedInByName: "Sam",
      loginEmail: null,
    });
  });
});

describe("loginEmailForAccount", () => {
  it("returns the login email for the matching account", () => {
    expect(
      loginEmailForAccount(
        [
          { id: 4, email: "other@example.com" },
          { id: 9, email: " owner@example.com " },
        ],
        9,
      ),
    ).toBe("owner@example.com");
  });

  it("returns null when the account or email is missing", () => {
    expect(loginEmailForAccount([{ id: 9, email: " " }], 9)).toBeNull();
    expect(loginEmailForAccount([{ id: 9, email: "owner@example.com" }], 3)).toBeNull();
  });
});
