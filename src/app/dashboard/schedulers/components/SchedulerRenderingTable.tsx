"use client";

import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { ActiveRendersTable } from "./ActiveRendersTable";
import { SystemQueueTable } from "./SystemQueueTable";

export function SchedulerRenderingTable() {
  const { data } = useSchedulerRollup();
  const { strapiLocation } = useGlobalContext();

  const renderingItems = data?.ListOfSchedulersRenderingWithIDS || [];
  const queuedItems = data?.ListOfSchedulersQueuedWithIDS || [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <ActiveRendersTable items={renderingItems} strapiLocation={strapiLocation} />
      <SystemQueueTable items={queuedItems} strapiLocation={strapiLocation} />
    </div>
  );
}
