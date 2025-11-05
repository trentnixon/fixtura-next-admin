"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { PolymorphicTypographyProps } from "@/components/type/types";

const textVariants = cva("", {
  variants: {
    variant: {
      body: "text-base text-slate-700",
      small: "text-sm text-slate-600",
      tiny: "text-xs text-slate-500",
      muted: "text-sm text-muted-foreground",
      lead: "text-lg text-slate-700",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "body",
    weight: "normal",
  },
});

interface TextProps
  extends VariantProps<typeof textVariants>,
    Omit<PolymorphicTypographyProps, "as">,
    Omit<React.HTMLAttributes<HTMLParagraphElement>, "children"> {
  as?: PolymorphicTypographyProps["as"];
}

/**
 * Text Component
 *
 * Flexible text component with multiple size and weight variants.
 * Use for body text, small text, or muted text throughout the application.
 *
 * @example
 * ```tsx
 * <Text variant="body">Regular body text</Text>
 * <Text variant="small" weight="medium">Small emphasized text</Text>
 * <Text variant="muted">Muted helper text</Text>
 * ```
 */
export default function Text({
  children,
  variant,
  weight,
  className,
  as = "p",
  ...props
}: TextProps) {
  const Component = as;

  return (
    <Component
      className={cn(textVariants({ variant, weight }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}
