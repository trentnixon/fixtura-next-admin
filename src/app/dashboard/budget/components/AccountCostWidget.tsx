"use client";

import { useAccountCurrentMonthRollup } from "@/hooks/rollups/useAccountCurrentMonthRollup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency, formatNumber } from "./_utils/formatCurrency";

interface AccountCostWidgetProps {
  accountId: number;
}

export default function AccountCostWidget({ accountId }: AccountCostWidgetProps) {
  const { data, isLoading, isError, error } =
    useAccountCurrentMonthRollup(accountId);

  return (
    <Card className="bg-white border shadow-none">
      <CardHeader className="p-4">
        <CardTitle>Account Cost (Current Month)</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading && (
          <LoadingState message="Loading account cost data..." />
        )}
        {isError && (
          <ErrorState
            variant="card"
            title="Unable to load account cost"
            error={error as Error}
          />
        )}
        {data && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Stat
                label="Total Cost"
                value={formatCurrency(data.totalCost)}
              />
              <Stat
                label="Total Renders"
                value={formatNumber(data.totalRenders)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Stat
                label="Lambda Cost"
                value={formatCurrency(data.costBreakdown?.global?.lambda)}
              />
              <Stat
                label="AI Cost"
                value={formatCurrency(data.costBreakdown?.global?.ai)}
              />
            </div>
            <div className="pt-4 border-t text-sm text-muted-foreground">
              Period: {data.periodStart} to {data.periodEnd}
              {data.isCurrentPeriod && (
                <span className="ml-2 text-green-600">(Current)</span>
              )}
            </div>
          </div>
        )}
        {!data && !isLoading && !isError && (
          <div className="text-sm text-muted-foreground text-center py-4">
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
