"use client";

import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface GanttTooltipProps {
  children: ReactNode;
  content: ReactNode;
}

/** Wrap a Gantt chart (or feature list) once so row tooltips share delay/collision behaviour. */
export function GanttChartTooltipProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={80}>
      {children}
    </TooltipProvider>
  );
}

export function GanttTooltip({ children, content }: GanttTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        sideOffset={8}
        collisionPadding={16}
        avoidCollisions
        className={cn(
          "z-[100] w-max max-w-[min(320px,calc(100vw-2rem))] border border-slate-200 bg-popover p-0 text-popover-foreground shadow-lg",
          "text-sm font-normal",
        )}
      >
        <div className="p-3">{content}</div>
      </TooltipContent>
    </Tooltip>
  );
}
