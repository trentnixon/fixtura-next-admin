"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendIndicatorProps {
  value?: number; // Percentage change (-100 to 100, or undefined for neutral)
  showValue?: boolean; // Whether to show the percentage value
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * TrendIndicator Component
 *
 * Displays a trend indicator with icon and optional percentage value.
 * Useful for showing improvement, decline, or stability.
 */
export default function TrendIndicator({
  value,
  showValue = true,
  className,
  size = "md",
}: TrendIndicatorProps) {
  // Determine trend direction
  const isPositive = value !== undefined && value > 0;
  const isNegative = value !== undefined && value < 0;
  const isNeutral = value === undefined || value === 0;

  // Size configurations
  const sizeConfig = {
    sm: {
      icon: "h-3 w-3",
      text: "text-xs",
    },
    md: {
      icon: "h-4 w-4",
      text: "text-sm",
    },
    lg: {
      icon: "h-5 w-5",
      text: "text-base",
    },
  };

  const config = sizeConfig[size];

  // Get color classes based on trend
  const colorClasses = isPositive
    ? "text-emerald-600"
    : isNegative
    ? "text-red-600"
    : "text-muted-foreground";

  // Format value
  const formattedValue =
    value !== undefined ? Math.abs(value).toFixed(1) : null;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {isPositive && <TrendingUp className={cn(config.icon, colorClasses)} />}
      {isNegative && <TrendingDown className={cn(config.icon, colorClasses)} />}
      {isNeutral && <Minus className={cn(config.icon, colorClasses)} />}
      {showValue && formattedValue !== null && (
        <span className={cn(config.text, "font-medium", colorClasses)}>
          {formattedValue}%
        </span>
      )}
    </div>
  );
}
