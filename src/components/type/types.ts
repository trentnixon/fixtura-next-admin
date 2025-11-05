import { ReactNode } from "react";

/**
 * Common props pattern used across all typography components
 */
export interface TypographyProps {
  children: ReactNode;
  className?: string;
}

/**
 * Props for components that can render as different HTML elements
 */
export interface PolymorphicTypographyProps extends TypographyProps {
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

/**
 * Text variant types
 */
export type TextVariant = "body" | "small" | "tiny" | "muted" | "lead";

/**
 * Text weight types
 */
export type TextWeight = "normal" | "medium" | "semibold" | "bold";

/**
 * Heading level types
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
