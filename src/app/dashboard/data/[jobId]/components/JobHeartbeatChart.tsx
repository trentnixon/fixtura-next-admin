"use client";

import type { LogEntry } from "@/types/scraperLogs";
import ChartCard from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDurationNoMillis } from "@/utils/chart-formatters";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  buildHeartbeatGaps,
  buildHeartbeatSeries,
  type HeartbeatGap,
  type HeartbeatPoint,
} from "../utils/jobLogPayloadUtils";

interface JobHeartbeatChartProps {
  entries: LogEntry[];
}

const stroke = "hsl(221, 83%, 53%)";

function HeartbeatStatsRow({
  series,
  gaps,
}: {
  series: HeartbeatPoint[];
  gaps: HeartbeatGap[];
}) {
  const first = series[0];
  const last = series[series.length - 1];
  const wallSpanMs = last.atMs - first.atMs;
  const gapVals = gaps.map((g) => g.gapMs);
  const avgGap =
    gapVals.length > 0
      ? gapVals.reduce((a, b) => a + b, 0) / gapVals.length
      : 0;
  const maxGap = gapVals.length > 0 ? Math.max(...gapVals) : 0;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground border-b border-border/60 pb-3 mb-1">
      <span>
        <strong className="text-foreground tabular-nums">
          {series.length}
        </strong>{" "}
        heartbeats
      </span>
      <span>
        Wall span:{" "}
        <strong className="text-foreground">
          {formatDurationNoMillis(wallSpanMs)}
        </strong>
      </span>
      {gaps.length > 0 && (
        <>
          <span>
            Avg gap:{" "}
            <strong className="text-foreground">
              {formatDurationNoMillis(avgGap)}
            </strong>
          </span>
          <span>
            Largest gap:{" "}
            <strong className="text-foreground">
              {formatDurationNoMillis(maxGap)}
            </strong>
          </span>
        </>
      )}
    </div>
  );
}

function ProgressChart({ data }: { data: HeartbeatPoint[] }) {
  const chartConfig = {
    elapsedMs: { label: "Elapsed time", color: stroke },
  } satisfies ChartConfig;

  return (
    <ChartCard
      title="Scraper-reported progress"
      description="Y = elapsed from each heartbeat payload. X = heartbeat sequence (equal spacing per beat — not wall clock; see stats row for wall span & Spacing tab for real-time gaps)."
      chartConfig={chartConfig}
      chartClassName="h-[min(280px,35vh)] min-h-[220px]"
    >
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="sequence"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          label={{ value: "Heartbeat #", position: "insideBottom", offset: -4 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={11}
          tickFormatter={(v) => formatDurationNoMillis(Number(v))}
          width={52}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value: number) => [
            value != null ? formatDurationNoMillis(value) : "—",
            "Elapsed",
          ]}
          labelFormatter={(_, payload) => {
            const p = payload?.[0]?.payload as
              | { sequence?: number; label?: string }
              | undefined;
            if (!p) return "";
            return `Heartbeat ${p.sequence ?? "—"} · ${p.label ?? ""}`;
          }}
        />
        <Line
          type="monotone"
          dataKey="elapsedMs"
          stroke={stroke}
          strokeWidth={2}
          dot={{ r: 2 }}
          connectNulls={false}
        />
      </LineChart>
    </ChartCard>
  );
}

function SpacingChart({ gaps }: { gaps: HeartbeatGap[] }) {
  const chartConfig = {
    gapMs: { label: "Gap", color: stroke },
  } satisfies ChartConfig;

  return (
    <ChartCard
      title="Time between heartbeats"
      description="Wall-clock gap from log timestamps — spikes often mean idle, backoff, or heavy work"
      chartConfig={chartConfig}
      chartClassName="h-[min(280px,35vh)] min-h-[220px]"
    >
      <LineChart data={gaps} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="afterSequence"
          tickLine={false}
          axisLine={false}
          fontSize={10}
          interval="preserveStartEnd"
          label={{
            value: "After heartbeat #",
            position: "insideBottom",
            offset: -4,
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={11}
          tickFormatter={(v) => formatDurationNoMillis(Number(v))}
          width={52}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value: number) => [
            formatDurationNoMillis(value),
            "Since previous",
          ]}
          labelFormatter={(_, payload) => {
            const p = payload?.[0]?.payload as HeartbeatGap | undefined;
            if (!p) return "";
            return `Heartbeat ${p.heartbeatIndex} · ${p.atLabel}`;
          }}
        />
        <Line
          type="monotone"
          dataKey="gapMs"
          stroke="hsl(25, 95%, 45%)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartCard>
  );
}

/**
 * Heartbeat views: scraper progress (elapsed vs sequence) and wall-clock gaps between beats.
 */
export function JobHeartbeatChart({ entries }: JobHeartbeatChartProps) {
  const series = buildHeartbeatSeries(entries);
  const data = series.map((p) => ({ ...p }));

  const chartConfig = {
    elapsedMs: { label: "Elapsed time", color: stroke },
  } satisfies ChartConfig;

  if (data.length === 0) {
    return (
      <ChartCard
        title="Heartbeat visualizations"
        description="Progress and spacing views when enough heartbeats exist"
        chartConfig={chartConfig}
        emptyStateMessage="No heartbeat events in the returned log rows"
      />
    );
  }

  if (data.length === 1) {
    const only = data[0];
    const elapsed =
      only.elapsedMs != null
        ? formatDurationNoMillis(only.elapsedMs)
        : "— (no elapsed time on this heartbeat)";
    return (
      <ChartCard
        title="Heartbeat visualizations"
        description="Only one heartbeat — charts need two or more"
        chartConfig={chartConfig}
        emptyStateMessage={`Single heartbeat at sequence ${only.sequence}: ${elapsed}`}
      />
    );
  }

  const gaps = buildHeartbeatGaps(series);

  return (
    <div className="space-y-3">
      <HeartbeatStatsRow series={series} gaps={gaps} />
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="h-auto min-h-9 w-full flex-wrap justify-start gap-1 sm:max-w-md">
          <TabsTrigger value="progress" className="text-xs sm:text-sm">
            Progress
          </TabsTrigger>
          <TabsTrigger value="spacing" className="text-xs sm:text-sm">
            Spacing
          </TabsTrigger>
        </TabsList>
        <TabsContent value="progress" className="mt-3">
          <ProgressChart data={data} />
        </TabsContent>
        <TabsContent value="spacing" className="mt-3">
          <SpacingChart gaps={gaps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
