"use client";
import { useSchedulerQuery } from "@/hooks/scheduler/useSchedulerQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { P } from "@/components/type/type";
import { CalendarIcon, GitPullRequestArrow, PickaxeIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useSchedulerUpdate } from "@/hooks/scheduler/useSchedulerUpdate";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import Link from "next/link";

export default function SchedulerDetailsGrid({
  schedulerId,
}: {
  schedulerId: string;
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

  if (isLoading) return <p>Loading scheduler...</p>;
  if (isError) {
    return (
      <div>
        <p>Error loading scheduler: {error?.message}</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  const handleRenderingSwitchChange = (newState: boolean) => {
    setIsRendering(newState);
    console.log({
      schedulerId: Number(scheduler?.id) || 0,
      payload: { isRendering: newState },
    });
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
    <div className="grid grid-cols-3 gap-4">
      {/* Day of the Week Card */}
      <Card className="w-full shadow-none bg-slate-50 border-b-4 border-b-emerald-500">
        <CardContent className="p-2">
          <CardDescription className="flex items-center justify-between w-full">
            <P>{daysOfTheWeek || "N/A"}</P>
            <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />
          </CardDescription>
        </CardContent>
        <CardHeader className="p-2">
          <CardTitle>Day of the Week</CardTitle>
          <CardDescription>
            Last Update:{" "}
            {new Date(
              scheduler?.attributes?.updatedAt || ""
            ).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "2-digit",
            })}
          </CardDescription>
        </CardHeader>
      </Card>
      {/* Queued Card */}
      <Card className="w-full shadow-none bg-slate-50 border-b-4 border-b-emerald-500">
        <CardContent className="p-2">
          <CardDescription className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Switch
                id="scheduler-queued"
                checked={queued}
                onCheckedChange={handleQueuedSwitchChange}
                disabled={isUpdating}
                className={
                  queued
                    ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    : "data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                }
              />
              <Label htmlFor="scheduler-queued">{queued ? "Yes" : "No"}</Label>
            </div>
            <GitPullRequestArrow className="w-6 h-6 ml-2 text-emerald-500" />
          </CardDescription>
        </CardContent>
        <CardHeader className="p-2">
          <CardTitle>
            <P>Scheduler Queued?</P>
          </CardTitle>
          <Button variant="outline">
            <Link
              target="_blank"
              href={`${strapiLocation.scheduler}${scheduler?.id}`}>
              Go To Scheduler
            </Link>
          </Button>
        </CardHeader>
      </Card>
      {/* Is Rendering Card */}
      <Card className="w-full shadow-none bg-slate-50 border-b-4 border-b-emerald-500">
        <CardContent className="p-2">
          <CardDescription className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Switch
                id="is-rendering"
                checked={isRendering}
                onCheckedChange={handleRenderingSwitchChange}
                disabled={isUpdating}
                className={
                  isRendering
                    ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    : "data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                }
              />
              <Label htmlFor="is-rendering">{isRendering ? "Yes" : "No"}</Label>
            </div>
            <PickaxeIcon className="w-6 h-6 ml-2 text-emerald-500" />
          </CardDescription>
        </CardContent>
        <CardHeader className="p-2">
          <CardTitle>
            <P>Is Scheduler Rendering?</P>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
