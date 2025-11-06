"use client";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import { TodaysRenders } from "@/types/scheduler";
import { PlayCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LiveOverview() {
  const { data } = useGetTodaysRenders();

  const renderingCount = getRenderingCount(data ?? []);
  const queuedCount = getQueuedCount(data ?? []);

  return (
    <MetricGrid columns={2} gap="lg">
      <StatCard
        title="Accounts Still Rendering"
        value={renderingCount}
        description="From today"
        icon={<PlayCircle className="h-5 w-5" />}
        variant="primary"
        action={
          <Button variant="primary" asChild>
            <Link href="/dashboard/schedulers">View Schedulers</Link>
          </Button>
        }
      />
      <StatCard
        title="Accounts Still Queued"
        value={queuedCount}
        description="From today"
        icon={<Clock className="h-5 w-5" />}
        variant="secondary"
        action={
          <Button variant="primary" asChild>
            <Link href="/dashboard/schedulers">View Schedulers</Link>
          </Button>
        }
      />
    </MetricGrid>
  );
}

// func to work out the number of items where isRendering is true
function getRenderingCount(data: TodaysRenders[]) {
  return data?.filter(item => item.isRendering).length || 0;
}

// func to work out the number of items where queued is false
function getQueuedCount(data: TodaysRenders[]) {
  return data?.filter(item => item.queued).length || 0;
}
