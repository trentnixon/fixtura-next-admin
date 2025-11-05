"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  spacing?: "xs" | "sm" | "md" | "lg" | "xl";
}

/**
 * PageContainer Component
 *
 * A minimal container for page-level content. Provides padding and spacing
 * for children without borders, backgrounds, or shadows.
 * Used as the top-level container for page content.
 *
 * @example
 * ```tsx
 * <PageContainer padding="lg" spacing="lg">
 *   <SectionContainer title="Section 1">Content</SectionContainer>
 *   <SectionContainer title="Section 2">Content</SectionContainer>
 * </PageContainer>
 * ```
 */
export default function PageContainer({
  children,
  className,
  padding = "lg",
  spacing = "lg",
}: PageContainerProps) {
  const paddingStyles = {
    none: "",
    xs: "px-2 py-2",
    sm: "px-4 py-4",
    md: "px-6 py-6",
    lg: "px-8 py-8",
    xl: "px-12 py-12",
  };

  const spacingStyles = {
    xs: "space-y-2",
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8",
    xl: "space-y-12",
  };

  return (
    <div
      className={cn(paddingStyles[padding], spacingStyles[spacing], className)}
    >
      {children}
    </div>
  );
}
