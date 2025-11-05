"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const linkVariants = cva(
  "transition-colors hover:underline underline-offset-4",
  {
    variants: {
      variant: {
        default: "text-primary hover:text-primary/80",
        muted: "text-muted-foreground hover:text-foreground",
        destructive: "text-destructive hover:text-destructive/80",
      },
      size: {
        default: "text-base",
        small: "text-sm",
        large: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface LinkProps
  extends VariantProps<typeof linkVariants>,
    React.ComponentProps<typeof Link> {
  children: ReactNode;
  external?: boolean;
}

/**
 * Link Component
 *
 * Styled link component for internal and external navigation.
 *
 * @example
 * ```tsx
 * <Link href="/dashboard">Dashboard</Link>
 * <Link href="https://example.com" external variant="muted">External Link</Link>
 * ```
 */
export default function StyledLink({
  children,
  variant,
  size,
  className,
  href,
  external,
  ...props
}: LinkProps) {
  const linkClasses = cn(linkVariants({ variant, size }), className);

  if (external) {
    return (
      <a
        href={href as string}
        className={linkClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClasses} {...props}>
      {children}
    </Link>
  );
}
