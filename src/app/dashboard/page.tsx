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
    </>
  );
}
