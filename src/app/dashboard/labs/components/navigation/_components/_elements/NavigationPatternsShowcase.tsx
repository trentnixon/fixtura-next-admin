"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubsectionTitle } from "@/components/type/titles";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Database,
  FileText,
  Home,
  LayoutDashboard,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import ComponentRef from "./ComponentRef";
import { NAVIGATION_TOKENS } from "./navigationTokens";

const sideNavItems = [
  { label: "Overview", icon: LayoutDashboard, active: true, count: null },
  { label: "Collections", icon: Database, active: false, count: "18" },
  { label: "Accounts", icon: Users, active: false, count: "642" },
  { label: "Reports", icon: FileText, active: false, count: null },
  { label: "Settings", icon: Settings2, active: false, count: null },
];

const workflowSteps = [
  { label: "Setup", status: "Complete", icon: CheckCircle2 },
  { label: "Validate", status: "Current", icon: ShieldCheck },
  { label: "Schedule", status: "Next", icon: CalendarDays },
  { label: "Publish", status: "Later", icon: ClipboardList },
];

/**
 * Navigation patterns showcase - composed navigation for app screens.
 */
export default function NavigationPatternsShowcase() {
  return (
    <SectionContainer
      title="Navigation Patterns"
      description="Breadcrumbs, tabbers, side navigation, and workflow navigation for admin screens"
    >
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Breadcrumb Header</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              path / title / action
            </span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        className="flex items-center gap-1"
                        href="#"
                      >
                        <Home className="h-3.5 w-3.5" />
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Accounts</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Season data</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <div>
                  <h3 className="text-lg font-semibold leading-tight text-slate-950">
                    Season data workspace
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Route context stays visible above the working surface.
                  </p>
                </div>
              </div>
              <Button size="sm">Create report</Button>
            </div>
            <div className="grid grid-cols-1 gap-2 border-t border-slate-200 pt-3 text-sm sm:grid-cols-3">
              <div className="rounded-md bg-slate-50 px-3 py-2">
                642 active accounts
              </div>
              <div className="rounded-md bg-slate-50 px-3 py-2">
                1,284 fixtures synced
              </div>
              <div className="rounded-md bg-slate-50 px-3 py-2">
                99.1% API health
              </div>
            </div>
          </div>
          <ComponentRef token={NAVIGATION_TOKENS.pattern.breadcrumbHeader} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Section Tabber</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              tab state / counts / context
            </span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-950">
                    Account detail
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tabs move between peer sections inside one route.
                  </p>
                </div>
                <Badge variant="outline">Updated today</Badge>
              </div>
              <Tabs defaultValue="overview">
                <TabsList className="h-auto flex-wrap justify-start rounded-md bg-slate-100 p-1">
                  <TabsTrigger value="overview">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="data">
                    <Database className="mr-2 h-4 w-4" />
                    Data
                  </TabsTrigger>
                  <TabsTrigger value="analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings2 className="mr-2 h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
              <div className="rounded-md border border-slate-200 p-3">
                <div className="text-xs text-muted-foreground">Selected</div>
                <div className="mt-1 font-semibold text-slate-900">
                  Overview
                </div>
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <div className="text-xs text-muted-foreground">Open tasks</div>
                <div className="mt-1 font-semibold text-slate-900">12</div>
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <div className="text-xs text-muted-foreground">Last sync</div>
                <div className="mt-1 font-semibold text-slate-900">32s ago</div>
              </div>
            </div>
          </div>
          <ComponentRef token={NAVIGATION_TOKENS.pattern.sectionTabs} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Side Nav</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              persistent sections
            </span>
          </div>
          <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[240px_1fr]">
            <nav className="border-b border-slate-200 bg-slate-50 p-3 lg:border-b-0 lg:border-r">
              <div className="mb-3 px-2">
                <div className="text-sm font-semibold text-slate-900">
                  Data routes
                </div>
                <div className="text-xs text-muted-foreground">
                  Local navigation inside a workflow.
                </div>
              </div>
              <div className="space-y-1">
                {sideNavItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm transition ${
                        item.active
                          ? "bg-white font-semibold text-slate-950 shadow-sm"
                          : "text-slate-600 hover:bg-white"
                      }`}
                      key={item.label}
                      type="button"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.count && (
                        <Badge variant="outline">{item.count}</Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>
            <div className="p-4">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-950">
                    Overview
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Side navigation holds many sibling sections without crowding
                    the page header.
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Configure
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 p-3">
                  <div className="text-xs text-muted-foreground">
                    Active route
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    /accounts/:id/overview
                  </div>
                </div>
                <div className="rounded-md border border-slate-200 p-3">
                  <div className="text-xs text-muted-foreground">
                    Navigation depth
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    5 sections
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ComponentRef token={NAVIGATION_TOKENS.pattern.sideNav} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Workflow Steps</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              ordered progress nav
            </span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                const isCurrent = step.status === "Current";

                return (
                  <div
                    className={`flex items-center gap-3 rounded-md border px-3 py-2 ${
                      isCurrent
                        ? "border-brandPrimary-300 bg-brandPrimary-50 text-brandPrimary-800"
                        : "border-slate-200 text-slate-700"
                    }`}
                    key={step.label}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold shadow-sm">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-sm font-semibold">
                        <Icon className="h-3.5 w-3.5" />
                        {step.label}
                      </div>
                      <div className="text-xs opacity-75">{step.status}</div>
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <ChevronRight className="hidden h-4 w-4 text-slate-400 md:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <ComponentRef token={NAVIGATION_TOKENS.pattern.workflowSteps} />
        </div>
      </div>
    </SectionContainer>
  );
}
