import { NextResponse } from "next/server";
import { fetchGlobalAnalytics } from "@/lib/services/analytics/fetchGlobalAnalytics";

/**
 * GET /api/analytics/global-summary
 *
 * Fetches global analytics summary including system-wide metrics for accounts,
 * subscriptions, trials, revenue, and churn analysis.
 *
 * @param request - Next.js request object
 * @returns Global analytics data or error response
 */
export async function GET() {
  try {
    console.log("[API] GET /api/analytics/global-summary");

    const analytics = await fetchGlobalAnalytics();

    return NextResponse.json(analytics, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=300", // 5 minutes cache
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[API Error] Failed to fetch global analytics:", error);

    return NextResponse.json(
      {
        error: {
          status: 500,
          name: "InternalServerError",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch global analytics",
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
