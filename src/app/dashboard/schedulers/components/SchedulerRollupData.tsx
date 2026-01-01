"use client";
import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import { Calendar, PlayCircle, CheckCircle2, Timer, Activity } from "lucide-react";

export function SchedulerRollupData() {
  const { data } = useSchedulerRollup();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Performance Snapshot</h3>
          <p className="text-sm text-slate-500">Real-time rendering status and operational health</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
          <Activity className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-600 uppercase">Live Monitor Active</span>
        </div>
      </div>

      <MetricGrid columns={4} gap="md">
        <StatCard
          title="Total Configs"
          value={data?.numberOfSchedulers || 0}
          icon={<Calendar className="h-4 w-4" />}
          variant="primary"
          description="Total active schedulers"
        />
        <StatCard
          title="Active Renders"
          value={data?.numberOfSchedulersRendering || 0}
          icon={<PlayCircle className="h-4 w-4 font-bold" />}
          variant="secondary"
          description="Currently processing"
        />
        <StatCard
          title="Avg Priority"
          value={data?.avgRenderTimeMinutes ? `${data.avgRenderTimeMinutes.toFixed(1)}m` : "0m"}
          icon={<Timer className="h-4 w-4" />}
          variant="accent"
          description="Avg processing time"
        />
        <StatCard
          title="Success Rate"
          value={data ? `${((data.yesterdaySuccessCount / (data.yesterdaySuccessCount + data.yesterdayFailureCount || 1)) * 100).toFixed(0)}%` : "0%"}
          icon={<CheckCircle2 className="h-4 w-4 text-success-500" />}
          variant="light"
          description="Previous 24h success"
        />
      </MetricGrid>
    </div>
  );
}
