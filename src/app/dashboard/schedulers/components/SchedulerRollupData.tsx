// SchedulerRollupData.ts
"use client";
import MetricCard from "@/app/dashboard/accounts/components/overview/tabs/components/metricCard";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import { CalendarIcon } from "lucide-react";

export function SchedulerRollupData() {
  const { data } = useSchedulerRollup();

  const metrics = [
    {
      title: "Number of Schedulers",
      value: data?.numberOfSchedulers,
      icon: <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />,
      lastUpdate: "",
    },

    {
      title: "Number of Schedulers Rendering",
      value: data?.numberOfSchedulersRendering,
      icon: <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />,
    },

    {
      title: "Number of Schedulers Queued",
      value: data?.numberOfSchedulersQueued,
      icon: <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />,
    },
  ];

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="col-span-12 gap-4 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              lastUpdate={metric.lastUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
