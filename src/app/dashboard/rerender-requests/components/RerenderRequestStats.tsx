"use client";

import { useMemo } from "react";
import { RerenderRequest } from "@/types/rerender-request";
import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import {
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

interface RerenderRequestStatsProps {
  requests: RerenderRequest[];
}

/**
 * Rerender Request Stats Component
 *
 * Displays summary statistics for rerender requests.
 * Shows overview metrics including total, pending, handled, and status breakdowns.
 */
export default function RerenderRequestStats({
  requests,
}: RerenderRequestStatsProps) {
  // Calculate stats
  const stats = useMemo(() => {
    const total = requests.length;
    const handled = requests.filter((r) => r.hasBeenHandled).length;
    const unhandled = total - handled;

    // Status breakdown
    const pending = requests.filter(
      (r) => r.status?.toLowerCase() === "pending"
    ).length;
    const processing = requests.filter(
      (r) => r.status?.toLowerCase() === "processing"
    ).length;
    const completed = requests.filter(
      (r) => r.status?.toLowerCase() === "completed"
    ).length;
    const rejected = requests.filter(
      (r) => r.status?.toLowerCase() === "rejected"
    ).length;

    // Recent requests (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = requests.filter((r) => {
      if (!r.createdAt) return false;
      const date = new Date(r.createdAt);
      return date >= sevenDaysAgo;
    }).length;

    return {
      total,
      handled,
      unhandled,
      pending,
      processing,
      completed,
      rejected,
      recent,
    };
  }, [requests]);

  return (
    <MetricGrid columns={4} gap="md">
      <StatCard
        title="Total Requests"
        value={stats.total}
        icon={<RefreshCw className="w-5 h-5" />}
        description={`${stats.recent} in last 7 days`}
        variant="primary"
      />
      <StatCard
        title="Unhandled"
        value={stats.unhandled}
        icon={<AlertCircle className="w-5 h-5" />}
        description={`${stats.total > 0 ? Math.round((stats.unhandled / stats.total) * 100) : 0}% of total`}
        variant={stats.unhandled > 0 ? "accent" : "light"}
      />
      <StatCard
        title="Handled"
        value={stats.handled}
        icon={<CheckCircle2 className="w-5 h-5" />}
        description={`${stats.total > 0 ? Math.round((stats.handled / stats.total) * 100) : 0}% of total`}
        variant="secondary"
      />
      <StatCard
        title="Pending Status"
        value={stats.pending}
        icon={<Clock className="w-5 h-5" />}
        description={`${stats.processing} processing, ${stats.completed} completed`}
        variant="light"
      />
    </MetricGrid>
  );
}

