import { SchedulerRollupData } from "@/app/dashboard/components/SchedulerRollupData";
import { SectionTitle } from "@/components/type/titles";
import { auth } from "@clerk/nextjs/server";
import QuickView from "./components/quickView";
import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
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
        <SectionTitle>Account</SectionTitle>

        <QuickView />
      </section>
      <section className="flex flex-col gap-4 my-4">
        <SectionTitle>Schedulers</SectionTitle>
        <SchedulerRollupData />
      </section>
      <section className="flex flex-col gap-4 my-4">
        <SectionTitle>Renders</SectionTitle>
        [Check Scraper] Check the status of the scraper, to see if any are still
        in the queue
      </section>
    </CreatePage>
  );
}
