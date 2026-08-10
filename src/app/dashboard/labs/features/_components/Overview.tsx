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
import { Type } from "lucide-react";
import Link from "next/link";

const featureLinks = [
  {
    title: "Page Title",
    description:
      "CreatePageTitle patterns and compositions built on type.title.* primitives",
    href: "/dashboard/labs/features/page-title",
    icon: Type,
  },
] as const;

export default function FeatureLabOverview() {
  return (
    <>
      <CreatePageTitle
        title="Feature Lab"
        byLine="Prototype full flows before production"
        byLineBottom="Each feature has reference tokens for LLM-driven implementation"
      />

      <SectionWrapper spacing="lg" title="Features">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {featureLinks.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.href} href={feature.href}>
                <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-slate-100 p-2">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm font-medium text-slate-600">
                      Open feature →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </SectionWrapper>

      <SectionWrapper spacing="md" title="Related">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Type primitives</CardTitle>
            <CardDescription>
              Page title features compose tokens from the component lab type
              category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/labs/components/type"
              className="text-sm font-medium text-slate-700 hover:underline"
            >
              Open Component Lab — Type →
            </Link>
          </CardContent>
        </Card>
      </SectionWrapper>
    </>
  );
}
