import { NextResponse } from "next/server";
import { fetchCohortAnalysis } from "@/lib/services/analytics/fetchCohortAnalysis";

/**
 * GET /api/analytics/cohort-analysis
 *
 * Fetches cohort analysis including comprehensive customer cohort analysis with acquisition cohorts,
 * retention analysis, lifecycle stages, revenue patterns, churn analysis, and customer segmentation.
 *
 * @param request - Next.js request object
 * @returns Cohort analysis data or error response
 */
export async function GET() {
  try {
    console.log("[API] GET /api/analytics/cohort-analysis");

    const analytics = await fetchCohortAnalysis();

    return NextResponse.json(analytics, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=600", // 10 minutes cache
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[API Error] Failed to fetch cohort analysis:", error);

    return NextResponse.json(
      {
        error: {
          status: 500,
          name: "InternalServerError",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch cohort analysis",
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
