import { NextResponse } from "next/server";
import { fetchRevenueAnalytics } from "@/lib/services/analytics/fetchRevenueAnalytics";

/**
 * GET /api/analytics/revenue-analytics
 *
 * Fetches revenue analytics including comprehensive revenue analysis with monthly/quarterly trends,
 * revenue by subscription tier, payment method analysis, billing cycles, revenue projections,
 * customer lifetime value, and seasonal patterns.
 *
 * @param request - Next.js request object
 * @returns Revenue analytics data or error response
 */
export async function GET() {
  try {
    console.log("[API] GET /api/analytics/revenue-analytics");

    const analytics = await fetchRevenueAnalytics();

    return NextResponse.json(analytics, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=300", // 5 minutes cache
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[API Error] Failed to fetch revenue analytics:", error);

    return NextResponse.json(
      {
        error: {
          status: 500,
          name: "InternalServerError",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch revenue analytics",
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
