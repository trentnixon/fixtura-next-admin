"use client";

import { ReactNode } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

interface GlobalInsightsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "compact";
}

/**
 * GlobalInsightsSection Component
 *
 * A wrapper component for organizing global insights components into logical sections.
 * Uses SectionContainer for consistent styling and layout.
 */
export default function GlobalInsightsSection({
  title,
  description,
  children,
  className,
  variant = "default",
}: GlobalInsightsSectionProps) {
  return (
    <SectionContainer
      title={title}
      description={description}
      variant={variant === "compact" ? "compact" : "default"}
      className={className}
    >
      {children}
    </SectionContainer>
  );
}
