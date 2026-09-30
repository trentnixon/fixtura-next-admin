import { describe, expect, it } from "vitest";
import {
  isPlottableCoordinate,
  pickClubGeocodeQuery,
  readGeocodeResponse,
} from "./clubLocationMapModel";

describe("isPlottableCoordinate", () => {
  it("accepts finite lat/lng inside world bounds", () => {
    expect(isPlottableCoordinate({ lat: -37.81, lng: 144.96 })).toBe(true);
  });

  it("rejects missing and out-of-range values", () => {
    expect(isPlottableCoordinate(null)).toBe(false);
    expect(isPlottableCoordinate({ lat: Number.NaN, lng: 144 })).toBe(false);
    expect(isPlottableCoordinate({ lat: 120, lng: 10 })).toBe(false);
  });
});

describe("pickClubGeocodeQuery", () => {
  it("prefers the first mappable candidate", () => {
    expect(
      pickClubGeocodeQuery([
        null,
        "short",
        "Oval Rd, Richmond VIC 3121",
        "Other St, Melbourne VIC 3000",
      ]),
    ).toBe("Oval Rd, Richmond VIC 3121");
  });

  it("returns null when nothing is mappable", () => {
    expect(pickClubGeocodeQuery([null, "No address", "Sydney"])).toBeNull();
  });
});

describe("readGeocodeResponse", () => {
  it("reads a coordinate payload", () => {
    expect(readGeocodeResponse({ data: { lat: -33.86, lng: 151.2 } })).toEqual({
      lat: -33.86,
      lng: 151.2,
    });
  });

  it("returns null for an empty or malformed body", () => {
    expect(readGeocodeResponse({ data: null })).toBeNull();
    expect(readGeocodeResponse({ data: { lat: "x", lng: 1 } })).toBeNull();
    expect(readGeocodeResponse(null)).toBeNull();
  });
});
