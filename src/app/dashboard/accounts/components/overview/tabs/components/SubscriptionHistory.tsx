"use client";

import { AccountAnalytics } from "@/types/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { History, TrendingUp, TrendingDown, X, Check } from "lucide-react";

/**
 * SubscriptionHistory Component
 *
 * Displays subscription timeline events including started, renewed, cancelled, upgraded, and downgraded events.
 *
 * @param analytics - Account analytics data
 */
export default function SubscriptionHistory({
  analytics,
}: {
  analytics?: AccountAnalytics;
}) {
  if (!analytics?.subscriptionTimeline?.subscriptionHistory) {
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

  const { subscriptionHistory } = analytics.subscriptionTimeline;

  const getActionIcon = (action: string) => {
    switch (action) {
      case "started":
        return <Check className="w-4 h-4 text-green-500" />;
      case "renewed":
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case "cancelled":
        return <X className="w-4 h-4 text-red-500" />;
      case "upgraded":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "downgraded":
        return <TrendingDown className="w-4 h-4 text-orange-500" />;
      default:
        return <History className="w-4 h-4" />;
    }
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "started":
      case "renewed":
        return "default";
      case "upgraded":
        return "default";
      case "downgraded":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (subscriptionHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            Subscription History
          </CardTitle>
          <CardDescription>No subscription events found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            This account has no subscription history.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <History className="w-5 h-5 text-blue-500" />
          Subscription History
        </CardTitle>
        <CardDescription>
          {subscriptionHistory.length} total events
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {subscriptionHistory.map((event, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Timeline Indicator */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {getActionIcon(event.action)}
                </div>
                {index < subscriptionHistory.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 mt-2" />
                )}
              </div>

              {/* Event Details */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getActionBadgeVariant(event.action || "unknown")}
                    >
                      {(event.action || "unknown").toUpperCase()}
                    </Badge>
                    <span className="font-semibold">{event.tier || "N/A"}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
                {event.amount && event.amount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    ${(event.amount / 100).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
