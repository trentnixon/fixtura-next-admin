"use client";

import Link from "next/link";
import { AlertTriangle, Download, ListChecks } from "lucide-react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";

const SIGNALS = [
  {
    id: "download-attention",
    title: "Download output failures",
    description:
      "Creator flags on download rows (hasError or errorHandler). Open Audit → pick a render → Downloads tab.",
    href: "/dashboard/renders/download-quality-control",
    icon: Download,
    cta: "Download QC",
  },
  {
    id: "integrity",
    title: "Render output integrity",
    description:
      "Ghost renders and fixture gaps from lineage. Not the same as per-download errors.",
    href: "/dashboard/renders?tab=audit",
    icon: AlertTriangle,
    cta: "Find a render",
  },
  {
    id: "pipeline",
    title: "Render pipeline failures",
    description:
      "Account asset run stages that failed. May exist with no download row.",
    href: "/dashboard/renders?tab=render-activity",
    icon: ListChecks,
    cta: "Render activity",
  },
] as const;

export function RenderAttentionSignalsSection() {
  return (
    <SectionContainer
      title="Troubleshooting signals"
      description="Three separate views — do not merge download flags, integrity audit, and pipeline failures."
      variant="compact"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {SIGNALS.map((signal) => {
          const Icon = signal.icon;
          return (
            <div
              key={signal.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-2">
                <div className="rounded-md bg-slate-100 p-1.5 text-slate-700">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {signal.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {signal.description}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-auto w-fit" asChild>
                <Link href={signal.href}>{signal.cta}</Link>
              </Button>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground pt-2">
        Fleet table on{" "}
        <Link
          href="/dashboard/renders/download-quality-control"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Download QC
        </Link>{" "}
        connects when CMS deploys the quality-queue endpoint.
      </p>
    </SectionContainer>
  );
}
