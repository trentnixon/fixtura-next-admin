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

interface DataCollectionSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  variant?: "default" | "compact";
}

/**
 * DataCollectionSection Component
 *
 * A wrapper component for organizing data collection components into logical sections.
 * Provides consistent styling and layout for grouping related components.
 */
export default function DataCollectionSection({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  variant = "default",
}: DataCollectionSectionProps) {
  const isCompact = variant === "compact";

  return (
    <Card
      className={cn("shadow-none bg-slate-50 border rounded-md", className)}
    >
      <CardHeader className={cn(isCompact && "pb-3", headerClassName)}>
        <CardTitle
          className={cn("text-lg font-semibold", isCompact && "text-base")}
        >
          {title}
        </CardTitle>
        {description && (
          <CardDescription className={cn(isCompact && "text-xs")}>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent
        className={cn(
          isCompact ? "pt-0 space-y-4" : "space-y-6",
          contentClassName
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
