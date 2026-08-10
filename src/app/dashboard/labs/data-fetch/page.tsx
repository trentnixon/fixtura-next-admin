"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionWrapper from "@/components/scaffolding/containers/SectionWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FlaskConical, TestTube } from "lucide-react";
import Link from "next/link";

const areas = [
  {
    title: "Result Scraper Tests",
    description:
      "Overview of all result scraper tests — statistics, charts, and per-test detail.",
    href: "/dashboard/labs/data-fetch/scraper-results",
    icon: FlaskConical,
  },
  {
    title: "Account Scraper Tests",
    description:
      "Account-specific scrape test listings, summaries, and performance detail.",
    href: "/dashboard/labs/data-fetch/account-scraper",
    icon: TestTube,
  },
] as const;

export default function DataFetchLabPage() {
  return (
    <>
      <CreatePageTitle
        title="Data Fetch Lab"
        byLine="Scraper test dashboards"
        byLineBottom="Inspect fetch results and account scraper test runs"
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionWrapper spacing="md" title="Areas">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {areas.map((area) => {
              const Icon = area.icon;
              return (
                <Link key={area.href} href={area.href}>
                  <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-slate-100 p-2">
                          <Icon className="h-5 w-5 text-slate-700" />
                        </div>
                        <CardTitle className="text-lg">{area.title}</CardTitle>
                      </div>
                      <CardDescription>{area.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm font-medium text-slate-600">
                        Open →
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </SectionWrapper>
        <Link
          href="/dashboard/labs"
          className="text-sm font-medium text-slate-600 hover:underline"
        >
          ← All Labs
        </Link>
      </PageContainer>
    </>
  );
}
