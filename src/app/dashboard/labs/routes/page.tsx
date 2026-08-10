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

export default function RouteLabPage() {
  return (
    <>
      <CreatePageTitle
        title="Route Lab"
        byLine="App Router experiments"
        byLineBottom="Dynamic segments, pathname, and navigation — not production business data"
      />
      <PageContainer padding="xs" spacing="lg">
        <Card>
          <CardHeader>
            <CardTitle>Demos</CardTitle>
            <CardDescription>
              Sandboxed routes for testing Next.js routing patterns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Link
                href="/dashboard/labs/routes/dynamic/example-id"
                className="text-sm font-medium text-slate-900 hover:underline"
              >
                Dynamic segment demo →
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                Shows params.id, pathname, and sample links.
              </p>
            </div>
            <Link
              href="/dashboard/labs"
              className="inline-block text-sm font-medium text-slate-600 hover:underline"
            >
              ← All Labs
            </Link>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
