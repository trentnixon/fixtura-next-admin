"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Type,
  Palette,
  Layout,
  FormInput,
  MessageSquare,
  Badge,
  Table,
  Navigation,
  MousePointer,
  Image,
  Wand2,
  BookOpen,
  Sparkles,
  List,
  SquareStack,
} from "lucide-react";
import Link from "next/link";

/**
 * UI Component Library Navigation
 *
 * Main navigation component for the UI showcase with category routing
 */
const categories = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    path: "/dashboard/ui",
    description: "Library overview and getting started",
  },
  {
    id: "type",
    label: "Type",
    icon: Type,
    path: "/dashboard/ui/type",
    description: "Typography and text components",
  },
  {
    id: "colors",
    label: "Colors",
    icon: Palette,
    path: "/dashboard/ui/colors",
    description: "Color system and palette",
  },
  {
    id: "icons",
    label: "Icons",
    icon: Sparkles,
    path: "/dashboard/ui/icons",
    description: "Icon library and usage",
  },
  {
    id: "layout",
    label: "Layout",
    icon: Layout,
    path: "/dashboard/ui/layout",
    description: "Containers, Grids, Flex, Spacing",
  },
  {
    id: "forms",
    label: "Forms",
    icon: FormInput,
    path: "/dashboard/ui/forms",
    description: "Inputs, Selects, Checkboxes, Date Pickers",
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: MessageSquare,
    path: "/dashboard/ui/feedback",
    description: "Loading, Error, Empty, Alerts, Toasts",
  },
  {
    id: "status",
    label: "Status",
    icon: Badge,
    path: "/dashboard/ui/status",
    description: "Badges, Indicators, Avatars, Tags",
  },
  {
    id: "data",
    label: "Cards",
    icon: SquareStack,
    path: "/dashboard/ui/data",
    description: "Stat Cards, Metric Grids, Base Cards",
  },
  {
    id: "tables",
    label: "Tables",
    icon: Table,
    path: "/dashboard/ui/tables",
    description: "Data tables for structured information",
  },
  {
    id: "lists",
    label: "Lists",
    icon: List,
    path: "/dashboard/ui/lists",
    description: "Ordered, unordered, and description lists",
  },
  {
    id: "overlays",
    label: "Overlays",
    icon: Wand2,
    path: "/dashboard/ui/overlays",
    description: "Dialogs, Sheets, Popovers, Tooltips",
  },
  {
    id: "navigation",
    label: "Navigation",
    icon: Navigation,
    path: "/dashboard/ui/navigation",
    description: "Breadcrumbs, Tabs, Sidebar, Pagination",
  },
  {
    id: "actions",
    label: "Actions",
    icon: MousePointer,
    path: "/dashboard/ui/actions",
    description: "Buttons, Button Groups, Floating Actions",
  },
  {
    id: "media",
    label: "Media",
    icon: Image,
    path: "/dashboard/ui/media",
    description: "Images, Videos, Code Blocks, Markdown",
  },
  {
    id: "utilities",
    label: "Utilities",
    icon: BookOpen,
    path: "/dashboard/ui/utilities",
    description: "Copy, Time Formatting, Currency, Search",
  },
] as const;

export default function UILibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-slate-50 overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Component Library</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Browse by category
          </p>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive =
                pathname === category.path ||
                (category.path !== "/dashboard/ui" &&
                  pathname?.startsWith(category.path));

              return (
                <li key={category.id}>
                  <Link
                    href={category.path}
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
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
