"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import {
  LAB_CATEGORY_SECTIONS,
  LAB_GUIDE_NAV,
  LAB_OVERVIEW_PATH,
  getCategoriesBySection,
} from "./categories";

/**
 * Component Lab navigation — grouped by LLM_COMPONENT_GUIDE.md workflow.
 */
export default function UILibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path ||
    (path !== LAB_OVERVIEW_PATH && pathname?.startsWith(path));

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <aside className="w-64 border-r bg-slate-50 overflow-y-auto shrink-0">
        <div className="p-4 border-b space-y-2">
          <Link
            href="/dashboard/labs"
            className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
          >
            ← All Labs
          </Link>
          <h2 className="font-semibold text-lg">Component Lab</h2>
          <p className="text-xs text-muted-foreground">
            Pick patterns and tokens before building pages
          </p>
        </div>
        <nav className="p-2 pb-6">
          <ul className="space-y-1">
            <li>
              <Link
                href={LAB_OVERVIEW_PATH}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-md transition-colors",
                  "hover:bg-slate-100",
                  isActive(LAB_OVERVIEW_PATH)
                    ? "bg-slate-200 font-medium text-slate-900"
                    : "text-slate-700"
                )}
              >
                <LayoutDashboard className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Overview</div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    Hub, recipes, and quick tokens
                  </div>
                </div>
              </Link>
            </li>
            <li>
              <GuideNavLink active={isActive(LAB_GUIDE_NAV.path)} />
            </li>
          </ul>

          {LAB_CATEGORY_SECTIONS.map((section) => {
            const items = getCategoriesBySection(section.id);
            if (items.length === 0) return null;

            return (
              <div key={section.id} className="mt-4">
                <div className="px-3 py-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {section.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                    {section.description}
                  </div>
                </div>
                <ul className="space-y-1">
                  {items.map((category) => {
                    const Icon = category.icon;
                    const active = isActive(category.path);

                    return (
                      <li key={category.id}>
                        <Link
                          href={category.path}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-md transition-colors",
                            "hover:bg-slate-100",
                            active
                              ? "bg-slate-200 font-medium text-slate-900"
                              : "text-slate-700"
                          )}
                        >
                          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">
                              {category.label}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {category.description}
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}

function GuideNavLink({ active }: { active: boolean }) {
  const Icon = LAB_GUIDE_NAV.icon;

  return (
    <Link
      href={LAB_GUIDE_NAV.path}
      className={cn(
        "flex items-start gap-3 p-3 rounded-md transition-colors border border-dashed",
        active
          ? "bg-primary/5 border-primary/30 font-medium text-slate-900"
          : "border-slate-200 hover:bg-slate-100 text-slate-700"
      )}
    >
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{LAB_GUIDE_NAV.label}</div>
        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {LAB_GUIDE_NAV.description}
        </div>
      </div>
    </Link>
  );
}
