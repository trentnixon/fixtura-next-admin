"use client";

import { cn } from "@/lib/utils";
import type { TypographyProps } from "@/components/type/types";

interface CodeProps
  extends Omit<TypographyProps, "children">,
    Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  children: TypographyProps["children"];
  variant?: "inline" | "block";
}

/**
 * Code Component
 *
 * Component for displaying code snippets inline or in blocks.
 *
 * @example
 * ```tsx
 * <Code>const x = 1;</Code>
 * <Code variant="block">Multi-line code block</Code>
 * ```
 */
export default function Code({
  children,
  variant = "inline",
  className,
  ...props
}: CodeProps) {
  if (variant === "block") {
    return (
      <pre
        className={cn(
          "bg-slate-900 text-slate-50 p-4 rounded-md overflow-x-auto",
          className
        )}
        {...props}
      >
        <code>{children}</code>
      </pre>
    );
  }

  return (
    <code
      className={cn(
        "bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded text-sm font-mono",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}
