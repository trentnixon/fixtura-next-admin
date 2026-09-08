"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  siteNavigationCtaAltClass,
  siteNavigationCtaClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";

/**
 * Dashboard cross-page link CTAs — `action.button.site-navigation` (+ alt for footer emphasis).
 */
export type DashboardLinkIntent = "supporting" | "highlight" | "primary";

const INTENT_CLASS: Record<DashboardLinkIntent, string> = {
  supporting: siteNavigationCtaClass,
  highlight: siteNavigationCtaAltClass,
  primary: siteNavigationCtaClass,
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
      variant="ghost"
      size="sm"
      className={cn(INTENT_CLASS[intent], "shrink-0", className)}
      asChild
    >
      <Link href={href}>
        {Icon ? <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden /> : null}
        {children}
        {trailingIcon === "arrow" ? (
          <ArrowRight className="h-4 w-4 shrink-0 text-current" aria-hidden />
        ) : null}
        {trailingIcon === "external" ? (
          <ExternalLink className="h-4 w-4 shrink-0 text-current" aria-hidden />
        ) : null}
      </Link>
    </Button>
  );
}
