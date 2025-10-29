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
import { Activity, Calendar, DollarSign, AlertCircle } from "lucide-react";

interface TimelineEvent {
  date: Date;
  type: "creation" | "subscription" | "payment" | "trial" | "renewal";
  title: string;
  description: string;
  amount?: number;
  status?: string;
}

/**
 * AccountTimeline Component
 *
 * Displays a chronological timeline of all major account events including creation,
 * subscriptions, trials, payments, and renewals.
 *
 * @param analytics - Account analytics data
 */
export default function AccountTimeline({
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
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Build timeline events
  const events: TimelineEvent[] = [];

  // Account creation
  if (analytics.createdAt) {
    events.push({
      date: new Date(analytics.createdAt),
      type: "creation",
      title: "Account Created",
      description: `Account type: ${analytics.accountType || "N/A"}`,
    });
  }

  // Subscription events
  if (analytics.subscriptionTimeline?.subscriptionHistory) {
    analytics.subscriptionTimeline.subscriptionHistory.forEach((event) => {
      events.push({
        date: new Date(event.date),
        type: "subscription",
        title: `Subscription ${event.action}`,
        description: `Tier: ${event.tier}`,
        amount: event.amount,
      });
    });
  }

  // Trial events
  if (analytics.trialUsage?.trialHistory) {
    analytics.trialUsage.trialHistory.forEach((trial) => {
      events.push({
        date: new Date(trial.startDate),
        type: "trial",
        title: "Trial Started",
        description: `Subscription tier: ${trial.subscriptionTier}`,
      });

      if (trial.converted) {
        events.push({
          date: new Date(trial.endDate),
          type: "trial",
          title: "Trial Converted",
          description: "Converted to paid subscription",
        });
      }
    });
  }

  // Recent payments from order history
  if (analytics.orderHistory?.orders) {
    const recentOrders = analytics.orderHistory.orders.slice(0, 5);
    recentOrders.forEach((order) => {
      events.push({
        date: new Date(order.date),
        type: "payment",
        title: `Payment ${order.status}`,
        description: `${order.subscriptionTier} • ${order.paymentMethod}`,
        amount: order.amount,
      });
    });
  }

  // Sort events by date (most recent first)
  events.sort((a, b) => b.date.getTime() - a.date.getTime());

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "creation":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "subscription":
      case "renewal":
        return <Activity className="w-4 h-4 text-green-500" />;
      case "payment":
        return <DollarSign className="w-4 h-4 text-purple-500" />;
      case "trial":
        return <Calendar className="w-4 h-4 text-orange-500" />;
    }
  };

  const getEventColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "creation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "subscription":
      case "renewal":
        return "bg-green-100 text-green-800 border-green-200";
      case "payment":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "trial":
        return "bg-orange-100 text-orange-800 border-orange-200";
    }
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Account Timeline
          </CardTitle>
          <CardDescription>No events found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            No account events to display.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Account Timeline
        </CardTitle>
        <CardDescription>
          {events.length} events • Most recent at top
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {events.map((event, index) => (
            <div key={index} className="flex gap-4 relative">
              {/* Timeline Line */}
              {index < events.length - 1 && (
                <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200" />
              )}

              {/* Event Icon */}
              <div className="flex-shrink-0 z-10">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${getEventColor(
                    event.type
                  )}`}
                >
                  {getEventIcon(event.type)}
                </div>
              </div>

              {/* Event Content */}
              <div className="flex-1 pb-4">
                <div
                  className={`p-3 rounded-lg border ${getEventColor(
                    event.type
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{event.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{event.description}</p>
                  {event.amount && (
                    <p className="text-sm font-semibold mt-1">
                      ${event.amount.toLocaleString()}
                    </p>
                  )}
                  {event.status && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-white/50">
                      {event.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
