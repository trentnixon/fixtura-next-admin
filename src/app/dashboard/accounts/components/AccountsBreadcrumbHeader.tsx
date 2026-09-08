"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  LayoutDashboard,
  Network,
  Users,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type AccountsBreadcrumbHeaderProps = {
  currentPage: string;
  parent?: {
    label: string;
    href: string;
  };
};

const crumbLinkClass =
  "inline-flex items-center gap-2 transition-colors hover:text-foreground";

const crumbPageClass =
  "inline-flex items-center gap-2 font-normal text-foreground";

function getAccountListIcon(href: string): LucideIcon {
  if (href.includes("/club")) return Building2;
  if (href.includes("/association")) return Network;
  return Users;
}

function getCurrentPageIcon(
  currentPage: string,
  parent?: AccountsBreadcrumbHeaderProps["parent"]
): LucideIcon {
  if (parent) return getAccountListIcon(parent.href);
  const lower = currentPage.toLowerCase();
  if (lower.includes("club")) return Building2;
  if (lower.includes("association")) return Network;
  return Users;
}

function CrumbLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <BreadcrumbLink asChild>
      <Link href={href} className={crumbLinkClass}>
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {children}
      </Link>
    </BreadcrumbLink>
  );
}

function CrumbPage({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <BreadcrumbPage className={crumbPageClass}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {children}
    </BreadcrumbPage>
  );
}

/**
 * Accounts route breadcrumb — navigation.pattern.breadcrumb-header
 */
export default function AccountsBreadcrumbHeader({
  currentPage,
  parent,
}: AccountsBreadcrumbHeaderProps) {
  const CurrentIcon = getCurrentPageIcon(currentPage, parent);
  const ParentIcon = parent ? getAccountListIcon(parent.href) : Users;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <CrumbLink href="/dashboard" icon={LayoutDashboard}>
            Dashboard
          </CrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <CrumbLink href="/dashboard/accounts" icon={Users}>
            Accounts
          </CrumbLink>
        </BreadcrumbItem>
        {parent ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <CrumbLink href={parent.href} icon={ParentIcon}>
                {parent.label}
              </CrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <CrumbPage icon={CurrentIcon}>{currentPage}</CrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <CrumbPage icon={CurrentIcon}>{currentPage}</CrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
