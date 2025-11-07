"use client";

import { AccountAnalytics } from "@/types/analytics";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { LoadingState } from "@/components/ui-library";
import { Badge } from "@/components/ui/badge";
import { Label, H4, SubsectionTitle } from "@/components/type/titles";
import { Clock, CheckCircle, XCircle } from "lucide-react";
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
      <LoadingState variant="skeleton" message="Loading trial performance...">
        <SectionContainer title="Free Trial Status" variant="compact">
          <div className="h-32" />
        </SectionContainer>
      </LoadingState>
    );
  }

  const { hasActiveTrial, trialInstance, trialHistory } = analytics.trialUsage;

  // Use trialInstance (current/active trial) if available, otherwise use most recent from history
  const activeTrial = trialInstance;
  const historicalTrial =
    trialHistory && trialHistory.length > 0 ? trialHistory[0] : null;

  // Determine which trial data to use
  const trial = activeTrial || historicalTrial;
  const isFromHistory = !activeTrial && historicalTrial;

  // Get trial status
  const getTrialStatus = () => {
    if (hasActiveTrial && activeTrial)
      return { text: "Active", color: "bg-success-500", icon: CheckCircle };
    if (historicalTrial?.converted)
      return { text: "Converted", color: "bg-success-500", icon: CheckCircle };
    if (historicalTrial && !hasActiveTrial)
      return { text: "Expired", color: "bg-slate-500", icon: XCircle };
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

  // Check if trial was converted (only available in trialHistory)
  const trialConverted = historicalTrial?.converted || false;

  return (
    <SectionContainer
      title="Free Trial Status"
      description={
        trial
          ? hasActiveTrial && activeTrial
            ? "Currently active"
            : trialConverted
            ? "Converted to paid subscription"
            : "Trial completed"
          : "No trial activated"
      }
      variant="compact"
    >
      <div className="space-y-4">
        {/* Status Badge */}
        <ElementContainer variant="dark" border padding="md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <StatusIcon className="w-5 h-5 text-emerald-500" />
              <Label className="text-sm m-0">Status:</Label>
            </div>
            <Badge
              className={`${status.color} text-white border-0 rounded-full`}
            >
              {status.text}
            </Badge>
          </div>

          {trial && (
            <div className="space-y-2 pt-3 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <Label className="text-sm m-0">Activated:</Label>
                <H4 className="text-sm font-semibold m-0">
                  {formatDate(trial.startDate)}
                </H4>
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-sm m-0">Completed:</Label>
                <H4 className="text-sm font-semibold m-0">
                  {formatDate(trial.endDate)}
                </H4>
              </div>
              {duration !== null && (
                <div className="flex justify-between items-center">
                  <Label className="text-sm m-0">Duration:</Label>
                  <H4 className="text-sm font-semibold m-0">
                    {duration} day{duration !== 1 ? "s" : ""}
                  </H4>
                </div>
              )}
            </div>
          )}
        </ElementContainer>

        {/* Conversion Information */}
        {trial && !hasActiveTrial && isFromHistory && (
          <ElementContainer
            variant="light"
            border
            padding="md"
            className={
              trialConverted
                ? "bg-success-50 border-success-300"
                : "bg-slate-50 border-slate-300"
            }
          >
            <div className="flex items-center gap-2 mb-2">
              {trialConverted ? (
                <>
                  <CheckCircle className="w-4 h-4 text-success-600" />
                  <SubsectionTitle className="text-sm m-0 text-success-900">
                    Trial Converted
                  </SubsectionTitle>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-slate-600" />
                  <SubsectionTitle className="text-sm m-0 text-slate-900">
                    Trial Not Converted
                  </SubsectionTitle>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {trialConverted
                ? "The free trial was successfully converted to a paid subscription."
                : "The free trial expired without conversion to a paid subscription."}
            </p>
          </ElementContainer>
        )}
      </div>
    </SectionContainer>
  );
}
