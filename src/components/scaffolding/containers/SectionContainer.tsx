"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionTitle, ByLine } from "@/components/type/titles";

interface SectionContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  variant?: "default" | "compact";
  action?: ReactNode;
  icon?: ReactNode;
}

/**
 * SectionContainer Component
 *
 * A card-based container for organizing components into logical sections.
 * Used as a child of PageContainer to group related content.
 * Provides consistent styling with border, background, and optional shadow.
 *
 * @example
 * ```tsx
 * <PageContainer>
 *   <SectionContainer title="Metrics" description="Key performance indicators">
 *     <MetricsTable data={data} />
 *   </SectionContainer>
 * </PageContainer>
 * ```
 */
export default function SectionContainer({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  variant = "default",
  action,
  icon,
}: SectionContainerProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn("bg-white border border-slate-200 rounded-lg", className)}
    >
      <div
        className={cn(
          "px-6 py-4 border-b border-slate-200",
          isCompact && "py-3",
          headerClassName
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <div className="flex flex-col gap-1">
              <SectionTitle className={isCompact ? "text-base" : undefined}>
                {title}
              </SectionTitle>
              {description && (
                <ByLine className={isCompact ? "text-xs" : undefined}>
                  {description}
                </ByLine>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
      <div
        className={cn(
          "px-6 py-6",
          isCompact ? "py-4 space-y-4" : "space-y-6",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
