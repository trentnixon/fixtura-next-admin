import { describe, expect, it } from "vitest";
import {
  isMappableOrgContactAddress,
  normalizeOrgContactAddressForGeocode,
  orgContactRowsToMapLocations,
} from "./orgContactAddress";

describe("isMappableOrgContactAddress", () => {
  it("rejects placeholders and short strings", () => {
    expect(isMappableOrgContactAddress(null)).toBe(false);
    expect(isMappableOrgContactAddress("")).toBe(false);
    expect(isMappableOrgContactAddress("No address")).toBe(false);
    expect(isMappableOrgContactAddress("123 St")).toBe(false);
  });

  it("accepts scraped street addresses", () => {
    expect(
      isMappableOrgContactAddress("12 Main Road, Suburb VIC 3000"),
    ).toBe(true);
  });
});

describe("normalizeOrgContactAddressForGeocode", () => {
  it("appends Australia when region hint missing", () => {
    expect(normalizeOrgContactAddressForGeocode("1 Test St, Brisbane")).toBe(
      "1 Test St, Brisbane, Australia",
    );
  });

  it("leaves explicit country unchanged", () => {
    expect(
      normalizeOrgContactAddressForGeocode("1 Test St, Auckland, New Zealand"),
    ).toBe("1 Test St, Auckland, New Zealand");
  });
});

describe("orgContactRowsToMapLocations", () => {
  it("caps and skips non-mappable rows", () => {
    const rows = [
      { id: 1, name: "A", address: "No address" },
      { id: 2, name: "B", address: "10 Queen St, Melbourne VIC 3000" },
      { id: 3, name: "C", address: "20 King St, Sydney NSW 2000" },
    ];
    expect(orgContactRowsToMapLocations(rows, 1)).toEqual([
      { id: 2, name: "B", address: "10 Queen St, Melbourne VIC 3000" },
    ]);
  });
});
