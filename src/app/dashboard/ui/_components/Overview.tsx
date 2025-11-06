"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import SectionWrapper from "@/components/scaffolding/containers/SectionWrapper";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Type,
  Layout,
  FormInput,
  AlertCircle,
  Badge as BadgeIcon,
  Table as TableIcon,
  Palette,
  Sparkles,
  MousePointer2,
  Wand2,
  Navigation,
  List,
  SquareStack,
} from "lucide-react";
import Link from "next/link";

/**
 * UI Component Library Overview Page
 *
 * Landing page for the UI component library showcase
 */
export default function UIOverviewPage() {
  const stats = {
    total: 150,
    completed: 55,
    inProgress: 0,
  };

  const progress = (stats.completed / stats.total) * 100;

  const quickLinks = [
    {
      title: "Type",
      description: "Typography and text components",
      href: "/dashboard/ui/type",
      icon: Type,
      status: "partial",
      completed: 12,
    },
    {
      title: "Colors",
      description: "Color system and palette",
      href: "/dashboard/ui/colors",
      icon: Palette,
      status: "partial",
      completed: 1,
    },
    {
      title: "Icons",
      description: "Icon library and usage",
      href: "/dashboard/ui/icons",
      icon: Sparkles,
      status: "partial",
      completed: 1,
    },
    {
      title: "Layout",
      description: "Containers, Grids, Flex, Spacing",
      href: "/dashboard/ui/layout",
      icon: Layout,
      status: "partial",
      completed: 10,
    },
    {
      title: "Forms",
      description: "Inputs, Selects, Date Pickers",
      href: "/dashboard/ui/forms",
      icon: FormInput,
      status: "partial",
      completed: 6,
    },
    {
      title: "Feedback",
      description: "Loading, Error, Empty states, Toast notifications",
      href: "/dashboard/ui/feedback",
      icon: AlertCircle,
      status: "partial",
      completed: 4,
    },
    {
      title: "Status",
      description: "Badges, Indicators, Avatars",
      href: "/dashboard/ui/status",
      icon: BadgeIcon,
      status: "partial",
      completed: 4,
    },
    {
      title: "Cards",
      description: "Stat Cards, Metric Grids, Base Cards",
      href: "/dashboard/ui/data",
      icon: SquareStack,
      status: "partial",
      completed: 3,
    },
    {
      title: "Tables",
      description: "Data tables for structured information",
      href: "/dashboard/ui/tables",
      icon: TableIcon,
      status: "partial",
      completed: 3,
    },
    {
      title: "Lists",
      description: "Ordered, unordered, and description lists",
      href: "/dashboard/ui/lists",
      icon: List,
      status: "partial",
      completed: 4,
    },
    {
      title: "Actions",
      description: "Buttons, Button Groups",
      href: "/dashboard/ui/actions",
      icon: MousePointer2,
      status: "partial",
      completed: 6,
    },
    {
      title: "Overlays",
      description: "Dialogs, Sheets, Tooltips",
      href: "/dashboard/ui/overlays",
      icon: Wand2,
      status: "partial",
      completed: 5,
    },
    {
      title: "Navigation",
      description: "Tabs, Pagination (reusable components)",
      href: "/dashboard/ui/navigation",
      icon: Navigation,
      status: "partial",
      completed: 2,
    },
  ];

  return (
    <>
      <CreatePageTitle
        title="UI Component Library"
        byLine="Design System & Component Showcase"
        byLineBottom="Comprehensive library of reusable UI components for the Fixtura Admin application"
      />

      {/* Stats Overview */}
      <SectionWrapper spacing="lg" title="Library Progress">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}+</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {stats.completed}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {progress.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      {/* Quick Links */}
      <SectionWrapper spacing="lg" title="Browse Components">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            const statusConfig = {
              planned: { color: "bg-slate-500", label: "Planned" },
              partial: { color: "bg-yellow-500", label: "Partial" },
              complete: { color: "bg-emerald-500", label: "Complete" },
            };
            const status =
              statusConfig[link.status as keyof typeof statusConfig] ||
              statusConfig.planned;

            return (
              <Link key={link.href} href={link.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-md">
                          <Icon className="h-5 w-5 text-slate-700" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {link.title}
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {link.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={status.color + " text-white border-0"}
                      >
                        {link.status === "partial" && link.completed
                          ? `${link.completed} components`
                          : status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </SectionWrapper>

      {/* Getting Started */}
      <SectionWrapper spacing="lg" title="Getting Started">
        <SectionContainer
          title="How to Use"
          description="Guide to using the component library"
        >
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Browse Components</h4>
                <p className="text-sm text-muted-foreground">
                  Use the sidebar navigation to browse components by category.
                  Each category contains related components with examples.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">View Examples</h4>
                <p className="text-sm text-muted-foreground">
                  Each component page shows multiple examples, variants, and
                  usage patterns. See how components behave in different
                  contexts.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Copy Code</h4>
                <p className="text-sm text-muted-foreground">
                  Copy component code snippets directly from examples. All
                  components are ready to use with proper TypeScript types.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">4</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Import & Use</h4>
                <p className="text-sm text-muted-foreground">
                  Import components from{" "}
                  <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">
                    @/components/ui-library
                  </code>{" "}
                  and use them in your pages.
                </p>
              </div>
            </div>
          </div>
        </SectionContainer>
      </SectionWrapper>
    </>
  );
}
