"use client";
import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import { Calendar, PlayCircle, Clock } from "lucide-react";

export function SchedulerRollupData() {
  const { data } = useSchedulerRollup();

  return (
    <MetricGrid columns={3} gap="lg">
      <StatCard
        title="Number of Schedulers"
        value={data?.numberOfSchedulers || 0}
        icon={<Calendar className="h-5 w-5" />}
        variant="primary"
      />
      <StatCard
        title="Number of Schedulers Rendering"
        value={data?.numberOfSchedulersRendering || 0}
        icon={<PlayCircle className="h-5 w-5" />}
        variant="secondary"
      />
      <StatCard
        title="Number of Schedulers Queued"
        value={data?.numberOfSchedulersQueued || 0}
        icon={<Clock className="h-5 w-5" />}
        variant="accent"
      />
    </MetricGrid>
  );
}
