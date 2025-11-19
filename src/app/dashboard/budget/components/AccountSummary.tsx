"use client";

import { useState, useEffect } from "react";
import { useAccountRollupsSummary } from "@/hooks/rollups/useAccountRollupsSummary";
import { useAccountMonthlyRollupsRange } from "@/hooks/rollups/useAccountMonthlyRollupsRange";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency, formatNumber } from "./_utils/formatCurrency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AccountSummaryProps {
  accountId: number;
}

// Helper function to format dates consistently (prevents hydration mismatch)
function formatDateString(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default function AccountSummary({ accountId }: AccountSummaryProps) {
  const {
    data: summaryData,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryErr,
  } = useAccountRollupsSummary(accountId);

  // Get last 12 months for trend - calculate only on client to prevent hydration mismatch
  const [dateRange, setDateRange] = useState<{
    startYear: number;
    startMonth: number;
    endYear: number;
    endMonth: number;
  } | null>(null);

  useEffect(() => {
    const now = new Date();
    const startYear = now.getFullYear();
    const startMonth = now.getMonth() - 11;
    const endYear = now.getFullYear();
    const endMonth = now.getMonth() + 1;
    const adjustedStartYear = startMonth < 0 ? startYear - 1 : startYear;
    const adjustedStartMonth =
      startMonth < 0 ? startMonth + 12 : startMonth + 1;

    setDateRange({
      startYear: adjustedStartYear,
      startMonth: adjustedStartMonth,
      endYear,
      endMonth,
    });
  }, []);

  const { data: monthlyData } = useAccountMonthlyRollupsRange(
    accountId,
    dateRange
      ? {
          startYear: dateRange.startYear,
          startMonth: dateRange.startMonth,
          endYear: dateRange.endYear,
          endMonth: dateRange.endMonth,
          limit: 12,
        }
      : { startYear: 0, startMonth: 0, endYear: 0, endMonth: 0, limit: 12 }
  );

  const totalMonthlyCost =
    monthlyData?.reduce((sum, m) => sum + (m.totalCost ?? 0), 0) ?? 0;

  return (
    <Card className="bg-white border shadow-none">
      <CardHeader className="p-4">
        <CardTitle>Account Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {summaryLoading && (
          <LoadingState message="Loading account summary..." />
        )}
        {summaryError && (
          <ErrorState
            variant="card"
            title="Unable to load account summary"
            error={summaryErr as Error}
          />
        )}
        {summaryData && (
          <div className="space-y-6">
            {/* Totals & Monthly Trend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat
                label="Total Cost (All Time)"
                value={formatCurrency(summaryData.totals.totalCost)}
              />
              <Stat
                label="Total Renders"
                value={formatNumber(summaryData.totals.totalRenders)}
              />
              <Stat
                label="Total Schedulers"
                value={formatNumber(summaryData.totals.totalSchedulers)}
              />
              <Stat
                label="12-Month Total"
                value={formatCurrency(totalMonthlyCost)}
              />
            </div>

            {/* Recent Renders */}
            {summaryData.recentRenders &&
              summaryData.recentRenders.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Recent Renders</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Render ID</TableHead>
                          <TableHead>Completed</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                          <TableHead className="text-right">Assets</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {summaryData.recentRenders.slice(0, 5).map((render) => (
                          <TableRow key={render.id}>
                            <TableCell className="font-mono text-sm">
                              {render.renderId}
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDateString(render.completedAt)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(render.totalCost)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatNumber(render.totalDigitalAssets)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

            {/* Schedulers */}
            {summaryData.recentSchedulers &&
              summaryData.recentSchedulers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">
                    Recent Schedulers
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {summaryData.recentSchedulers.map((scheduler, idx) => (
                      <div
                        key={scheduler.schedulerId || idx}
                        className="px-3 py-1 bg-muted rounded-md text-sm font-mono"
                      >
                        #{scheduler.schedulerId || "N/A"}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
        {!summaryData && !summaryLoading && !summaryError && (
          <div className="text-sm text-muted-foreground text-center py-8">
            No data available for this account
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}
