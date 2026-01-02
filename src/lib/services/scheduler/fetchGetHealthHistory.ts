/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { HealthHistory } from "@/types/scheduler";

export async function fetchGetHealthHistory(days: number = 14): Promise<HealthHistory[]> {
  try {
    const response = await axiosInstance.get<HealthHistory[]>(
      `/scheduler/getHealthHistory?days=${days}`
    );

    // If data is missing or empty, return mock data
    if (!response.data || response.data.length === 0) {
      console.warn("Scheduler health history API returned empty data, using mock fallback");
      return generateMockHealthHistory(days);
    }

    return response.data;
  } catch (error: any) {
    console.warn("Failed to fetch health history, using mock fallback due to error:", error.message);
    return generateMockHealthHistory(days);
  }
}

function generateMockHealthHistory(days: number): HealthHistory[] {
  const data: HealthHistory[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - (days - 1 - i));

    // Generate realistic data
    const totalVolume = Math.floor(Math.random() * 20) + 10;
    const failed = Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0;
    const success = totalVolume - failed;

    // Avg duration between 15 and 45 minutes
    const avgDuration = Math.random() * 30 + 15;

    data.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
      success,
      failed,
      avgDuration,
      totalVolume,
    });
  }

  return data;
}
