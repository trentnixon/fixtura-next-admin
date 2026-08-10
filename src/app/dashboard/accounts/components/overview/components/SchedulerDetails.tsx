"use client";
import { useSchedulerQuery } from "@/hooks/scheduler/useSchedulerQuery";
import { LoadingState, ErrorState } from "@/components/ui-library";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarIcon,
  ExternalLinkIcon,
  GitPullRequestArrow,
  PickaxeIcon,
} from "lucide-react";
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

  const schedulerCardTone = "border-slate-200 bg-slate-50 text-slate-800";

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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <Card key={item} className="border shadow-sm">
              <CardContent className="flex items-center gap-3 p-3.5">
                <div className="rounded-md bg-slate-100 p-2">
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="mt-2 h-5 w-24" />
                  <Skeleton className="mt-2 h-3 w-36" />
                </div>
              </CardContent>
            </Card>
          ))}
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
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <Card className={`border shadow-sm ${schedulerCardTone}`}>
        <CardContent className="flex items-center gap-3 p-3.5">
          <div className="rounded-md bg-white/70 p-2">
            <CalendarIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium opacity-75">
              Day of the Week
            </div>
            <div className="truncate text-lg font-bold leading-tight">
              {daysOfTheWeek || "N/A"}
            </div>
            <div className="truncate text-xs opacity-75">
              Last Update: {formatDate(scheduler?.attributes?.updatedAt || "")}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`border shadow-sm ${schedulerCardTone}`}>
        <CardContent className="flex items-center gap-3 p-3.5">
          <div className="rounded-md bg-white/70 p-2">
            <GitPullRequestArrow className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium opacity-75">
              Scheduler Queued?
            </div>
            <div className="flex items-center gap-2">
              <div className="truncate text-lg font-bold leading-tight">
                {queued ? "Yes" : "No"}
              </div>
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
            </div>
            <Label htmlFor="scheduler-queued" className="sr-only">
              Scheduler queued
            </Label>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link
              target="_blank"
              href={`${strapiLocation.scheduler}${scheduler?.id}`}
            >
              <ExternalLinkIcon className="h-4 w-4" />
              Open
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className={`border shadow-sm ${schedulerCardTone}`}>
        <CardContent className="flex items-center gap-3 p-3.5">
          <div className="rounded-md bg-white/70 p-2">
            <PickaxeIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium opacity-75">
              Is Scheduler Rendering?
            </div>
            <div className="flex items-center gap-2">
              <div className="truncate text-lg font-bold leading-tight">
                {isRendering ? "Yes" : "No"}
              </div>
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
              <Label htmlFor="is-rendering" className="sr-only">
                Scheduler rendering
              </Label>
            </div>
            <div className="truncate text-xs opacity-75">
              Total Renders: {accountData?.rollup.totalRenders || "0"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
