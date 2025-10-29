import { NextResponse } from "next/server";
import { fetchSubscriptionTrends } from "@/lib/services/analytics/fetchSubscriptionTrends";

/**
 * GET /api/analytics/subscription-trends
 *
 * Fetches subscription trends analytics including subscription lifecycle patterns,
 * renewal vs churn rates, tier migration trends, subscription duration patterns,
 * and customer journey analysis.
 *
 * @param request - Next.js request object
 * @returns Subscription trends analytics data or error response
 */
export async function GET() {
  try {
    console.log("[API] GET /api/analytics/subscription-trends");

    const analytics = await fetchSubscriptionTrends();

    return NextResponse.json(analytics, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=600", // 10 minutes cache
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[API Error] Failed to fetch subscription trends:", error);

    return NextResponse.json(
      {
        error: {
          status: 500,
          name: "InternalServerError",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch subscription trends",
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
