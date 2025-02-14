// QuickView.tsx
"use client";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import { TodaysRenders } from "@/types/scheduler";

export default function QuickView() {
  const { data } = useGetTodaysRenders();

  const renderCount = data?.length;
  const renderingCount = getRenderingCount(data ?? []);
  const queuedCount = getQueuedCount(data ?? []);
  return (
    <div className="flex flex-col gap-4">
      <div className="col-span-12 gap-4 space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="grid grid-cols-2 gap-4">Item {renderCount}</div>
          </div>
          <div className="col-span-4">
            <div className="grid grid-cols-2 gap-4">
              <div>Rendering: {renderingCount}</div>
              <div>Queued: {queuedCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// func to work out the number of items where isRendering is true
function getRenderingCount(data: TodaysRenders[]) {
  return data?.filter(item => item.isRendering).length;
}

// func to work out the number of items where queued is false
function getQueuedCount(data: TodaysRenders[]) {
  return data?.filter(item => item.queued).length;
}
