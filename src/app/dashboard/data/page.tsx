import { auth } from "@clerk/nextjs/server";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { ScraperOperationsStrip } from "./components/ScraperOperationsStrip";
import { ScraperLogsSectionWithScopeSelector } from "./components/ScraperLogsSectionWithScopeSelector";

export default async function DataPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn({ returnBackUrl: "/dashboard/data" });
    return null;
  }

  return (
    <>
      <CreatePageTitle
        title="Data / Scraping"
        byLine="Data collection operations"
        byLineBottom="Scrape triggers, pipeline status, and job logs"
      >
        <DashboardLinkButton
          href="/dashboard?tab=collection"
          trailingIcon="external"
        >
          Dashboard
        </DashboardLinkButton>
      </CreatePageTitle>
      <PageContainer padding="xs" spacing="lg">
        <div className="space-y-6">
          <ScraperOperationsStrip />
          <ScraperLogsSectionWithScopeSelector />
        </div>
      </PageContainer>
    </>
  );
}
