"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, TrendingUp } from "lucide-react";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItemType[];
}

export default function BreadcrumbNavigation({
  items,
}: BreadcrumbNavigationProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbs = items || (() => {
    const paths = pathname.split("/").filter(Boolean);
    const result: BreadcrumbItemType[] = [
      { label: "Dashboard", href: "/dashboard" },
    ];

    // Build breadcrumbs from path segments
    let currentPath = "";
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      // Skip the last segment if it's a dynamic ID
      if (index < paths.length - 1 || !/^\d+$/.test(path)) {
        const label = path
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        result.push({
          label,
          href: index < paths.length - 1 ? currentPath : undefined,
        });
      } else {
        // It's an ID, use a generic label
        result.push({
          label: `Detail`,
          href: undefined,
        });
      }
    });

    return result;
  })();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {item.label === "Budget" && (
                      <TrendingUp className="h-4 w-4" />
                    )}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

