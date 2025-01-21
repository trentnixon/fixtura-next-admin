import { auth } from "@clerk/nextjs/server";

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
    <>
      <h1 className="text-xl font-bold">Fixtura Admin Dashboard</h1>
      OVERVIEW
      <section>
        [Check Scheduler] Check the status of the scheduler, to see if any are
        still in the queue
      </section>
      <section>
        [Check Scraper] Check the status of the scraper, to see if any are still
        in the queue
      </section>
      <section>account stats and charts</section>
    </>
  );
}
