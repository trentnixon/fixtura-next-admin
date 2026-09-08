import type { OrderOverviewTimeline } from "@/types/orderOverview";

export type TimelineDatum = {
  date: string;
  ordersCreated?: number;
  ordersPaid?: number;
  ordersEnded?: number;
  revenueCollected?: number;
};

const SERIES_NAMES = [
  "ordersCreated",
  "ordersPaid",
  "ordersEnded",
  "revenueCollected",
] as const;

/** Merge daily timeline points into calendar months, zero-filling gaps. */
export function aggregateTimelineByMonth(
  timeline: OrderOverviewTimeline,
  monthKeys: string[]
): TimelineDatum[] {
  const buckets = new Map<string, TimelineDatum>(
    monthKeys.map((month) => [month, { date: month }])
  );

  timeline.series.forEach((series) => {
    series.data.forEach((point) => {
      const monthKey = point.date.slice(0, 7);
      const bucket = buckets.get(monthKey);
      if (!bucket) return;

      const value =
        series.name === "revenueCollected" ? point.value / 100 : point.value;
      const current = bucket[series.name] ?? 0;

      buckets.set(monthKey, {
        ...bucket,
        [series.name]: current + value,
      });
    });
  });

  return monthKeys.map((month) => {
    const bucket = buckets.get(month)!;

    return {
      date: month,
      ordersCreated: bucket.ordersCreated ?? 0,
      ordersPaid: bucket.ordersPaid ?? 0,
      ordersEnded: bucket.ordersEnded ?? 0,
      revenueCollected: bucket.revenueCollected ?? 0,
    };
  });
}

/** Merge sparse daily timeline points into a sorted daily series. */
export function mergeDailyTimeline(
  timeline: OrderOverviewTimeline
): TimelineDatum[] {
  const timelineMap = new Map<string, TimelineDatum>();

  timeline.series.forEach((series) => {
    series.data.forEach((point) => {
      const existing = timelineMap.get(point.date) ?? { date: point.date };
      timelineMap.set(point.date, {
        ...existing,
        [series.name]:
          series.name === "revenueCollected"
            ? point.value / 100
            : point.value,
      });
    });
  });

  return Array.from(timelineMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function hasTimelineSeriesData(data: TimelineDatum[]): boolean {
  return data.some((datum) =>
    SERIES_NAMES.some((name) => (datum[name] ?? 0) > 0)
  );
}
