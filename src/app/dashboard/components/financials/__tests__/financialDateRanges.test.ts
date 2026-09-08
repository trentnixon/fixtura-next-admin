import { describe, expect, it } from "vitest";
import {
  getFinancialPeriodMonthKeys,
  getRecentMonthlyRevenue,
  sumRecentMonthlyRevenue,
} from "../financialDateRanges";

describe("financialDateRanges", () => {
  const anchor = new Date("2026-09-08T12:00:00");

  it("returns consecutive calendar months for the selected period", () => {
    expect(getFinancialPeriodMonthKeys(6, anchor)).toEqual([
      "2026-04",
      "2026-05",
      "2026-06",
      "2026-07",
      "2026-08",
      "2026-09",
    ]);
  });

  it("zero-fills months with no revenue instead of skipping them", () => {
    const series = getRecentMonthlyRevenue(
      {
        "2026-04": 1000,
        "2026-06": 2000,
        "2026-09": 3000,
      },
      6,
      anchor
    );

    expect(series).toEqual([
      { month: "2026-04", revenueCents: 1000 },
      { month: "2026-05", revenueCents: 0 },
      { month: "2026-06", revenueCents: 2000 },
      { month: "2026-07", revenueCents: 0 },
      { month: "2026-08", revenueCents: 0 },
      { month: "2026-09", revenueCents: 3000 },
    ]);
  });

  it("returns zeroed months when revenue data is unavailable", () => {
    expect(getRecentMonthlyRevenue(undefined, 3, anchor)).toEqual([
      { month: "2026-07", revenueCents: 0 },
      { month: "2026-08", revenueCents: 0 },
      { month: "2026-09", revenueCents: 0 },
    ]);
  });

  it("sums only revenue within the linear month window", () => {
    const total = sumRecentMonthlyRevenue(
      {
        "2026-03": 999,
        "2026-04": 1000,
        "2026-09": 3000,
      },
      6,
      anchor
    );

    expect(total).toBe(4000);
  });
});
