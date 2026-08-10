import { auth } from "@clerk/nextjs/server";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { ScraperJobDetailClient } from "./components/ScraperJobDetailClient";

interface PageProps {
  params: Promise<{ jobId: string }>;
  searchParams?: Promise<{ runId?: string | string[] }>;
}

export default async function ScraperJobDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn({ returnBackUrl: "/dashboard/data" });
    return null;
  }

  const { jobId: rawJobId } = await params;
  const jobId = decodeURIComponent(rawJobId);

  const sp = searchParams != null ? await searchParams : {};
  const rawRunId = sp.runId;
  const runIdFromSearch =
    typeof rawRunId === "string"
      ? rawRunId
      : Array.isArray(rawRunId)
        ? rawRunId[0]
        : undefined;

  return (
    <PageContainer padding="xs" spacing="lg">
      {/* Page heading (scope + job id) is rendered in ScraperJobDetailClient after job loads */}
      <ScraperJobDetailClient jobId={jobId} runIdFromSearch={runIdFromSearch} />
    </PageContainer>
  );
}
