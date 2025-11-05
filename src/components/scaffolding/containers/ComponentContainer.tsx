"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ComponentContainerProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "card" | "minimal";
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * ComponentContainer Component
 *
 * A flexible wrapper component for individual components that need consistent spacing,
 * borders, or background styling. Provides consistent visual separation and padding.
 *
 * @example
 * ```tsx
 * <ComponentContainer variant="bordered" padding="md">
 *   <MyComponent />
 * </ComponentContainer>
 * ```
 */
export default function ComponentContainer({
  children,
  className,
  variant = "default",
  padding = "md",
}: ComponentContainerProps) {
  const variantStyles = {
    default: "",
    bordered: "border border-slate-200 rounded-md",
    card: "bg-white border border-slate-200 rounded-md shadow-sm",
    minimal: "bg-transparent",
  };

  const paddingStyles = {
    none: "",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={cn(variantStyles[variant], paddingStyles[padding], className)}
    >
      {children}
    </div>
  );
}
