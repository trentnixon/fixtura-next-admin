"use client";

import { useAccountAnalytics } from "@/hooks/analytics/useAccountAnalytics";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui-library";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListInverseClass,
  sectionTabTriggerInverseClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import { FlaskConical, Ticket } from "lucide-react";
import SubscriptionStatusCard from "./SubscriptionStatusCard";
import OrderHistoryTable from "./OrderHistoryTable";
import TrialHistory from "./TrialHistory";
import TrialSummaryCards from "./TrialSummaryCards";
import RemoveFreeTrialButton from "./RemoveFreeTrialButton";

const FINANCIAL_CHILD_TABS = [
  { id: "subscription", label: "Subscription", icon: Ticket },
  { id: "trials", label: "Trials", icon: FlaskConical },
] as const;

/**
 * AccountAnalyticsCards Component
 *
 * Displays comprehensive account-specific analytics including order history,
 * subscription timeline, trial usage, payment status, renewal patterns, and account health scoring.
 *
 * @param accountId - The account ID to fetch analytics for
 */
export default function AccountAnalyticsCards({
  accountId,
}: {
  accountId: number;
}) {
  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    error: analyticsError,
  } = useAccountAnalytics(accountId.toString());

  const status = renderAnalyticsStatus({
    isLoading: isAnalyticsLoading,
    error: analyticsError,
    hasData: Boolean(analyticsData),
  });

  const hasActiveOrder = analyticsData?.currentSubscription?.isActive || false;

  return (
    <Tabs defaultValue="subscription" className="w-full">
      <TabsList
        variant="sectionInverse"
        className={cn(sectionTabListInverseClass, "mb-4")}
      >
        {FINANCIAL_CHILD_TABS.map((tab) => {
          const Icon = tab.icon;

          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              variant="sectionInverse"
              className={sectionTabTriggerInverseClass}
            >
              <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="subscription" className="mt-0 space-y-6">
        {status ?? (
          <>
            {!hasActiveOrder && (
              <div className="flex justify-end">
                <Button variant="primary" asChild>
                  <Link href={`/dashboard/orders/create/${accountId}`}>
                    Create Invoice
                  </Link>
                </Button>
              </div>
            )}

            <SubscriptionStatusCard analytics={analyticsData} />
            <OrderHistoryTable analytics={analyticsData} />
          </>
        )}
      </TabsContent>

      <TabsContent value="trials" className="mt-0 space-y-6">
        <RemoveFreeTrialButton clientId={accountId} />
        {status ??
          (analyticsData ? (
            <>
              <TrialSummaryCards analytics={analyticsData} />
              <TrialHistory analytics={analyticsData} />
            </>
          ) : null)}
      </TabsContent>
    </Tabs>
  );
}

function renderAnalyticsStatus({
  isLoading,
  error,
  hasData,
}: {
  isLoading: boolean;
  error: Error | null;
  hasData: boolean;
}) {
  if (isLoading) {
    return (
      <LoadingState variant="skeleton" message="Loading account analytics...">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Error Loading Analytics"
        variant="card"
      />
    );
  }

  if (!hasData) {
    return (
      <EmptyState
        title="Account Analytics"
        description="No analytics data available. Unable to load analytics for this account. Please try again later."
        variant="card"
      />
    );
  }

  return null;
}
