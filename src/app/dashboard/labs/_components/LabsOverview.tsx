"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import SectionWrapper from "@/components/scaffolding/containers/SectionWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Beaker,
  FlaskConical,
  Layers,
  Map,
  Network,
  Palette,
} from "lucide-react";
import Link from "next/link";

const labs = [
  {
    title: "Component Lab",
    description:
      "Design system showcase with LLM build guide, token registry, and category patterns for admin pages.",
    href: "/dashboard/labs/components",
    icon: Palette,
  },
  {
    title: "Data Fetch Lab",
    description:
      "Scraper test dashboards — result and account scraper test listings and detail views.",
    href: "/dashboard/labs/data-fetch",
    icon: FlaskConical,
  },
  {
    title: "Route Lab",
    description:
      "App Router experiments — dynamic segments, search params, and navigation patterns.",
    href: "/dashboard/labs/routes",
    icon: Map,
  },
  {
    title: "Feature Lab",
    description:
      "Isolated feature prototypes before promoting to production dashboard routes.",
    href: "/dashboard/labs/features",
    icon: Layers,
  },
] as const;

export default function LabsOverview() {
  return (
    <>
      <CreatePageTitle
        title="Labs"
        byLine="Admin experimentation hub"
        byLineBottom="Build and test components, routes, features, and data fetching in isolation"
      />

      <SectionWrapper spacing="lg" title="Choose a lab">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {labs.map((lab) => {
            const Icon = lab.icon;
            return (
              <Link key={lab.href} href={lab.href}>
                <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-slate-100 p-2">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>
                      <CardTitle className="text-lg">{lab.title}</CardTitle>
                    </div>
                    <CardDescription>{lab.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm font-medium text-slate-600">
                      Open lab →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </SectionWrapper>

      <SectionWrapper spacing="md" title="About">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">How labs work</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Labs are internal-only areas for experimentation. Production
              routes under Accounts, Sports Data, and Data ops are unchanged.
            </p>
            <p className="flex items-center gap-2">
              <Network className="h-4 w-4 shrink-0" />
              Legacy URLs for the component library and scraper tests redirect
              here automatically.
            </p>
          </CardContent>
        </Card>
      </SectionWrapper>
    </>
  );
}
