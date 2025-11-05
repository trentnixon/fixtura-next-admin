"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  variant?: "default" | "skeleton" | "minimal";
  className?: string;
  children?: ReactNode;
}

/**
 * LoadingState Component
 *
 * Standardized loading state display component. Provides consistent loading
 * feedback across the application.
 *
 * @example
 * ```tsx
 * <LoadingState message="Loading accounts..." />
 * <LoadingState variant="skeleton">
 *   <Skeleton className="h-64 w-full" />
 * </LoadingState>
 * ```
 */
export default function LoadingState({
  message = "Loading...",
  variant = "default",
  className,
  children,
}: LoadingStateProps) {
  if (variant === "skeleton" && children) {
    return <div className={cn("space-y-4", className)}>{children}</div>;
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
