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
import { FlaskConical, Clock, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

/**
 * TrialPerformancePanel Component
 *
 * Displays the free trial status for the account including activation date,
 * completion date, current status, and conversion information.
 *
 * @param analytics - Account analytics data
 */
export default function TrialPerformancePanel({
  analytics,
}: {
  analytics?: AccountAnalytics;
}) {
  if (!analytics?.trialUsage) {
    return (
      <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const { hasActiveTrial, trialHistory } = analytics.trialUsage;

  // Get the trial (there should only be one)
  const trial =
    trialHistory && trialHistory.length > 0 ? trialHistory[0] : null;

  // Get trial status
  const getTrialStatus = () => {
    if (hasActiveTrial)
      return { text: "Active", color: "bg-emerald-500", icon: CheckCircle };
    if (trial?.converted)
      return { text: "Converted", color: "bg-green-500", icon: CheckCircle };
    if (trial && !hasActiveTrial)
      return { text: "Expired", color: "bg-gray-500", icon: XCircle };
    return { text: "Never Activated", color: "bg-slate-500", icon: Clock };
  };

  const status = getTrialStatus();
  const StatusIcon = status.icon;

  // Calculate duration if trial exists
  const getDuration = () => {
    if (!trial) return null;
    const start = new Date(trial.startDate);
    const end = new Date(trial.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days;
  };

  const duration = getDuration();

  return (
    <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-emerald-500" />
          Free Trial Status
        </CardTitle>
        <CardDescription>
          {trial
            ? hasActiveTrial
              ? "Currently active"
              : trial.converted
              ? "Converted to paid subscription"
              : "Trial completed"
            : "No trial activated"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="p-4 bg-slate-100 border border-slate-300 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <StatusIcon className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium">Status:</span>
            </div>
            <Badge variant="default" className={`${status.color} text-white`}>
              {status.text}
            </Badge>
          </div>

          {trial && (
            <div className="space-y-2 pt-2 border-t border-slate-300">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Activated:</span>
                <span className="font-semibold">
                  {formatDate(trial.startDate)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed:</span>
                <span className="font-semibold">
                  {formatDate(trial.endDate)}
                </span>
              </div>
              {duration !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">
                    {duration} day{duration !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Conversion Information */}
        {trial && !hasActiveTrial && (
          <div
            className={`p-4 rounded-lg border ${
              trial.converted
                ? "bg-green-50 border-green-300"
                : "bg-gray-50 border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {trial.converted ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-green-900">
                    Trial Converted
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-900">
                    Trial Not Converted
                  </p>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {trial.converted
                ? "The free trial was successfully converted to a paid subscription."
                : "The free trial expired without conversion to a paid subscription."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
