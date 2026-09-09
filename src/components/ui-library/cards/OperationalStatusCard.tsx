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

export type OperationalStatusCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  footerLabel: string;
  footerValue: string;
  status?: "healthy" | "warning" | "neutral";
  className?: string;
};

const statusStyles = {
  healthy: {
    card: "border-emerald-200 bg-emerald-50/60",
    icon: "bg-emerald-100 text-emerald-700",
    footerBorder: "border-emerald-200/70",
    footerLabel: "text-emerald-800",
    footerValue: "text-emerald-950",
  },
  warning: {
    card: "border-amber-200 bg-amber-50/60",
    icon: "bg-amber-100 text-amber-700",
    footerBorder: "border-amber-200/70",
    footerLabel: "text-amber-800",
    footerValue: "text-amber-950",
  },
  neutral: {
    card: "border-slate-200 bg-slate-50/60",
    icon: "bg-slate-100 text-slate-600",
    footerBorder: "border-slate-200/70",
    footerLabel: "text-slate-700",
    footerValue: "text-slate-950",
  },
} as const;

/** `card.base.operational-status` — tinted status surface with footer metric */
export default function OperationalStatusCard({
  title,
  description,
  icon,
  footerLabel,
  footerValue,
  status = "neutral",
  className,
}: OperationalStatusCardProps) {
  const styles = statusStyles[status];

  return (
    <Card className={cn(styles.card, className)}>
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className={cn("rounded-full p-2", styles.icon)}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div
          className={cn(
            "flex items-center justify-between border-t pt-3 text-sm",
            styles.footerBorder,
          )}
        >
          <span className={styles.footerLabel}>{footerLabel}</span>
          <span className={cn("font-semibold", styles.footerValue)}>
            {footerValue}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
