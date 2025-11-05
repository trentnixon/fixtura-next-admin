"use client";

import { cn } from "@/lib/utils";
import type { TypographyProps } from "@/components/type/types";

interface ParagraphProps
  extends Omit<TypographyProps, "children">,
    Omit<React.HTMLAttributes<HTMLParagraphElement>, "children"> {
  children: TypographyProps["children"];
  size?: "default" | "small" | "large";
}

/**
 * Paragraph Component
 *
 * Styled paragraph component for body text with consistent spacing.
 *
 * @example
 * ```tsx
 * <Paragraph>This is a paragraph of text.</Paragraph>
 * <Paragraph size="small">Smaller paragraph text.</Paragraph>
 * ```
 */
export default function Paragraph({
  children,
  className,
  size = "default",
  ...props
}: ParagraphProps) {
  const sizeClasses = {
    default: "text-base",
    small: "text-sm",
    large: "text-lg",
  };

  return (
    <p
      className={cn(
        "text-slate-700 leading-relaxed mb-4",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
