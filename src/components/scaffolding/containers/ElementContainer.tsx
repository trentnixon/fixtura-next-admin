"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SubsectionTitle, ByLine } from "@/components/type/titles";

interface ElementContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: "light" | "dark";
  border?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  margin?: "none" | "sm" | "md" | "lg" | "xl";
}

/**
 * ElementContainer Component
 *
 * A flexible container for individual elements within a section.
 * Used as a child of SectionContainer to wrap individual components.
 * Title and subtitle are rendered outside the styled container div.
 *
 * @example
 * ```tsx
 * <SectionContainer title="Section">
 *   <ElementContainer title="Element Title" subtitle="Description" border padding="md">
 *     <YourComponent />
 *   </ElementContainer>
 * </SectionContainer>
 * ```
 */
export default function ElementContainer({
  children,
  title,
  subtitle,
  className,
  variant = "light",
  border = false,
  padding = "md",
  margin = "none",
}: ElementContainerProps) {
  const variantStyles = {
    light: "bg-white",
    dark: "bg-slate-50",
  };

  const borderStyles = border ? "border border-slate-200 rounded-lg" : "";

  const paddingStyles = {
    none: "",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  const marginStyles = {
    none: "",
    sm: "my-2",
    md: "my-4",
    lg: "my-6",
    xl: "my-8",
  };

  return (
    <div className={cn(marginStyles[margin], className)}>
      {(title || subtitle) && (
        <div className="mb-3 space-y-1">
          {title && <SubsectionTitle>{title}</SubsectionTitle>}
          {subtitle && <ByLine>{subtitle}</ByLine>}
        </div>
      )}
      <div
        className={cn(
          variantStyles[variant],
          borderStyles,
          paddingStyles[padding]
        )}
      >
        {children}
      </div>
    </div>
  );
}
