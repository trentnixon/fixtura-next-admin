"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * MetricGrid Component
 *
 * Responsive grid container for metric cards with consistent spacing.
 * Automatically adjusts columns based on screen size.
 *
 * @example
 * ```tsx
 * <MetricGrid columns={3} gap="lg">
 *   <StatCard title="Total" value="100" />
 *   <StatCard title="Active" value="75" />
 *   <StatCard title="Inactive" value="25" />
 * </MetricGrid>
 * ```
 */
export default function MetricGrid({
  children,
  columns = 3,
  gap = "md",
  className,
}: MetricGridProps) {
  const gapStyles = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid", gridCols[columns], gapStyles[gap], className)}>
      {children}
    </div>
  );
}
