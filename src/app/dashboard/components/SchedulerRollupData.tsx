"use client";
import SchedulerBarChartByDays from "@/app/dashboard/schedulers/components/schedulerBarChartByDays";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import { Calendar, CalendarDays, PlayCircle, Clock } from "lucide-react";
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

  const tableData = [
    {
      title: `Expected Renders for ${dayOfWeekName}`,
      value: data?.DaysOfTheWeekGroupedByCount[dayOfWeekName] || 0,
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: `Expected Renders for ${tomorrowDayOfTheWeekName}`,
      value: data?.DaysOfTheWeekGroupedByCount[tomorrowDayOfTheWeekName] || 0,
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      title: "Number of Schedulers Rendering",
      value: data?.numberOfSchedulersRendering || 0,
      icon: <PlayCircle className="h-4 w-4" />,
    },
    {
      title: "Number of Schedulers Queued",
      value: data?.numberOfSchedulersQueued || 0,
      icon: <Clock className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-semibold text-lg">{item.value}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="primary" size="sm" asChild>
                    <Link href="/dashboard/schedulers">View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="lg:col-span-4">
        <SchedulerBarChartByDays />
      </div>
    </div>
  );
}
