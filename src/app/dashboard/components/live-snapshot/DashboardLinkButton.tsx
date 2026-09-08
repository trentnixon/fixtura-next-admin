"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Dashboard link button intents — aligned with labs actions (`action.button.use-cases`).
 * - supporting: secondary brand, cross-links and panel headers
 * - highlight: accent brand, footer navigation CTAs
 * - primary: main action when needed
 */
export type DashboardLinkIntent = "supporting" | "highlight" | "primary";

const INTENT_VARIANT: Record<
  DashboardLinkIntent,
  "secondary" | "accent" | "primary"
> = {
  supporting: "secondary",
  highlight: "accent",
  primary: "primary",
};

interface DashboardLinkButtonProps {
  href: string;
  children: ReactNode;
  intent?: DashboardLinkIntent;
  /** Icon before label — labs `action.button.icon-before` */
  icon?: LucideIcon;
  /** Icon after label — labs `action.button.icon-after` */
  trailingIcon?: "arrow" | "external" | "none";
  className?: string;
}

export function DashboardLinkButton({
  href,
  children,
  intent = "supporting",
  icon: Icon,
  trailingIcon = "none",
  className,
}: DashboardLinkButtonProps) {
  return (
    <Button
      variant={INTENT_VARIANT[intent]}
      size="sm"
      className={cn("shrink-0", className)}
      asChild
    >
      <Link href={href}>
        {Icon ? <Icon className="h-4 w-4" /> : null}
        {children}
        {trailingIcon === "arrow" ? <ArrowRight className="h-4 w-4" /> : null}
        {trailingIcon === "external" ? (
          <ExternalLink className="h-4 w-4" />
        ) : null}
      </Link>
    </Button>
  );
}
