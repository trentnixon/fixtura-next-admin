"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Type } from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    path: "/dashboard/labs/features",
    description: "Feature prototypes and getting started",
  },
  {
    id: "page-title",
    label: "Page Title",
    icon: Type,
    path: "/dashboard/labs/features/page-title",
    description: "Page title patterns built on type primitives",
  },
] as const;

export default function FeatureLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <aside className="w-64 border-r bg-slate-50 overflow-y-auto">
        <div className="p-4 border-b space-y-2">
          <Link
            href="/dashboard/labs"
            className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
          >
            ← All Labs
          </Link>
          <h2 className="font-semibold text-lg">Feature Lab</h2>
          <p className="text-xs text-muted-foreground">
            Prototype flows before production routes
          </p>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive =
                pathname === feature.path ||
                (feature.path !== "/dashboard/labs/features" &&
                  pathname?.startsWith(feature.path));

              return (
                <li key={feature.id}>
                  <Link
                    href={feature.path}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-md transition-colors",
                      "hover:bg-slate-100",
                      isActive
                        ? "bg-slate-200 font-medium text-slate-900"
                        : "text-slate-700"
                    )}
                  >
                    <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{feature.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {feature.description}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
