"use client";

import { cn } from "@/lib/utils";
import type { TypographyProps } from "@/components/type/types";

interface BlockquoteProps
  extends Omit<TypographyProps, "children">,
    Omit<React.HTMLAttributes<HTMLQuoteElement>, "children"> {
  children: TypographyProps["children"];
  author?: string;
}

/**
 * Blockquote Component
 *
 * Styled blockquote component for quotes and citations.
 *
 * @example
 * ```tsx
 * <Blockquote>This is a quote.</Blockquote>
 * <Blockquote author="John Doe">A quote with attribution.</Blockquote>
 * ```
 */
export default function Blockquote({
  children,
  author,
  className,
  ...props
}: BlockquoteProps) {
  return (
    <blockquote
      className={cn(
        "border-l-4 border-slate-300 pl-4 py-2 my-4 italic text-slate-700",
        className
      )}
      {...props}
    >
      <div>{children}</div>
      {author && (
        <footer className="mt-2 text-sm text-muted-foreground not-italic">
          — {author}
        </footer>
      )}
    </blockquote>
  );
}
