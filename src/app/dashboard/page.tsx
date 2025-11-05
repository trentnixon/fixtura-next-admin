import { SchedulerRollupData } from "@/app/dashboard/components/SchedulerRollupData";
import { SectionTitle } from "@/components/type/titles";
import { auth } from "@clerk/nextjs/server";
import LiveOverview from "./components/LiveOverview";
import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { GlobalDataCollectionInsights } from "./components/GlobalDataCollectionInsights";
//import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Retrieve the user's authentication details
  const { userId, redirectToSignIn } = await auth();

  // If the user is not authenticated, redirect to the sign-in page
  if (!userId) {
    redirectToSignIn({ returnBackUrl: "/dashboard" });
    return null; // Avoid rendering anything after redirect
  }

  return (
    <CreatePage>
      <CreatePageTitle title="Fixtura Admin Dashboard" byLine="Overview" />

      <section className="flex flex-col gap-8 my-8">
        <SectionTitle>LIVE</SectionTitle>
        <LiveOverview />
      </section>

      <section className="flex flex-col gap-4 my-4">
        <SectionTitle>Schedulers</SectionTitle>
        <SchedulerRollupData />
      </section>
      <section className="flex flex-col gap-4 my-4">
        <SectionTitle>Data Collection Insights</SectionTitle>
        <GlobalDataCollectionInsights />
      </section>
      <section className="flex flex-col gap-4 my-4">
        <SectionTitle>Renders</SectionTitle>
      </section>
    </CreatePage>
  );
}
