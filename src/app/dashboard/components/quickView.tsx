// QuickView.tsx
"use client";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import MetricCard from "../accounts/components/overview/tabs/components/metricCard";
import { TodaysRenders } from "@/types/scheduler";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
              <div>
                <MetricCard
                  title={"Accounts Currently Rendering"}
                  value={renderingCount}
                  icon={
                    <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />
                  }
                  lastUpdate={"today"}
                  action={
                    <Button variant="outline">
                      <Link href="/dashboard/schedulers">Schedulers</Link>
                    </Button>
                  }
                />
              </div>
              <div>
                <MetricCard
                  title={"Accounts Queued from Todays"}
                  value={queuedCount}
                  icon={
                    <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />
                  }
                  lastUpdate={"today"}
                  action={
                    <Button variant="outline">
                      <Link href="/dashboard/schedulers">Schedulers</Link>
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// func to work out the number of items where isRendering is true
function getRenderingCount(data: TodaysRenders[]) {
  return data?.filter(item => item.isRendering).length || 0;
}

// func to work out the number of items where queued is false
function getQueuedCount(data: TodaysRenders[]) {
  return data?.filter(item => item.queued).length || 0;
}
