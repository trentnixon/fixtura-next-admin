"use client";
import { useSchedulerQuery } from "@/hooks/scheduler/useSchedulerQuery";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { LoadingState, ErrorState } from "@/components/ui-library";
import { Skeleton } from "@/components/ui/skeleton";
import { H4, ByLine } from "@/components/type/titles";
import { CalendarIcon, GitPullRequestArrow, PickaxeIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useSchedulerUpdate } from "@/hooks/scheduler/useSchedulerUpdate";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import Link from "next/link";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import { formatDate } from "@/lib/utils";

export default function SchedulerDetailsGrid({
  schedulerId,
  accountData,
}: {
  schedulerId: number;
  accountData: fixturaContentHubAccountDetails;
}) {
  const {
    data: scheduler,
    isLoading,
    isError,
    error,
  } = useSchedulerQuery(schedulerId);
  const { mutate: updateScheduler, isPending: isUpdating } =
    useSchedulerUpdate();

  const [isRendering, setIsRendering] = useState(false);
  const [queued, setQueued] = useState(false);
  const { strapiLocation } = useGlobalContext();
  // Initialize local state when scheduler data is available
  useEffect(() => {
    if (scheduler) {
      setIsRendering(scheduler.attributes.isRendering);
      setQueued(scheduler.attributes.Queued);
    }
  }, [scheduler]);

  if (isLoading) {
    return (
      <LoadingState variant="skeleton" message="Loading scheduler details...">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SectionContainer title="Day of the Week" variant="compact">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          </SectionContainer>
          <SectionContainer title="Scheduler Queued?" variant="compact">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-10 rounded-full" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <Skeleton className="h-9 w-32" />
            </div>
          </SectionContainer>
          <SectionContainer title="Is Scheduler Rendering?" variant="compact">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-10 rounded-full" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          </SectionContainer>
        </div>
      </LoadingState>
    );
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title="Error Loading Scheduler"
        variant="card"
      />
    );
  }

  const handleRenderingSwitchChange = (newState: boolean) => {
    setIsRendering(newState);
    updateScheduler({
      schedulerId: Number(scheduler?.id) || 0,
      payload: { isRendering: newState },
    });
  };

  const handleQueuedSwitchChange = (newState: boolean) => {
    setQueued(newState);
    updateScheduler({
      schedulerId: Number(scheduler?.id) || 0,
      payload: { Queued: newState },
    });
  };

  const daysOfTheWeek =
    scheduler?.attributes.days_of_the_week?.data?.attributes.Name;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Day of the Week Card */}
      <SectionContainer title="Day of the Week" variant="compact">
        <div className="flex items-center justify-between">
          <H4 className="text-lg font-semibold m-0">
            {daysOfTheWeek || "N/A"}
          </H4>
          <CalendarIcon className="w-6 h-6 text-emerald-500 flex-shrink-0" />
        </div>
        <ByLine className="mt-2 mb-0">
          Last Update: {formatDate(scheduler?.attributes?.updatedAt || "")}
        </ByLine>
      </SectionContainer>

      {/* Queued Card */}
      <SectionContainer title="Scheduler Queued?" variant="compact">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Switch
              id="scheduler-queued"
              checked={queued}
              onCheckedChange={handleQueuedSwitchChange}
              disabled={isUpdating}
              className={
                queued
                  ? "data-[state=checked]:bg-success-500 data-[state=checked]:border-success-500"
                  : "data-[state=checked]:bg-slate-500 data-[state=checked]:border-slate-500"
              }
            />
            <Label htmlFor="scheduler-queued" className="m-0">
              {queued ? "Yes" : "No"}
            </Label>
          </div>
          <GitPullRequestArrow className="w-6 h-6 text-emerald-500 flex-shrink-0" />
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link
            target="_blank"
            href={`${strapiLocation.scheduler}${scheduler?.id}`}
          >
            Go To Scheduler
          </Link>
        </Button>
      </SectionContainer>

      {/* Is Rendering Card */}
      <SectionContainer title="Is Scheduler Rendering?" variant="compact">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Switch
              id="is-rendering"
              checked={isRendering}
              onCheckedChange={handleRenderingSwitchChange}
              disabled={isUpdating}
              className={
                isRendering
                  ? "data-[state=checked]:bg-success-500 data-[state=checked]:border-success-500"
                  : "data-[state=checked]:bg-slate-500 data-[state=checked]:border-slate-500"
              }
            />
            <Label htmlFor="is-rendering" className="m-0">
              {isRendering ? "Yes" : "No"}
            </Label>
          </div>
          <PickaxeIcon className="w-6 h-6 text-emerald-500 flex-shrink-0" />
        </div>
        <ByLine className="m-0">
          Total Renders: {accountData?.rollup.totalRenders || "0"}
        </ByLine>
      </SectionContainer>
    </div>
  );
}
