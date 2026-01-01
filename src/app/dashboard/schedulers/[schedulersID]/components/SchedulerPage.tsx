"use client";

import { useParams } from "next/navigation";
import { useSchedulerByID } from "@/hooks/scheduler/useSchedulerByID";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import StatCard from "@/components/ui-library/metrics/StatCard";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import { Clock, PlayCircle, Calendar, Settings } from "lucide-react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";

const SchedulerPage = () => {
  const { schedulersID } = useParams();
  const { data, isLoading, isError } = useSchedulerByID(Number(schedulersID));

  if (isLoading) return <LoadingState message="Loading scheduler details..." />;
  if (isError || !data) return <ErrorState title="Error" description="Could not load scheduler details" />;

  const { attributes: scheduler } = data;

  return (
    <SectionContainer
      title={scheduler.Name}
      description={`Configuration and status for ${scheduler.Name}`}
      icon={<Settings className="h-5 w-5 text-slate-500" />}
    >
      <MetricGrid columns={4} gap="lg">
        <StatCard
          title="Scheduled Time"
          value={scheduler.Time}
          icon={<Clock className="h-5 w-5" />}
          variant="primary"
          description="Daily execution time"
        />
        <StatCard
          title="Day of Week"
          value={scheduler.days_of_the_week?.data?.attributes?.Name || "N/A"}
          icon={<Calendar className="h-5 w-5" />}
          variant="secondary"
          description="Scheduled day"
        />
        <StatCard
          title="Rendering Status"
          value={scheduler.isRendering ? "Rendering" : "Idle"}
          icon={<PlayCircle className="h-5 w-5" />}
          variant={scheduler.isRendering ? "accent" : "light"}
          action={
            <StatusBadge
              status={scheduler.isRendering}
              trueLabel="Active"
              falseLabel="Idle"
              variant={scheduler.isRendering ? "info" : "neutral"}
            />
          }
        />
        <StatCard
          title="Queue Status"
          value={scheduler.Queued ? "Waiting" : "Clear"}
          icon={<Clock className="h-5 w-5" />}
          variant={scheduler.Queued ? "accent" : "light"}
          action={
            <StatusBadge
              status={scheduler.Queued}
              trueLabel="In Queue"
              falseLabel="Empty"
              variant={scheduler.Queued ? "warning" : "neutral"}
            />
          }
        />
      </MetricGrid>
    </SectionContainer>
  );
};

export default SchedulerPage;
