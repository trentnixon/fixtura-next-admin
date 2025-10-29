import { NextResponse } from "next/server";
import { fetchTrialAnalytics } from "@/lib/services/analytics/fetchTrialAnalytics";

/**
 * GET /api/analytics/trial-analytics
 *
 * Fetches trial analytics including detailed insights into trial usage patterns,
 * conversion funnels, trial success predictors, engagement metrics, and trial
 * performance analysis.
 *
 * @param request - Next.js request object
 * @returns Trial analytics data or error response
 */
export async function GET() {
  try {
    console.log("[API] GET /api/analytics/trial-analytics");

    const analytics = await fetchTrialAnalytics();

    return NextResponse.json(analytics, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=300", // 5 minutes cache
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[API Error] Failed to fetch trial analytics:", error);

    return NextResponse.json(
      {
        error: {
          status: 500,
          name: "InternalServerError",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch trial analytics",
        },
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
