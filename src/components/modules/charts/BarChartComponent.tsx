/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import { SectionTitle } from "@/components/type/titles";

interface BarChartComponentProps {
  title: string; // Chart title
  data: any[]; // Data to display in the chart
  xAxisKey: string; // Key in the data for the X axis
  barKey: string; // Key in the data for the bar values
  barColor?: string; // Optional: color for the bars (default provided below)
  config?: any; // Optional: chart configuration for the container
  height?: number; // Optional: height of the chart container in pixels (default 200)
  width?: string; // Optional: width of the chart container (default "100%")
}

const BarChartComponent: FC<BarChartComponentProps> = ({
  title,
  data,
  xAxisKey,
  barKey,
  barColor = "var(--color-renders)",
  config,
  height = 200,
  width = "100%",
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
        <CardTitle className="flex items-center justify-between w-full p-2">
          <SectionTitle>{title}</SectionTitle>
        </CardTitle>
        <CardContent className="p-2">
          {/* Use inline style for dynamic height and width */}
          <ChartContainer
            config={config}
            className="w-full"
            style={{ height: `${height}px`, width }}>
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: string) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey={barKey} fill={barColor} radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardHeader className="p-2" />
      </Card>
    </div>
  );
};

export default BarChartComponent;
