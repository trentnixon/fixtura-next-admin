"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Title, ByLine } from "@/components/type/titles";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: number;
  trendLabel?: string;
  className?: string;
  action?: ReactNode;
}

/**
 * StatCard Component
 *
 * Enhanced metric card component with optional trend indicator.
 * Displays key statistics with visual hierarchy and optional trend data.
 *
 * @example
 * ```tsx
 * <StatCard
 *   title="Total Collections"
 *   value="1,234"
 *   trend={+5.2}
 *   icon={<Database />}
 *   description="Last 30 days"
 * />
 * ```
 */
export default function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  trendLabel,
  className,
  action,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;
  const isNeutral = trend === undefined || trend === 0;

  return (
    <Card
      className={cn(
        "shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md",
        className
      )}
    >
      <CardContent className="p-4">
        <CardHeader className="p-0 pb-2 flex flex-row items-start justify-between">
          <div className="flex flex-col gap-1 flex-1">
            <Title className="m-0 p-0 text-2xl">{value.toLocaleString()}</Title>
            <ByLine className="text-sm">{title}</ByLine>
          </div>
          {icon && <div className="ml-2">{icon}</div>}
        </CardHeader>

        {(description || trend !== undefined) && (
          <div className="flex items-center justify-between mt-2">
            {description && <ByLine className="text-xs">{description}</ByLine>}
            {trend !== undefined && (
              <div className="flex items-center gap-1">
                {isPositive && (
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                )}
                {isNegative && (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                {isNeutral && (
                  <Minus className="h-3 w-3 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    isPositive && "text-emerald-600",
                    isNegative && "text-red-600",
                    isNeutral && "text-muted-foreground"
                  )}
                >
                  {trend !== 0 &&
                    `${isPositive ? "+" : ""}${trend.toFixed(1)}%`}
                  {trend === 0 && trendLabel}
                </span>
              </div>
            )}
          </div>
        )}

        {action && <div className="mt-3 flex justify-end">{action}</div>}
      </CardContent>
    </Card>
  );
}
