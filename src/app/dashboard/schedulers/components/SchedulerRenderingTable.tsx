"use client";

import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { ActiveRendersTable } from "./ActiveRendersTable";
import { SystemQueueTable } from "./SystemQueueTable";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export function SchedulerRenderingTable() {
  const { data, isError, isLoading } = useSchedulerRollup();
  const { strapiLocation } = useGlobalContext();

  const renderingItems = data?.ListOfSchedulersRenderingWithIDS || [];
  const queuedItems = data?.ListOfSchedulersQueuedWithIDS || [];

  if (isError) {
    return (
      <div className="flex items-start gap-3 rounded-md border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <div className="font-semibold">Live queue unavailable</div>
          <div className="text-xs">
            The active render and system queue data could not be loaded.
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 p-4">
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="space-y-3 p-4">
                {Array.from({ length: 4 }).map((__, rowIndex) => (
                  <Skeleton key={rowIndex} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <ActiveRendersTable
        items={renderingItems}
        strapiLocation={strapiLocation}
      />
      <SystemQueueTable items={queuedItems} strapiLocation={strapiLocation} />
    </div>
  );
}
