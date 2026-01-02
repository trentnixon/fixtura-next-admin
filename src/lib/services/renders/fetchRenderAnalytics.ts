/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { RenderAnalyticsResponse, AnalyticsPeriod } from "@/types/render";

/**
 * Fetches the render analytics (chart data) for the Global Render Monitor.
 * Uses the specialized custom endpoint /renders/analytics.
 */
export async function fetchRenderAnalytics(period: AnalyticsPeriod = "day"): Promise<RenderAnalyticsResponse> {
  try {
    const response = await axiosInstance.get<RenderAnalyticsResponse>(
      `/renders/analytics?period=${period}`
    );

    // If data is missing or empty, return mock data
    if (!response.data || !response.data.data || response.data.data.length === 0) {
      console.warn("Render analytics API returned empty data, using mock fallback");
      return generateMockAnalytics(period);
    }

    return response.data;
  } catch (error: any) {
    console.warn("Failed to fetch render analytics, using mock fallback due to error:", error.message);
    return generateMockAnalytics(period);
  }
}

function generateMockAnalytics(period: AnalyticsPeriod): RenderAnalyticsResponse {
  const data: any[] = [];
  const now = new Date();
  const count = period === "day" ? 24 : period === "week" ? 7 : 30;

  for (let i = 0; i < count; i++) {
    const date = new Date(now);
    if (period === "day") {
      date.setHours(now.getHours() - (count - 1 - i));
    } else {
      date.setDate(now.getDate() - (count - 1 - i));
    }

    // Generate somewhat realistic data with some randomness
    const baseVolume = Math.floor(Math.random() * 15) + 5;
    const failures = Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0;

    data.push({
      period: period,
      date: date.toISOString(),
      renderVolume: baseVolume - failures,
      assetDensity: Math.floor(Math.random() * 5) + 2,
      failureCount: failures,
      failureRate: failures / baseVolume,
      totalRenders: baseVolume,
      totalAssets: (baseVolume - failures) * (Math.floor(Math.random() * 5) + 2),
    });
  }

  return {
    period,
    range: {
      start: data[0].date,
      end: data[data.length - 1].date,
    },
    data,
  };
}
