"use client";

import { useSchedulerQuery } from "@/hooks/scheduler/useSchedulerQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { P } from "@/components/type/type";

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

  if (isLoading) return <p>Loading scheduler...</p>;
  if (isError) {
    return (
      <div>
        <p>Error loading scheduler: {error?.message}</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  const daysOfTheWeek =
    scheduler?.attributes.days_of_the_week?.data?.attributes.Name;
  const isRendering = scheduler?.attributes.isRendering;
  const queued = scheduler?.attributes.Queued;

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="w-full">
        <CardContent>
          <CardTitle>
            <P>Day of the Week</P>
          </CardTitle>
          <CardDescription>
            <P>{daysOfTheWeek || "N/A"}</P>
          </CardDescription>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent>
          <CardTitle>
            <P>Is Rendering:</P>
          </CardTitle>
          <CardDescription>
            <P>{isRendering ? "Yes" : "No"}</P>
          </CardDescription>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent>
          <CardTitle>
            <P>Queued</P>
          </CardTitle>
          <CardDescription>
            <P>{queued ? "Yes" : "No"}</P>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
