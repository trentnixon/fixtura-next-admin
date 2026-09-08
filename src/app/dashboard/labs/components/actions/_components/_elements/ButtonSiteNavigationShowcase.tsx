"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { SubsectionTitle } from "@/components/type/titles";
import {
  siteNavigationCtaAltClass,
  siteNavigationCtaClass,
  siteNavigationGroupDividerClass,
  siteNavigationGroupItemAltClass,
  siteNavigationGroupItemClass,
  siteNavigationGroupShellAltClass,
  siteNavigationGroupShellClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import ComponentRef from "./ComponentRef";
import { ACTION_TOKENS } from "./actionTokens";

/**
 * Site navigation CTA patterns — default transparent + alt filled sidebar styles.
 */
export default function ButtonSiteNavigationShowcase() {
  return (
    <SectionContainer
      title="Site Navigation"
      description="Default cross-page navigation CTAs — sidebar navy text on transparent, sidebar fill on hover"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>CTA</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              transparent · text-sidebar · hover:bg-sidebar
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={siteNavigationCtaClass}
              asChild
            >
              <Link href="/dashboard/accounts">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to accounts
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={siteNavigationCtaClass}
              asChild
            >
              <a href="#" onClick={(e) => e.preventDefault()}>
                Strapi
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.siteNavigation} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>CTA — Alt</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              bg-sidebar · hover:bg-sidebar-accent
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={siteNavigationCtaAltClass}
              asChild
            >
              <Link href="/dashboard/accounts">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to accounts
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={siteNavigationCtaAltClass}
              asChild
            >
              <a href="#" onClick={(e) => e.preventDefault()}>
                Strapi
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.siteNavigationAlt} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Button Group</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              group-horizontal · rounded-full · transparent shell
            </span>
          </div>
          <div className={siteNavigationGroupShellClass}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                siteNavigationGroupItemClass,
                siteNavigationGroupDividerClass
              )}
              asChild
            >
              <Link href="/dashboard/accounts">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={siteNavigationGroupItemClass}
              asChild
            >
              <a href="#" onClick={(e) => e.preventDefault()}>
                Strapi
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.siteNavigationGroup} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Button Group — Alt</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              bg-sidebar shell · hover:bg-sidebar-accent
            </span>
          </div>
          <div className={siteNavigationGroupShellAltClass}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                siteNavigationGroupItemAltClass,
                siteNavigationGroupDividerClass
              )}
              asChild
            >
              <Link href="/dashboard/accounts">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={siteNavigationGroupItemAltClass}
              asChild
            >
              <a href="#" onClick={(e) => e.preventDefault()}>
                Strapi
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.siteNavigationGroupAlt} />
        </div>
      </div>
    </SectionContainer>
  );
}
