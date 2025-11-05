"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  spacing?: "sm" | "md" | "lg";
  title?: string;
  description?: string;
  action?: ReactNode;
}

/**
 * SectionWrapper Component
 *
 * A semantic wrapper for page sections that provides consistent spacing and layout.
 * Used for grouping related content on pages with consistent gap and margin spacing.
 * Commonly used with SectionTitle for page-level organization.
 *
 * @example
 * ```tsx
 * <SectionWrapper spacing="lg" title="Analytics Overview">
 *   <AnalyticsWidget />
 * </SectionWrapper>
 * ```
 */
export default function SectionWrapper({
  children,
  className,
  spacing = "md",
  title,
  description,
  action,
}: SectionWrapperProps) {
  const spacingStyles = {
    sm: "gap-4 my-4",
    md: "gap-8 my-8",
    lg: "gap-12 my-12",
  };

  return (
    <section className={cn("flex flex-col", spacingStyles[spacing], className)}>
      {(title || description || action) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-1">
            {title && (
              <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-slate-600">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
