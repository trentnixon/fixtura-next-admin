"use client";

import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import StatCard from "@/components/ui-library/metrics/StatCard";
import { PlayCircle, Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRenderTelemetry } from "@/hooks/renders/useRenderTelemetry";
import LoadingState from "@/components/ui-library/states/LoadingState";

export function GlobalRenderRollup() {
    const { data: telemetry, isLoading, isError } = useRenderTelemetry();

    if (isLoading) return <LoadingState />;
    if (isError || !telemetry) return null; // Gracefully hide rollup if telemetry fails

    const getSystemStatusIcon = () => {
        switch (telemetry.systemStatus) {
            case "nominal": return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            case "warning": return <AlertCircle className="h-5 w-5 text-amber-500" />;
            case "degraded": return <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />;
            default: return <Activity className="h-5 w-5 text-slate-400" />;
        }
    };

    const getSystemStatusVariant = (): "primary" | "secondary" | "accent" | "light" | "dark" => {
        switch (telemetry.systemStatus) {
            case "nominal": return "secondary";
            case "warning": return "accent";
            case "degraded": return "primary"; // High visibility for degraded
            default: return "light";
        }
    };

    return (
        <MetricGrid columns={4} gap="lg">
            <StatCard
                title="Active Renders"
                value={telemetry.activeCount.toString()}
                icon={<PlayCircle className="h-5 w-5 text-blue-500 animate-pulse" />}
                variant="primary"
                description="Currently processing"
            />
            <StatCard
                title="Success Rate (24h)"
                value={`${telemetry.successRate24h}%`}
                icon={<Activity className="h-5 w-5 text-emerald-500" />}
                variant="secondary"
                description="System performance"
            />
            <StatCard
                title="Failed Today"
                value={telemetry.failedToday.toString()}
                icon={<AlertCircle className={`h-5 w-5 ${telemetry.failedToday > 0 ? "text-amber-500" : "text-slate-300"}`} />}
                variant={telemetry.failedToday > 0 ? "accent" : "light"}
                description="Daily failure count"
            />
            <StatCard
                title="System Status"
                value={telemetry.systemStatus.toUpperCase()}
                icon={getSystemStatusIcon()}
                variant={getSystemStatusVariant()}
                description="Overall platform health"
            />
        </MetricGrid>
    );
}
