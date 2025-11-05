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
import { Inbox, Plus } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  variant?: "default" | "card" | "minimal";
  className?: string;
}

/**
 * EmptyState Component
 *
 * Standardized empty state display for when no data is available.
 * Provides consistent empty state UX across the application.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No accounts found"
 *   description="Start by creating your first account"
 *   actionLabel="Create Account"
 *   onAction={handleCreate}
 * />
 * ```
 */
export default function EmptyState({
  title = "No data available",
  description,
  action,
  actionLabel,
  onAction,
  icon,
  variant = "default",
  className,
}: EmptyStateProps) {
  const defaultIcon = icon || (
    <Inbox className="h-12 w-12 text-muted-foreground" />
  );

  if (variant === "minimal") {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-sm text-muted-foreground">{description || title}</p>
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            {actionLabel}
          </Button>
        )}
        {action}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{defaultIcon}</div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        {(action || (actionLabel && onAction)) && (
          <CardContent className="flex justify-center">
            {action || (
              <Button onClick={onAction} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                {actionLabel}
              </Button>
            )}
          </CardContent>
        )}
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center",
        className
      )}
    >
      <div className="mb-4">{defaultIcon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
      )}
      {action ||
        (actionLabel && onAction && (
          <Button onClick={onAction}>
            <Plus className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        ))}
    </div>
  );
}
