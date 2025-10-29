"use client";

import { AccountAnalytics } from "@/types/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";

/**
 * SubscriptionStatusCard Component
 *
 * Displays comprehensive season pass information including current status,
 * active season details, renewal information, and season pass history.
 *
 * @param analytics - Account analytics data
 */
export default function SubscriptionStatusCard({
  analytics,
}: {
  analytics?: AccountAnalytics;
}) {
  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const currentSubscription = analytics?.currentSubscription;

  const isActive = currentSubscription?.isActive || false;
  const daysUntilRenewal = currentSubscription?.endDate
    ? Math.ceil(
        (new Date(currentSubscription.endDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-500" />
            Season Pass Status
          </CardTitle>
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={
              isActive ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Current Season Pass Info */}
        {currentSubscription ? (
          <div className="p-4 bg-slate-100 rounded-lg border border-slate-300">
            <div className="space-y-3">
              {/* Title and Tier */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Season Pass Details
                </span>
                <Badge variant="outline" className="text-xs">
                  {currentSubscription.tier}
                </Badge>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Start Date
                  </p>
                  <p className="text-sm font-semibold">
                    {formatDate(currentSubscription.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">End Date</p>
                  <p className="text-sm font-semibold">
                    {formatDate(currentSubscription.endDate)}
                  </p>
                </div>
              </div>

              {/* Days Remaining */}
              {daysUntilRenewal !== null && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-300">
                  <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {daysUntilRenewal > 0
                      ? `${daysUntilRenewal} days remaining in season`
                      : isActive
                      ? "Season pass expired"
                      : "Renewal overdue"}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No active season pass</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
