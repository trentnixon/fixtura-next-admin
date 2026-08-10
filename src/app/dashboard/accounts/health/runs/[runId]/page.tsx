import { auth } from "@clerk/nextjs/server";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { AccountHealthRunDetailClient } from "./components/AccountHealthRunDetailClient";

interface PageProps {
  params: Promise<{ runId: string }>;
  searchParams?: Promise<{ accountId?: string | string[] }>;
}

export default async function AccountHealthRunDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn({ returnBackUrl: "/dashboard" });
    return null;
  }

  const { runId: rawRunId } = await params;
  const runIdNum = Number(rawRunId);

  if (!Number.isFinite(runIdNum) || runIdNum <= 0) {
    return (
      <PageContainer padding="xs" spacing="md">
        <p className="text-sm text-muted-foreground">
          Invalid run ID. Use a numeric health run id from the data refresh
          panel.
        </p>
      </PageContainer>
    );
  }

  const sp = searchParams != null ? await searchParams : {};
  const rawAccountId = sp.accountId;
  const accountIdFromSearch =
    typeof rawAccountId === "string"
      ? rawAccountId
      : Array.isArray(rawAccountId)
        ? rawAccountId[0]
        : null;

  return (
    <AccountHealthRunDetailClient
      runId={runIdNum}
      accountIdFromSearch={accountIdFromSearch}
    />
  );
}
