import { describe, expect, it } from "vitest";
import type { OrderOverviewTimeline } from "@/types/orderOverview";
import { aggregateTimelineByMonth } from "../financialTimeline";

describe("financialTimeline", () => {
  const monthKeys = ["2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09"];

  const timeline: OrderOverviewTimeline = {
    granularity: "daily",
    range: { start: "2026-04-01", end: "2026-09-08" },
    series: [
      {
        name: "ordersPaid",
        label: "Orders paid",
        data: [
          { date: "2026-08-12", value: 1 },
          { date: "2026-09-03", value: 2 },
        ],
      },
      {
        name: "revenueCollected",
        label: "Revenue collected",
        data: [
          { date: "2026-08-12", value: 15000 },
          { date: "2026-09-03", value: 38820 },
        ],
      },
    ],
    totals: {
      ordersCreated: 0,
      ordersPaid: 3,
      ordersEnded: 0,
      revenueCollected: 53820,
    },
  };

  it("zero-fills every calendar month in the period", () => {
    const data = aggregateTimelineByMonth(timeline, monthKeys);

    expect(data.map((entry) => entry.date)).toEqual(monthKeys);
    expect(data.map((entry) => entry.ordersPaid)).toEqual([0, 0, 0, 0, 1, 2]);
    expect(data.map((entry) => entry.revenueCollected)).toEqual([
      0, 0, 0, 0, 150, 388.2,
    ]);
  });
});
