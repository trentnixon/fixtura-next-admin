"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error?: Error | string | null;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: "default" | "card" | "minimal";
  className?: string;
  children?: ReactNode;
}

/**
 * ErrorState Component
 *
 * Standardized error state display with optional retry functionality.
 * Provides consistent error handling across the application.
 *
 * @example
 * ```tsx
 * <ErrorState error={error} onRetry={refetch} />
 * <ErrorState
 *   title="Something went wrong"
 *   description="Please try again later"
 *   variant="card"
 * />
 * ```
 */
export default function ErrorState({
  error,
  title = "Error",
  description,
  onRetry,
  retryLabel = "Retry",
  variant = "default",
  className,
  children,
}: ErrorStateProps) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "An error occurred";

  const displayDescription = description || errorMessage;

  if (variant === "minimal") {
    return (
      <div
        className={cn("flex items-center gap-2 text-destructive", className)}
      >
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">{displayDescription}</span>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <Card className={cn("border-destructive", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            {title}
          </CardTitle>
          <CardDescription>{displayDescription}</CardDescription>
        </CardHeader>
        {onRetry && (
          <CardContent>
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              {retryLabel}
            </Button>
          </CardContent>
        )}
        {children}
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
    >
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{displayDescription}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          {retryLabel}
        </Button>
      )}
      {children}
    </div>
  );
}
