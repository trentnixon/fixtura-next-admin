import { auth } from "@clerk/nextjs/server";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
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
      />
      <PageContainer padding="xs" spacing="md">
        <ScraperOperationsStrip />
        <ScraperLogsSectionWithScopeSelector />
      </PageContainer>
    </>
  );
}
