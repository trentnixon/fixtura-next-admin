"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use } from "react";

const sampleIds = ["example-id", "another-id", "nested/demo"];

export default function RouteLabDynamicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();
  const decodedId = decodeURIComponent(id);

  return (
    <>
      <CreatePageTitle
        title="Dynamic segment demo"
        byLine={`id = ${decodedId}`}
        byLineBottom="Route Lab — params and pathname"
      />
      <PageContainer padding="xs" spacing="lg">
        <Card>
          <CardHeader>
            <CardTitle>Current route</CardTitle>
            <CardDescription>
              Values from App Router params and client pathname.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 font-mono text-sm">
            <p>
              <span className="text-muted-foreground">params.id:</span>{" "}
              {decodedId}
            </p>
            <p>
              <span className="text-muted-foreground">pathname:</span>{" "}
              {pathname}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Try other ids</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {sampleIds.map((sampleId) => (
              <Link
                key={sampleId}
                href={`/dashboard/labs/routes/dynamic/${encodeURIComponent(sampleId)}`}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm hover:bg-slate-100"
              >
                {sampleId}
              </Link>
            ))}
          </CardContent>
        </Card>

        <Link
          href="/dashboard/labs/routes"
          className="inline-block text-sm font-medium text-slate-600 hover:underline"
        >
          ← Route Lab
        </Link>
      </PageContainer>
    </>
  );
}
