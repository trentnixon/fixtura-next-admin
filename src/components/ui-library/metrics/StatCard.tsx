"use client";

import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Title, ByLine } from "@/components/type/titles";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const statCardVariants = cva(
  "rounded-lg border shadow-sm transition-all hover:shadow-md relative overflow-hidden",
  {
    variants: {
      variant: {
        primary:
          "bg-white border-brandPrimary-200 hover:border-brandPrimary-300",
        secondary:
          "bg-white border-brandSecondary-200 hover:border-brandSecondary-300",
        accent: "bg-white border-brandAccent-200 hover:border-brandAccent-300",
        light: "bg-white border-slate-200 hover:border-slate-300",
        dark: "bg-slate-900 border-slate-800 hover:border-slate-700",
      },
    },
    defaultVariants: {
      variant: "light",
    },
  }
);

interface StatCardProps extends VariantProps<typeof statCardVariants> {
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
 * Supports brand color themes (primary, secondary, accent) and light/dark themes.
 *
 * @example
 * ```tsx
 * <StatCard
 *   title="Total Collections"
 *   value="1,234"
 *   trend={+5.2}
 *   icon={<Database />}
 *   description="Last 30 days"
 *   variant="primary"
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
  variant,
  className,
  action,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;
  const isNeutral = trend === undefined || trend === 0;
  const isDark = variant === "dark";

  // Accent stripe color based on variant
  const accentStripeClass = cn(
    "absolute top-0 left-0 right-0 h-1",
    variant === "primary" && "bg-brandPrimary-500",
    variant === "secondary" && "bg-brandSecondary-500",
    variant === "accent" && "bg-brandAccent-500",
    variant === "light" && "bg-slate-400",
    variant === "dark" && "bg-slate-600"
  );

  // Value text color based on variant
  const valueColorClass = cn(
    isDark && "text-white",
    variant === "primary" && "text-brandPrimary-700",
    variant === "secondary" && "text-brandSecondary-700",
    variant === "accent" && "text-brandAccent-700",
    !isDark &&
      variant !== "primary" &&
      variant !== "secondary" &&
      variant !== "accent" &&
      "text-slate-900"
  );

  // Title text color based on variant
  const titleColorClass = cn(
    isDark && "text-slate-300",
    variant === "primary" && "text-brandPrimary-600",
    variant === "secondary" && "text-brandSecondary-600",
    variant === "accent" && "text-brandAccent-600",
    !isDark &&
      variant !== "primary" &&
      variant !== "secondary" &&
      variant !== "accent" &&
      "text-slate-600"
  );

  // Description text color based on variant
  const descriptionColorClass = cn(
    isDark && "text-slate-400",
    variant === "primary" && "text-brandPrimary-500",
    variant === "secondary" && "text-brandSecondary-500",
    variant === "accent" && "text-brandAccent-500",
    !isDark &&
      variant !== "primary" &&
      variant !== "secondary" &&
      variant !== "accent" &&
      "text-slate-500"
  );

  return (
    <Card className={cn(statCardVariants({ variant }), className)}>
      {/* Accent stripe at top */}
      <div className={accentStripeClass} />

      <CardContent className="p-6">
        {/* Header: Icon and Value */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <Title
              className={cn(
                "m-0 p-0 text-3xl font-bold tracking-tight",
                valueColorClass
              )}
            >
              {typeof value === "number" ? value.toLocaleString() : value}
            </Title>
          </div>
          {icon && (
            <div
              className={cn(
                "ml-4 flex-shrink-0 p-2 rounded-lg",
                variant === "primary" &&
                  "bg-brandPrimary-50 text-brandPrimary-600",
                variant === "secondary" &&
                  "bg-brandSecondary-50 text-brandSecondary-600",
                variant === "accent" &&
                  "bg-brandAccent-50 text-brandAccent-600",
                variant === "light" && "bg-slate-50 text-slate-600",
                variant === "dark" && "bg-slate-800 text-slate-300"
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Title */}
        <ByLine className={cn("text-sm font-medium mb-3", titleColorClass)}>
          {title}
        </ByLine>

        {/* Footer: Description and Trend */}
        <div
          className={cn(
            "flex items-center justify-between gap-4 pt-3 border-t",
            isDark ? "border-slate-700" : "border-slate-200/50"
          )}
        >
          {description && (
            <ByLine className={cn("text-xs flex-1", descriptionColorClass)}>
              {description}
            </ByLine>
          )}
          {trend !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md flex-shrink-0",
                isPositive && "bg-emerald-50 text-emerald-700",
                isNegative && "bg-red-50 text-red-700",
                isNeutral &&
                  (isDark
                    ? "bg-slate-800 text-slate-400"
                    : "bg-slate-50 text-slate-500")
              )}
            >
              {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
              {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
              {isNeutral && <Minus className="h-3.5 w-3.5" />}
              <span className="text-xs font-semibold">
                {trend !== 0 && `${isPositive ? "+" : ""}${trend.toFixed(1)}%`}
                {trend === 0 && trendLabel}
              </span>
            </div>
          )}
        </div>

        {/* Action area */}
        {action && <div className="mt-4 flex justify-end">{action}</div>}
      </CardContent>
    </Card>
  );
}
