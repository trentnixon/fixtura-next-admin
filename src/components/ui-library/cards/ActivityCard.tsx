"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ActivityCardItem = {
  icon: LucideIcon;
  label: string;
  meta: string;
  tone?: string;
};

export type ActivityCardProps = {
  title: string;
  items: ActivityCardItem[];
  action?: ReactNode;
  className?: string;
};

/** `card.base.activity` — recent activity feed with icon rows */
export default function ActivityCard({
  title,
  items,
  action,
  className,
}: ActivityCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {action}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4 pt-0">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div className="flex items-center gap-3" key={item.label}>
              <div
                className={cn(
                  "rounded-md p-1.5",
                  item.tone ?? "bg-slate-50 text-slate-600",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-slate-800">
                  {item.label}
                </div>
                <div className="text-xs text-muted-foreground">{item.meta}</div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
