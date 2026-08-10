"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import StatCard from "@/components/ui-library/metrics/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SubsectionTitle } from "@/components/type/titles";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Database,
  RadioTower,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import ComponentRef from "./ComponentRef";
import { CARD_TOKENS } from "./cardTokens";

const modernStats = [
  {
    title: "Collections",
    value: "1,234",
    detail: "Live sync volume",
    trend: "+5.2%",
    trendTone: "bg-emerald-50 text-emerald-700",
    icon: Database,
    iconTone: "bg-blue-50 text-blue-700",
    barTone: "bg-blue-500",
    progress: "78%",
  },
  {
    title: "Active Accounts",
    value: "567",
    detail: "Ready for renders",
    trend: "+12",
    trendTone: "bg-emerald-50 text-emerald-700",
    icon: Users,
    iconTone: "bg-violet-50 text-violet-700",
    barTone: "bg-violet-500",
    progress: "64%",
  },
  {
    title: "Error Rate",
    value: "2.5%",
    detail: "Below threshold",
    trend: "-0.8%",
    trendTone: "bg-sky-50 text-sky-700",
    icon: AlertCircle,
    iconTone: "bg-amber-50 text-amber-700",
    barTone: "bg-amber-500",
    progress: "24%",
  },
];

const operationsStats = [
  {
    label: "Pipeline",
    value: "Healthy",
    meta: "32s heartbeat",
    icon: CheckCircle2,
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    label: "Queue",
    value: "214",
    meta: "18 high priority",
    icon: Clock3,
    tone: "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    label: "Throughput",
    value: "48/min",
    meta: "Peak window",
    icon: Zap,
    tone: "border-cyan-200 bg-cyan-50 text-cyan-800",
  },
  {
    label: "Signals",
    value: "99.1%",
    meta: "API availability",
    icon: RadioTower,
    tone: "border-indigo-200 bg-indigo-50 text-indigo-800",
  },
];

/**
 * StatCard showcase - metric cards with themes and trends
 */
export default function StatCardsShowcase() {
  return (
    <SectionContainer
      title="Stat Cards"
      description="Enhanced metric cards with optional trend indicators and theme variants"
    >
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Modern Overview</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              status / progress / trend
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {modernStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card
                  className="overflow-hidden border-slate-200 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  key={stat.title}
                >
                  <CardContent className="p-4">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className={`rounded-md p-2 ${stat.iconTone}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <Badge
                        className={`border-transparent px-2 py-0.5 ${stat.trendTone}`}
                        variant="outline"
                      >
                        {stat.trend}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold leading-none text-slate-950">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-700">
                      {stat.title}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {stat.detail}
                    </div>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${stat.barTone}`}
                        style={{ width: stat.progress }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <ComponentRef token={CARD_TOKENS.stat.modernOverview} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Operations Strip</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              compact operational metrics
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {operationsStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card
                  className={`border shadow-sm ${stat.tone}`}
                  key={stat.label}
                >
                  <CardContent className="flex items-center gap-3 p-3.5">
                    <div className="rounded-md bg-white/70 p-2">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium opacity-75">
                        {stat.label}
                      </div>
                      <div className="truncate text-lg font-bold leading-tight">
                        {stat.value}
                      </div>
                      <div className="truncate text-xs opacity-75">
                        {stat.meta}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <ComponentRef token={CARD_TOKENS.stat.operations} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Brand Variants</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              primary / secondary / accent
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <StatCard
              title="Primary Theme"
              value={1234}
              icon={<Database className="h-4 w-4" />}
              description="Brand primary color"
              variant="primary"
            />
            <StatCard
              title="Secondary Theme"
              value={567}
              icon={<Users className="h-4 w-4" />}
              description="Brand secondary color"
              variant="secondary"
            />
            <StatCard
              title="Accent Theme"
              value="2.5%"
              icon={<AlertCircle className="h-4 w-4" />}
              description="Brand accent color"
              variant="accent"
            />
          </div>
          <ComponentRef token={CARD_TOKENS.stat.brandVariants} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Light & Dark</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              variant light / dark
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <StatCard
              title="Light Theme"
              value={1234}
              icon={<Database className="h-4 w-4" />}
              description="Default light theme"
              variant="light"
            />
            <StatCard
              title="Dark Theme"
              value={567}
              icon={<Users className="h-4 w-4" />}
              description="Dark theme variant"
              variant="dark"
            />
          </div>
          <ComponentRef token={CARD_TOKENS.stat.lightDark} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>With Trends</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              positive / negative / neutral
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <StatCard
              title="Total Collections"
              value={1234}
              trend={+5.2}
              icon={<Database className="h-4 w-4" />}
              description="Last 30 days"
              variant="primary"
            />
            <StatCard
              title="Active Users"
              value={567}
              trend={-2.1}
              icon={<Users className="h-4 w-4" />}
              description="Last 7 days"
              variant="secondary"
            />
            <StatCard
              title="Error Rate"
              value="2.5%"
              trend={0}
              trendLabel="No change"
              icon={<AlertCircle className="h-4 w-4" />}
              description="Last 24 hours"
              variant="accent"
            />
          </div>
          <ComponentRef token={CARD_TOKENS.stat.withTrend} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <SubsectionTitle>Dark with Trends</SubsectionTitle>
            <span className="text-xs text-muted-foreground">variant dark</span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <StatCard
              title="Revenue"
              value="$12.5K"
              trend={+8.3}
              icon={<TrendingUp className="h-4 w-4" />}
              description="This month"
              variant="dark"
            />
            <StatCard
              title="Orders"
              value={892}
              trend={-1.2}
              icon={<TrendingDown className="h-4 w-4" />}
              description="Last week"
              variant="dark"
            />
            <StatCard
              title="Customers"
              value={1247}
              trend={+12.5}
              icon={<Users className="h-4 w-4" />}
              description="This quarter"
              variant="dark"
            />
          </div>
          <ComponentRef token={CARD_TOKENS.stat.darkWithTrend} />
        </div>
      </div>
    </SectionContainer>
  );
}
