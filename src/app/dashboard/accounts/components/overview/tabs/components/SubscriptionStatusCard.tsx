"use client";

import { AccountAnalytics } from "@/types/analytics";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { LoadingState, EmptyState } from "@/components/ui-library";
import { Badge } from "@/components/ui/badge";
import { Label, H4, SubsectionTitle } from "@/components/type/titles";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

/**
 * SubscriptionStatusCard Component
 *
 * Displays comprehensive season pass information including current status,
 * active season details, renewal information, and season pass history.
 *
 * @param analytics - Account analytics data
 */

// Helper function to safely format dates, handling null/undefined/invalid dates
const safeFormatDate = (date: string | null | undefined): string => {
  if (!date) return "—";

  const dateObj = new Date(date);
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "—";
  }

  // Check if date is epoch (January 1, 1970) - common invalid date
  // Also check if date is before 2000 (likely invalid for this application)
  const epochTime = new Date("1970-01-01T00:00:00Z").getTime();
  const minReasonableDate = new Date("2000-01-01T00:00:00Z").getTime();
  const dateTime = dateObj.getTime();

  // If the date is epoch (or very close to it) or before 2000, treat as invalid
  if (dateTime <= epochTime || dateTime < minReasonableDate) {
    return "—";
  }

  return formatDate(date);
};

export default function SubscriptionStatusCard({
  analytics,
}: {
  analytics?: AccountAnalytics;
}) {
  if (!analytics) {
    return (
      <LoadingState variant="skeleton" message="Loading subscription status...">
        <SectionContainer title="Season Pass Status" variant="compact">
          <div className="h-32" />
        </SectionContainer>
      </LoadingState>
    );
  }

  const currentSubscription = analytics?.currentSubscription;

  const isActive = currentSubscription?.isActive || false;

  // Safely calculate days until renewal, checking for valid dates
  const daysUntilRenewal = currentSubscription?.endDate
    ? (() => {
        const endDate = new Date(currentSubscription.endDate);
        if (isNaN(endDate.getTime())) {
          return null;
        }
        // Check if date is epoch or before a reasonable minimum date
        const epochTime = new Date("1970-01-01T00:00:00Z").getTime();
        const minReasonableDate = new Date("2000-01-01T00:00:00Z").getTime();
        const dateTime = endDate.getTime();
        if (dateTime <= epochTime || dateTime < minReasonableDate) {
          return null;
        }
        return Math.ceil(
          (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
      })()
    : null;

  return (
    <SectionContainer
      title="Season Pass Status"
      variant="compact"
      action={
        <Badge
          className={`${
            isActive ? "bg-success-500" : "bg-slate-500"
          } text-white border-0 rounded-full`}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      }
    >
      {currentSubscription ? (
        <ElementContainer variant="dark" border padding="md">
          <div className="space-y-4">
            {/* Title and Tier */}
            <div className="flex items-center justify-between">
              <SubsectionTitle className="m-0">
                Season Pass Details
              </SubsectionTitle>
              <Badge variant="outline" className="text-xs rounded-full">
                {currentSubscription.tier}
              </Badge>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Start Date</Label>
                <H4 className="text-sm font-semibold m-0">
                  {safeFormatDate(currentSubscription.startDate)}
                </H4>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">End Date</Label>
                <H4 className="text-sm font-semibold m-0">
                  {safeFormatDate(currentSubscription.endDate)}
                </H4>
              </div>
            </div>

            {/* Days Remaining */}
            {daysUntilRenewal !== null && (
              <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <H4 className="text-sm font-medium m-0">
                  {daysUntilRenewal > 0
                    ? `${daysUntilRenewal} days remaining in season`
                    : isActive
                    ? "Season pass expired"
                    : "Renewal overdue"}
                </H4>
              </div>
            )}
          </div>
        </ElementContainer>
      ) : (
        <EmptyState title="No active season pass" variant="minimal" />
      )}
    </SectionContainer>
  );
}
