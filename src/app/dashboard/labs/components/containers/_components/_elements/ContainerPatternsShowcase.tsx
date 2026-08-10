"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubsectionTitle } from "@/components/type/titles";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Database,
  FileText,
  Filter,
  RadioTower,
  Search,
  Settings2,
} from "lucide-react";
import ComponentRef from "./ComponentRef";
import { CONTAINER_TOKENS } from "./containerTokens";

const metricTiles = [
  { label: "Fixtures", value: "1,284", meta: "+18 today" },
  { label: "Accounts", value: "642", meta: "91% active" },
  { label: "Renders", value: "3,408", meta: "24h volume" },
];

const records = [
  { label: "Club results scrape", status: "Running", time: "2 min" },
  { label: "Association fixture sync", status: "Queued", time: "8 min" },
  { label: "Render asset check", status: "Complete", time: "14 min" },
];

const dataPoints = [
  { label: "API health", value: "99.1%", icon: RadioTower },
  { label: "Data quality", value: "97.2%", icon: CheckCircle2 },
  { label: "Batch speed", value: "48/min", icon: Activity },
];

/**
 * Container patterns showcase - composed div surfaces for real app data.
 */
export default function ContainerPatternsShowcase() {
  return (
    <SectionContainer
      title="Container Patterns"
      description="Composed div surfaces with headers, dense body content, and footers"
    >
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Data Workspace</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              title / content / footer
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-blue-50 p-1.5 text-blue-700">
                    <Database className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Collection Overview
                  </h3>
                  <Badge variant="secondary">Live</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current data collection state across fixtures, accounts, and
                  render inputs.
                </p>
              </div>
              <Button size="sm" variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
              {metricTiles.map((tile) => (
                <div className="px-4 py-4" key={tile.label}>
                  <div className="text-xs font-medium text-muted-foreground">
                    {tile.label}
                  </div>
                  <div className="mt-1 text-2xl font-bold leading-none text-slate-950">
                    {tile.value}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">{tile.meta}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
              <span className="text-muted-foreground">
                Updated 32 seconds ago
              </span>
              <Button size="sm">
                Open data route
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <ComponentRef token={CONTAINER_TOKENS.pattern.dataWorkspace} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Form Workspace</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              form fields / side data / footer
            </span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-violet-50 p-1.5 text-violet-700">
                  <Settings2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Scheduler Controls
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Adjust batch settings while keeping supporting data visible.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1.5fr_1fr]">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-600">
                    Search account
                  </span>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-8" placeholder="Club or association" />
                  </div>
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-600">
                    Run window
                  </span>
                  <Input defaultValue="Tonight, 7:30 PM" />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-600">
                    Batch size
                  </span>
                  <Input defaultValue="48" />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-600">
                    Priority
                  </span>
                  <Input defaultValue="High priority" />
                </label>
              </div>

              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <CalendarClock className="h-4 w-4 text-slate-500" />
                  Next jobs
                </div>
                <div className="space-y-2">
                  {records.map((record) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-sm"
                      key={record.label}
                    >
                      <span className="min-w-0 truncate text-slate-700">
                        {record.label}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {record.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 sm:flex-row sm:justify-end">
              <Button size="sm" variant="outline">
                Save draft
              </Button>
              <Button size="sm">Apply changes</Button>
            </div>
          </div>
          <ComponentRef token={CONTAINER_TOKENS.pattern.formWorkspace} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Record Panel</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              title / cards / table rows / footer
            </span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Account Data Snapshot
                </h3>
                <p className="text-sm text-muted-foreground">
                  A mixed content container for cards, record rows, and actions.
                </p>
              </div>
              <Badge variant="outline">Season 2026</Badge>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="grid grid-cols-1 gap-2">
                {dataPoints.map((point) => {
                  const Icon = point.icon;

                  return (
                    <div
                      className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                      key={point.label}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          {point.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-950">
                        {point.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="overflow-hidden rounded-md border border-slate-200">
                {records.map((record) => (
                  <div
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-slate-200 px-3 py-2 text-sm last:border-b-0"
                    key={record.label}
                  >
                    <div className="min-w-0 truncate font-medium text-slate-800">
                      {record.label}
                    </div>
                    <Badge variant="outline">{record.status}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {record.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />3 records shown
              </div>
              <Button size="sm" variant="outline">
                View detail
              </Button>
            </div>
          </div>
          <ComponentRef token={CONTAINER_TOKENS.pattern.recordPanel} />
        </div>
      </div>
    </SectionContainer>
  );
}
