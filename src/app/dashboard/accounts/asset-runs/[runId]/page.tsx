import { auth } from "@clerk/nextjs/server";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { AccountAssetRunDetailClient } from "./components/AccountAssetRunDetailClient";
import type { AccountAssetRunAccountOrgType } from "@/lib/account-asset-run/accountRoutes";

interface PageProps {
  params: Promise<{ runId: string }>;
  searchParams?: Promise<{
    accountId?: string | string[];
    accountType?: string | string[];
  }>;
}

function parseOrgType(raw: unknown): AccountAssetRunAccountOrgType | null {
  const v =
    typeof raw === "string"
      ? raw
      : Array.isArray(raw)
        ? raw[0]
        : undefined;
  if (v === "club" || v === "association") return v;
  return null;
}

export default async function AccountAssetRunDetailPage({
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
          Invalid run ID. Use a numeric account asset run id from the renders
          tab or dashboard list.
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

  const accountTypeFromSearch = parseOrgType(sp.accountType);

  return (
    <AccountAssetRunDetailClient
      runId={runIdNum}
      accountIdFromSearch={accountIdFromSearch}
      accountTypeFromSearch={accountTypeFromSearch}
    />
  );
}
