"use client";

import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ComparisonRow = {
  label: string;
  value: string;
  tone?: string;
};

export type ComparisonCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  rows: ComparisonRow[];
  className?: string;
};

/** `card.base.comparison` — labeled value rows for side-by-side breakdowns */
export default function ComparisonCard({
  title,
  description,
  icon,
  rows,
  className,
}: ComparisonCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          {icon ? (
            <div className="text-slate-500">{icon}</div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4 pt-0">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"
          >
            <span className="text-sm text-slate-600">{row.label}</span>
            <span
              className={cn(
                "text-sm font-semibold",
                row.tone ?? "text-slate-900",
              )}
            >
              {row.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
