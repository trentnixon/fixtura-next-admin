"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ExternalLink,
  Film,
  GitPullRequestArrow,
  Pickaxe,
} from "lucide-react";
import { useSchedulerQuery } from "@/hooks/scheduler/useSchedulerQuery";
import { useSchedulerUpdate } from "@/hooks/scheduler/useSchedulerUpdate";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { formatDate } from "@/lib/utils";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";

type AccountSchedulerStatusProps = {
  accountData: fixturaContentHubAccountDetails;
};

type StatusRowProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  action?: ReactNode;
};

export default function AccountSchedulerStatus({
  accountData,
}: AccountSchedulerStatusProps) {
  const schedulerId = accountData.scheduler?.id;
  const { strapiLocation } = useGlobalContext();
  const {
    data: scheduler,
    isLoading,
    isError,
  } = useSchedulerQuery(schedulerId ?? 0);
  const { mutate: updateScheduler, isPending: isUpdating } =
    useSchedulerUpdate();

  const [isRendering, setIsRendering] = useState(false);
  const [queued, setQueued] = useState(false);

  useEffect(() => {
    if (scheduler) {
      setIsRendering(scheduler.attributes.isRendering);
      setQueued(scheduler.attributes.Queued);
    }
  }, [scheduler]);

  const totalRenders = accountData.rollup?.totalRenders ?? 0;

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

  if (!schedulerId) {
    return (
      <StatusGroup>
        <StatusRow
          icon={<CalendarDays className="h-4 w-4" />}
          label="Scheduler"
          value={
            <span className="text-sm font-medium text-muted-foreground">
              Not linked
            </span>
          }
        />
      </StatusGroup>
    );
  }

  if (isLoading) {
    return (
      <StatusGroup>
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="flex items-start gap-3 px-4 py-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        ))}
      </StatusGroup>
    );
  }

  if (isError || !scheduler) {
    return (
      <StatusGroup>
        <StatusRow
          icon={<CalendarDays className="h-4 w-4" />}
          label="Scheduler"
          value={
            <span className="text-sm font-medium text-brandError-700">
              Failed to load
            </span>
          }
        />
      </StatusGroup>
    );
  }

  const dayOfWeek =
    scheduler.attributes.days_of_the_week?.data?.attributes.Name ?? "N/A";
  const lastUpdate = formatDate(scheduler.attributes.updatedAt || "");

  return (
    <StatusGroup>
      <StatusRow
        icon={<CalendarDays className="h-4 w-4" />}
        label="Day of the week"
        value={
          <span className="text-lg font-semibold leading-none text-slate-950">
            {dayOfWeek}
          </span>
        }
        detail={`Last update: ${lastUpdate}`}
      />

      <StatusRow
        icon={<GitPullRequestArrow className="h-4 w-4" />}
        label="Scheduler queued"
        value={
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold leading-none text-slate-950">
              {queued ? "Yes" : "No"}
            </span>
            <Switch
              id="sidebar-scheduler-queued"
              checked={queued}
              onCheckedChange={handleQueuedSwitchChange}
              disabled={isUpdating}
              className={
                queued
                  ? "data-[state=checked]:bg-success-500 data-[state=checked]:border-success-500"
                  : "data-[state=checked]:bg-slate-500 data-[state=checked]:border-slate-500"
              }
            />
            <Label htmlFor="sidebar-scheduler-queued" className="sr-only">
              Scheduler queued
            </Label>
          </div>
        }
        action={
          <Button variant="outline" size="sm" className="h-7 px-2" asChild>
            <Link
              target="_blank"
              href={`${strapiLocation.scheduler}${scheduler.id}`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open
            </Link>
          </Button>
        }
      />

      <StatusRow
        icon={<Pickaxe className="h-4 w-4" />}
        label="Scheduler rendering"
        value={
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold leading-none text-slate-950">
              {isRendering ? "Yes" : "No"}
            </span>
            <Switch
              id="sidebar-scheduler-rendering"
              checked={isRendering}
              onCheckedChange={handleRenderingSwitchChange}
              disabled={isUpdating}
              className={
                isRendering
                  ? "data-[state=checked]:bg-success-500 data-[state=checked]:border-success-500"
                  : "data-[state=checked]:bg-slate-500 data-[state=checked]:border-slate-500"
              }
            />
            <Label htmlFor="sidebar-scheduler-rendering" className="sr-only">
              Scheduler rendering
            </Label>
          </div>
        }
      />

      <StatusRow
        icon={<Film className="h-4 w-4" />}
        label="Total renders"
        value={
          <span className="text-lg font-semibold leading-none text-slate-950 tabular-nums">
            {totalRenders}
          </span>
        }
      />
    </StatusGroup>
  );
}

function StatusGroup({ children }: { children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Status
      </p>
      <div className="divide-y divide-slate-200 overflow-hidden rounded-md border border-slate-200 bg-white">
        {children}
      </div>
    </div>
  );
}

function StatusRow({ icon, label, value, detail, action }: StatusRowProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5">{value}</div>
        {detail && (
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        )}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
