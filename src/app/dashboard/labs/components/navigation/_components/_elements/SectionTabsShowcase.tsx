"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubsectionTitle } from "@/components/type/titles";
import {
  sectionTabListClass,
  sectionTabListInverseClass,
  sectionTabTriggerClass,
  sectionTabTriggerInverseClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import {
  Activity,
  BarChart3,
  CircleDollarSign,
  Clapperboard,
  Database,
  DollarSign,
  History,
  LayoutDashboard,
  Settings2,
} from "lucide-react";
import ComponentRef from "./ComponentRef";
import { NAVIGATION_TOKENS } from "./navigationTokens";

const sectionTabExamples = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "financials", label: "Financials", icon: DollarSign },
  { value: "assets", label: "Asset Creation", icon: Clapperboard },
  { value: "collection", label: "Data Collection", icon: Database },
] as const;

const compactSectionTabs = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "data", label: "Data", icon: Database },
  { value: "analytics", label: "Analytics", icon: BarChart3 },
  { value: "settings", label: "Settings", icon: Settings2 },
] as const;

const inverseSectionTabs = [
  { value: "runs", label: "Runs", icon: Activity },
  { value: "history", label: "History", icon: History },
  { value: "costs", label: "Costs", icon: CircleDollarSign },
  { value: "insights", label: "Insights", icon: BarChart3 },
] as const;

/**
 * Default and inverse section tabbers — route-level icon + label patterns.
 */
export default function SectionTabsShowcase() {
  return (
    <SectionContainer
      title="Section Tabs"
      description="Default route-level tabber plus compact inverse variant for nested sections"
    >
      <div className="space-y-8">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Default</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              TabsList primary · TabsTrigger section · gap-3 icon + label
            </span>
          </div>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList variant="primary" className={sectionTabListClass}>
              {sectionTabExamples.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  variant="section"
                  className={sectionTabTriggerClass}
                >
                  <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-muted-foreground">
                Peer sections inside one route — dashboard operations tab bar
                pattern.
              </div>
            </TabsContent>
          </Tabs>
          <ComponentRef token={NAVIGATION_TOKENS.tabs.sectionDefault} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Inverse</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              TabsList sectionInverse · TabsTrigger sectionInverse · compact
            </span>
          </div>
          <Tabs defaultValue="runs" className="w-full">
            <TabsList
              variant="sectionInverse"
              className={sectionTabListInverseClass}
            >
              {inverseSectionTabs.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  variant="sectionInverse"
                  className={sectionTabTriggerInverseClass}
                >
                  <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="runs" className="mt-4">
              <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-muted-foreground">
                Nested section tabber — sidebar shell, white active pill.
              </div>
            </TabsContent>
          </Tabs>
          <ComponentRef token={NAVIGATION_TOKENS.tabs.sectionInverse} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>In card context</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              navigation.pattern.section-tabs
            </span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="mb-3">
                <h3 className="text-base font-semibold text-slate-950">
                  Account detail
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tabs move between peer sections inside one route.
                </p>
              </div>
              <Tabs defaultValue="overview">
                <TabsList variant="primary" className={sectionTabListClass}>
                  {compactSectionTabs.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      variant="section"
                      className={sectionTabTriggerClass}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
              <div className="rounded-md border border-slate-200 p-3">
                <div className="text-xs text-muted-foreground">Selected</div>
                <div className="mt-1 font-semibold text-slate-900">Overview</div>
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
      </div>
    </SectionContainer>
  );
}
