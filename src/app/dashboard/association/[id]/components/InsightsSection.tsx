"use client";

import { BarChart3 } from "lucide-react";
import { InsightsData } from "@/types/associationDetail";
import EmptyState from "@/components/ui-library/states/EmptyState";

/**
 * InsightsSection Component
 *
 * Insights placeholder component:
 * - Currently empty object (`{}`)
 * - Phase 8 deferred - can be safely ignored for now
 * - Structure defined in types for future implementation
 * - Display message indicating insights coming soon
 */
interface InsightsSectionProps {
  insights: InsightsData;
}

export default function InsightsSection({ insights }: InsightsSectionProps) {
  // Check if insights data is actually populated (Phase 8)
  const hasInsightsData =
    insights.competitionTimeline?.length ||
    insights.activityPatterns?.byMonth?.length ||
    insights.activityPatterns?.bySeason?.length ||
    insights.growthTrends?.competitionsOverTime?.length ||
    insights.growthTrends?.clubsOverTime?.length;

  // If insights data exists, render it (Phase 8 implementation)
  if (hasInsightsData) {
    // TODO: Implement insights visualization when Phase 8 is ready
    return (
      <EmptyState
        title="Insights Available"
        description="Insights data is available but visualization is pending Phase 8 implementation."
        icon={<BarChart3 className="h-12 w-12 text-muted-foreground" />}
        variant="card"
      />
    );
  }

  // Default: Coming soon message
  return (
    <EmptyState
      title="Insights Coming Soon"
      description="Analytics and insights for this association will be available in Phase 8. This will include competition timelines, activity patterns, and growth trends."
      icon={<BarChart3 className="h-12 w-12 text-muted-foreground" />}
      variant="card"
    />
  );
}
