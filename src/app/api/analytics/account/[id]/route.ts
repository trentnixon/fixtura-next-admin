import { NextResponse } from "next/server";
import { fetchAccountAnalytics } from "@/lib/services/analytics/fetchAccountAnalytics";

/**
 * GET /api/analytics/account/[id]
 *
 * Fetches account-specific analytics including detailed insights for individual accounts:
 * order history, subscription timeline, trial usage, payment status, renewal patterns,
 * and account health scoring.
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing the account ID
 * @returns Account analytics data or error response
 */
export async function GET(
  _request: unknown,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const accountId = resolvedParams.id;
    console.log("[API] GET /api/analytics/account/[id]", { accountId });

    if (!accountId) {
      return NextResponse.json(
        {
          error: {
            status: 400,
            name: "BadRequest",
            message: "Account ID is required",
          },
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const analytics = await fetchAccountAnalytics(accountId);

    return NextResponse.json(analytics, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60", // 1 minute cache
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[API Error] Failed to fetch account analytics:", error);

    return NextResponse.json(
      {
        error: {
          status: 500,
          name: "InternalServerError",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch account analytics",
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
