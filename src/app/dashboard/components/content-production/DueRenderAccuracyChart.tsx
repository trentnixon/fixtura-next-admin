"use client";

import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DueRenderDayRow } from "@/lib/scheduler/dueRenderAccuracy";

const chartConfig = {
  processed: { label: "Finished", color: "hsl(142, 76%, 36%)" },
  inProgress: { label: "In progress", color: "hsl(221, 83%, 53%)" },
  missed: { label: "Missed", color: "hsl(38, 92%, 50%)" },
  failed: { label: "Failed", color: "hsl(0, 84%, 60%)" },
  upcoming: { label: "Still to come", color: "hsl(215, 16%, 70%)" },
} satisfies ChartConfig;

export function DueRenderAccuracyChart({
  days,
  rangeLabel,
  headerHref,
}: {
  days: DueRenderDayRow[];
  rangeLabel: string;
  headerHref: string;
}) {
  const title = (
    <span className="flex items-center gap-2">
      <BarChart3 className="h-4 w-4 text-slate-600" />
      Accuracy by day
    </span>
  );

  return (
    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          <Link href={headerHref} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
        <CardDescription className="text-xs">{rangeLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        {days.length < 1 ? (
          <p className="text-sm text-muted-foreground">
            No due renders in these 7 Sydney days.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart
              data={days}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                interval={days.length > 21 ? Math.ceil(days.length / 10) : 0}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="processed" stackId="day" fill="var(--color-processed)" />
              <Bar dataKey="inProgress" stackId="day" fill="var(--color-inProgress)" />
              <Bar dataKey="missed" stackId="day" fill="var(--color-missed)" />
              <Bar dataKey="failed" stackId="day" fill="var(--color-failed)" />
              <Bar dataKey="upcoming" stackId="day" fill="var(--color-upcoming)" />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
