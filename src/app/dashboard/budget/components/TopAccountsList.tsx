"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useTopAccountsByCost } from "@/hooks/rollups/useTopAccountsByCost";
import type { TopAccount } from "@/types/rollups";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency } from "@/utils/chart-formatters";
import { getAccountAnalyticsUrl } from "./_utils/navigation";

export default function TopAccountsList({
  period = "current-month" as
    | "current-month"
    | "last-month"
    | "current-year"
    | "all-time",
}) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useTopAccountsByCost({
    period,
    limit: 10,
    sortBy: "totalCost",
    sortOrder: "desc",
  });

  if (isLoading) return <LoadingState message="Loading top accounts..." />;
  if (isError)
    return (
      <ErrorState
        variant="card"
        title="Unable to load top accounts"
        error={error as Error}
      />
    );
  if (!data?.data?.length) return null;

  return (
    <Card className="bg-white border shadow-none">
      <CardHeader className="p-4">
        <CardTitle>Top Accounts by Cost</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-4">
          Period: {data.meta?.period ?? "current-month"} • Showing top{" "}
          {data.meta?.limit ?? 10}
        </div>
        <ul className="space-y-2">
          {data.data.map((a: TopAccount) => (
            <li
              key={a.accountId}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-brandPrimary-300 hover:bg-brandPrimary-50/50 transition-colors cursor-pointer"
              onClick={() => {
                if (a.accountId) {
                  router.push(getAccountAnalyticsUrl(a.accountId));
                }
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate">
                    {a.accountName ?? `Account #${a.accountId}`}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Renders: {a.totalRenders ?? 0} • Avg/Render:{" "}
                  {a.averageCostPerRender != null
                    ? formatCurrency(a.averageCostPerRender)
                    : "-"}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-semibold text-sm">
                  {a.totalCost != null ? formatCurrency(a.totalCost) : "-"}
                </div>
                {typeof a.percentageOfTotal === "number" && (
                  <div className="text-xs text-muted-foreground">
                    {a.percentageOfTotal.toFixed(1)}%
                  </div>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
