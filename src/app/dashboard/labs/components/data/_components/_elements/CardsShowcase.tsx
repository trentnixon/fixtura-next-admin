"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubsectionTitle } from "@/components/type/titles";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Database,
  Gauge,
  MoreHorizontal,
  Server,
  TrendingUp,
} from "lucide-react";
import ComponentRef from "./ComponentRef";
import { CARD_TOKENS } from "./cardTokens";

const comparisonRows = [
  { label: "Scraped", value: "1,428", tone: "text-emerald-700" },
  { label: "Queued", value: "214", tone: "text-amber-700" },
  { label: "Failed", value: "18", tone: "text-red-700" },
];

const activityItems = [
  {
    icon: CheckCircle2,
    label: "Club fixtures synced",
    meta: "2 min ago",
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: Clock3,
    label: "Association scrape queued",
    meta: "8 min ago",
    tone: "bg-amber-50 text-amber-700",
  },
  {
    icon: Database,
    label: "Results import completed",
    meta: "14 min ago",
    tone: "bg-sky-50 text-sky-700",
  },
];

/**
 * Base Card showcase - shadcn/ui card patterns
 */
export default function CardsShowcase() {
  return (
    <SectionContainer
      title="Base Card"
      description="Standard card component with tighter dashboard-ready card patterns"
    >
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Core Structure</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              header / content / footer
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <p className="text-sm text-slate-600">
                  Card content area for main content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Card with Footer</CardTitle>
                <CardDescription>
                  Action buttons go in the footer
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-0">
                <p className="text-sm text-slate-600">Main content here.</p>
              </CardContent>
              <CardFooter className="justify-end gap-2 px-4 pb-4 pt-0">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>
          </div>
          <ComponentRef token={CARD_TOKENS.base.default} />
          <ComponentRef token={CARD_TOKENS.base.withFooter} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Surface Treatments</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              border / tint / hover
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <Card className="border-2">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Bordered Card</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <p className="text-sm text-slate-600">
                  Card with thicker border.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-slate-50">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Background Card</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <p className="text-sm text-slate-600">
                  Card with a quiet background.
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition hover:border-brandPrimary-300 hover:shadow-md">
              <CardHeader className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-base">
                      Interactive Card
                    </CardTitle>
                    <CardDescription>
                      Hover to reveal affordance
                    </CardDescription>
                  </div>
                  <ArrowRight className="mt-0.5 h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
            </Card>
          </div>
          <ComponentRef token={CARD_TOKENS.base.bordered} />
          <ComponentRef token={CARD_TOKENS.base.background} />
          <ComponentRef token={CARD_TOKENS.base.interactive} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>New Options</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              compact / status / compare / activity
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="rounded-md bg-indigo-50 p-2 text-indigo-700">
                    <Gauge className="h-4 w-4" />
                  </div>
                  <Badge variant="secondary">+8.4%</Badge>
                </div>
                <div className="text-2xl font-bold leading-none text-slate-900">
                  97.2%
                </div>
                <div className="mt-1 text-sm font-medium text-slate-600">
                  Data match rate
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-slate-100">
                  <div className="h-1.5 w-[82%] rounded-full bg-indigo-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/60">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">Scraper Health</CardTitle>
                    <CardDescription>All jobs responding</CardDescription>
                  </div>
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                    <Server className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="flex items-center justify-between border-t border-emerald-200/70 pt-3 text-sm">
                  <span className="text-emerald-800">Last heartbeat</span>
                  <span className="font-semibold text-emerald-950">32s</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">Run Breakdown</CardTitle>
                    <CardDescription>Current batch totals</CardDescription>
                  </div>
                  <TrendingUp className="h-4 w-4 text-slate-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-4 pt-0">
                {comparisonRows.map((row) => (
                  <div
                    className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"
                    key={row.label}
                  >
                    <span className="text-sm text-slate-600">{row.label}</span>
                    <span className={`text-sm font-semibold ${row.tone}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-4 pt-0">
                {activityItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div className="flex items-center gap-3" key={item.label}>
                      <div className={`rounded-md p-1.5 ${item.tone}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-slate-800">
                          {item.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.meta}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
          <ComponentRef token={CARD_TOKENS.base.compactKpi} />
          <ComponentRef token={CARD_TOKENS.base.operationalStatus} />
          <ComponentRef token={CARD_TOKENS.base.comparison} />
          <ComponentRef token={CARD_TOKENS.base.activity} />
        </div>
      </div>
    </SectionContainer>
  );
}
