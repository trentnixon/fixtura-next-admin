import { SchedulerRollupData } from "@/app/dashboard/components/SchedulerRollupData";
import { auth } from "@clerk/nextjs/server";
import LiveOverview from "./components/LiveOverview";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { GlobalDataCollectionInsights } from "./components/GlobalDataCollectionInsights";

export default async function DashboardPage() {
  // Retrieve the user's authentication details
  const { userId, redirectToSignIn } = await auth();

  // If the user is not authenticated, redirect to the sign-in page
  if (!userId) {
    redirectToSignIn({ returnBackUrl: "/dashboard" });
    return null; // Avoid rendering anything after redirect
  }

  return (
    <>
      <CreatePageTitle
        title="Fixtura Admin Dashboard"
        byLine="Overview and monitoring"
        byLineBottom="Real-time insights into schedulers, renders, and data collection"
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Live Overview"
          description="Current status of rendering and queued accounts"
        >
          <LiveOverview />
        </SectionContainer>

        <SectionContainer
          title="Schedulers"
          description="Scheduler metrics and expected renders"
        >
          <SchedulerRollupData />
        </SectionContainer>

        <GlobalDataCollectionInsights />

        <SectionContainer
          title="Renders"
          description="Render statistics and analytics"
        >
          <div className="text-sm text-muted-foreground">
            Render details coming soon...
          </div>
        </SectionContainer>
      </PageContainer>
    </>
  );
}
