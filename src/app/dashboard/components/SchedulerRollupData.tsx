// SchedulerRollupData.ts
"use client";
import MetricCard from "@/app/dashboard/accounts/components/overview/tabs/components/metricCard";
import SchedulerBarChartByDays from "@/app/dashboard/schedulers/components/schedulerBarChartByDays";
import { Button } from "@/components/ui/button";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";

export function SchedulerRollupData() {
  const { data } = useSchedulerRollup();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayOfWeekName = today.toLocaleDateString("en-US", { weekday: "long" });
  const tomorrowDayOfTheWeekName = tomorrow.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const metrics = [
    {
      title: `Expected Renders for ${dayOfWeekName}`,
      value: data?.DaysOfTheWeekGroupedByCount[dayOfWeekName] || 0,
      icon: <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />,
      lastUpdate: "",
      action: (
        <Button
          variant="outline"
          onClick={() => console.log("Number of Schedulers action clicked")}>
          <Link href="/dashboard/schedulers">Schedulers</Link>
        </Button>
      ),
    },
    {
      title: `Expected Renders for ${tomorrowDayOfTheWeekName}`,
      value: data?.DaysOfTheWeekGroupedByCount[tomorrowDayOfTheWeekName] || 0,
      icon: <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />,
      lastUpdate: "",
      action: (
        <Button
          variant="outline"
          onClick={() => console.log("Number of Schedulers action clicked")}>
          <Link href="/dashboard/schedulers">Schedulers</Link>
        </Button>
      ),
    },
    {
      title: "Number of Schedulers Rendering",
      value: data?.numberOfSchedulersRendering || 0,
      icon: <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />,
      action: (
        <Button
          variant="outline"
          onClick={() => console.log("Number of Schedulers action clicked")}>
          <Link href="/dashboard/schedulers">Schedulers</Link>
        </Button>
      ),
    },
    {
      title: "Number of Schedulers Queued",
      value: data?.numberOfSchedulersQueued || 0,
      icon: <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />,
      action: (
        <Button
          variant="outline"
          onClick={() => console.log("Number of Schedulers action clicked")}>
          <Link href="/dashboard/schedulers">Schedulers</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="col-span-12 gap-4 space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <MetricCard
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  icon={metric.icon}
                  lastUpdate={metric.lastUpdate}
                  action={metric.action}
                />
              ))}
            </div>
          </div>
          <div className="col-span-4">
            <SchedulerBarChartByDays />
          </div>
        </div>
      </div>
    </div>
  );
}
